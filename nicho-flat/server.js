require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// Serve static files from /public or root (fallback)
const publicDir = path.join(__dirname, 'public');
const rootDir = __dirname;
app.use(express.static(publicDir));
app.use(express.static(rootDir));

// ─────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────

const BUYER_INTENTS = [
  'mejor', 'mejores', 'opiniones', 'opinión', 'barato', 'baratos',
  'calidad precio', 'comparativa', 'comparar', 'vs', 'review',
  'merece la pena', 'recomendado', 'oferta', 'precio', 'comprar',
  'donde comprar', 'análisis', 'valoración', 'ranking', 'top'
];

const ECOMMERCE_DOMAINS = ['amazon', 'aliexpress', 'ebay', 'pccomponentes', 'elcorteingles', 'fnac', 'mediamarkt'];
const FORUM_DOMAINS = ['reddit', 'quora', 'forocoches', 'mediavida', 'meneame', 'hard-gaming'];
const NICHE_INDICATORS = ['mejor', 'top', 'review', 'comparativa', 'analisis', 'guia'];

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
];

function randomUA() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─────────────────────────────────────────────
// 1. GOOGLE AUTOCOMPLETE
// ─────────────────────────────────────────────

async function getAutocompleteSuggestions(keyword) {
  const suggestions = new Set();
  const prefixes = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3'];
  const buyerMods = ['mejor', 'barato', 'review', 'opiniones', 'vs', 'comparativa', 'precio', 'oferta', 'comprar', 'recomendado'];

  // Base queries
  const queries = [keyword, ...buyerMods.map(m => `${keyword} ${m}`), ...buyerMods.map(m => `${m} ${keyword}`)];

  for (const query of queries.slice(0, 15)) {
    try {
      const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}&hl=es&gl=es`;
      const res = await axios.get(url, {
        headers: { 'User-Agent': randomUA() },
        timeout: 5000
      });
      const results = res.data[1] || [];
      results.forEach(s => suggestions.add(s.toLowerCase().trim()));
      await sleep(150);
    } catch (e) {
      // continue silently
    }
  }

  // Alphabet expansion
  for (const letter of prefixes.slice(0, 10)) {
    try {
      const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(keyword + ' ' + letter)}&hl=es&gl=es`;
      const res = await axios.get(url, {
        headers: { 'User-Agent': randomUA() },
        timeout: 4000
      });
      const results = res.data[1] || [];
      results.forEach(s => suggestions.add(s.toLowerCase().trim()));
      await sleep(100);
    } catch (e) {}
  }

  return [...suggestions].filter(s => s.length > 3 && s.includes(' '));
}

// ─────────────────────────────────────────────
// 2. KEYWORD SCORING
// ─────────────────────────────────────────────

function scoreKeyword(kw) {
  const words = kw.split(' ');
  const kwLower = kw.toLowerCase();

  // Buyer intent score (0-5)
  let intentScore = 0;
  for (const intent of BUYER_INTENTS) {
    if (kwLower.includes(intent)) {
      intentScore += intent.split(' ').length > 1 ? 2 : 1;
    }
  }
  intentScore = Math.min(5, intentScore);

  // Long tail score (more words = better)
  const longTailScore = Math.min(5, words.length - 1);

  // Estimated difficulty (inverse - lower competition = higher score)
  // We estimate based on keyword length and specificity
  const specificityScore = words.length >= 4 ? 4 : words.length >= 3 ? 3 : words.length >= 2 ? 2 : 1;

  // Total score (0-100)
  const total = Math.round(
    (intentScore * 30) +
    (longTailScore * 20) +
    (specificityScore * 25) +
    (Math.random() * 25) // Simulated search volume factor
  );

  let classification = 'DESCARTAR';
  if (total >= 70) classification = 'ENTRAR';
  else if (total >= 45) classification = 'PROBAR';

  return {
    keyword: kw,
    intentScore,
    longTailScore,
    specificityScore,
    totalScore: Math.min(100, total),
    classification,
    wordCount: words.length,
    hasBuyerIntent: intentScore > 0
  };
}

// ─────────────────────────────────────────────
// 3. SERP ANALYSIS
// ─────────────────────────────────────────────

async function analyzeSERP(keyword) {
  try {
    const url = `https://www.google.es/search?q=${encodeURIComponent(keyword)}&num=10&hl=es&gl=es`;
    const res = await axios.get(url, {
      headers: {
        'User-Agent': randomUA(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
      },
      timeout: 10000
    });

    const $ = cheerio.load(res.data);
    const results = [];

    $('div.g, div[data-sokoban-container]').each((i, el) => {
      if (i >= 10) return;
      const title = $(el).find('h3').first().text().trim();
      const link = $(el).find('a').first().attr('href');
      const snippet = $(el).find('.VwiC3b, span[data-ved]').first().text().trim();

      if (!title || !link || !link.startsWith('http')) return;

      let domain = '';
      try { domain = new URL(link).hostname.replace('www.', ''); } catch(e) {}

      const isEcommerce = ECOMMERCE_DOMAINS.some(d => domain.includes(d));
      const isForum = FORUM_DOMAINS.some(d => domain.includes(d));
      const isNiche = NICHE_INDICATORS.some(n => title.toLowerCase().includes(n));

      // Estimate domain authority
      let domainAuthority = 'MEDIA';
      if (isEcommerce) domainAuthority = 'MUY ALTA';
      else if (['wikipedia', 'gov', 'edu'].some(d => domain.includes(d))) domainAuthority = 'MUY ALTA';
      else if (isForum) domainAuthority = 'ALTA';
      else if (isNiche) domainAuthority = 'BAJA-MEDIA';

      results.push({
        position: results.length + 1,
        title,
        url: link,
        domain,
        snippet: snippet.substring(0, 200),
        isEcommerce,
        isForum,
        isNiche,
        domainAuthority,
        titleHasKeyword: title.toLowerCase().includes(keyword.split(' ')[0].toLowerCase()),
        titleLength: title.length
      });
    });

    // Opportunity analysis
    const hasForums = results.some(r => r.isForum);
    const hasEcommerce = results.some(r => r.isEcommerce);
    const nicheCount = results.filter(r => r.isNiche).length;
    const avgTitleLen = results.length > 0 ? Math.round(results.reduce((a, r) => a + r.titleLength, 0) / results.length) : 0;
    const lowAuthCount = results.filter(r => r.domainAuthority === 'BAJA-MEDIA').length;

    let opportunity = 'MEDIA';
    if (lowAuthCount >= 4 && nicheCount >= 2) opportunity = 'ALTA';
    else if (lowAuthCount >= 2 || hasForums) opportunity = 'MEDIA-ALTA';
    else if (!hasForums && !hasEcommerce) opportunity = 'ALTA';
    else opportunity = 'BAJA';

    return {
      keyword,
      results: results.slice(0, 10),
      summary: {
        totalResults: results.length,
        hasForums,
        hasEcommerce,
        nicheWebs: nicheCount,
        lowAuthorityResults: lowAuthCount,
        avgTitleLength: avgTitleLen,
        opportunity,
        recommendation: opportunity === 'ALTA'
          ? '✅ Nicho con buena oportunidad de entrada'
          : opportunity === 'MEDIA-ALTA'
          ? '⚡ Posible entrada con contenido de calidad'
          : opportunity === 'MEDIA'
          ? '⚠️ Competencia moderada, requiere estrategia'
          : '❌ Alta competencia, difícil posicionamiento'
      }
    };
  } catch (error) {
    return {
      keyword,
      results: [],
      error: 'No se pudo analizar el SERP. Google puede estar bloqueando temporalmente.',
      summary: {
        totalResults: 0,
        opportunity: 'DESCONOCIDA',
        recommendation: '⚠️ Análisis SERP no disponible temporalmente'
      }
    };
  }
}

// ─────────────────────────────────────────────
// 4. CONTENT GENERATOR
// ─────────────────────────────────────────────

function generateContent(keyword, productUrl = '') {
  const kw = keyword.toLowerCase();
  const kwCapital = keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const year = new Date().getFullYear();

  const titleVariants = [
    `Los ${Math.floor(Math.random() * 5) + 5} Mejores ${kwCapital} de ${year}: Análisis Completo`,
    `${kwCapital}: Guía de Compra Definitiva ${year} | Opiniones y Comparativa`,
    `¿Cuál es el Mejor ${kwCapital}? Ranking y Análisis Actualizado ${year}`,
  ];

  const title = titleVariants[Math.floor(Math.random() * titleVariants.length)];
  const metaDesc = `Descubre los mejores ${kw} del ${year}. Análisis completo, opiniones reales y comparativa de precios. ✅ Guía actualizada para encontrar la mejor opción calidad-precio.`;

  const h1 = `Mejores ${kwCapital} ${year}: Análisis y Comparativa Completa`;
  const h2s = [
    `¿Qué es ${kwCapital} y para qué sirve?`,
    `Los Mejores ${kwCapital} del Mercado`,
    `Análisis Detallado: Top 5 Opciones`,
    `Factores Clave para Elegir el Mejor ${kwCapital}`,
    `Comparativa de Precios y Características`,
    `Opiniones de Usuarios Reales`,
    `Preguntas Frecuentes sobre ${kwCapital}`,
    `Nuestra Recomendación Final`
  ];

  const intro = `Si estás buscando el mejor **${kw}** del mercado, has llegado al lugar correcto. En esta guía exhaustiva hemos analizado más de 20 opciones disponibles en el mercado español, comparando calidad, precio y opiniones de usuarios reales para ofrecerte una selección definitiva.\n\nA lo largo de los últimos meses, nuestro equipo de expertos ha probado y evaluado cada producto para que tú no tengas que hacerlo. Aquí encontrarás todo lo que necesitas saber antes de tomar tu decisión de compra.`;

  const sections = h2s.map((h2, i) => {
    let content = '';
    if (i === 0) content = `El **${kw}** se ha convertido en uno de los productos más buscados en España durante ${year}. Su popularidad responde a una combinación de factores: versatilidad, relación calidad-precio y la creciente demanda por parte de usuarios que buscan soluciones eficaces.\n\nEntender qué es exactamente y qué necesidades cubre te ayudará a tomar la mejor decisión de compra.`;
    else if (i === 1) content = `Después de analizar decenas de opciones, hemos seleccionado las mejores alternativas disponibles actualmente. Nuestra selección tiene en cuenta precio, calidad de materiales, opiniones verificadas de compradores y la relación calidad-precio general.\n\n**Criterios de selección:**\n- ✅ Valoración media superior a 4/5 estrellas\n- ✅ Más de 100 opiniones verificadas\n- ✅ Disponibilidad inmediata\n- ✅ Relación calidad-precio óptima`;
    else if (i === 3) content = `Para elegir correctamente entre todas las opciones de **${kw}** disponibles, debes tener en cuenta una serie de factores fundamentales que marcarán la diferencia entre una compra satisfactoria y un gasto innecesario.\n\n**1. Calidad de fabricación:** Los materiales utilizados determinan la durabilidad del producto.\n**2. Precio:** Establece un presupuesto realista. Los mejores productos suelen estar en la franja media.\n**3. Garantía:** Un fabricante que ofrece garantía larga demuestra confianza en su producto.\n**4. Opiniones:** Las valoraciones de otros compradores son la fuente más fiable de información real.`;
    else if (i === 6) content = `**¿Cuál es el mejor ${kw} calidad-precio?**\nDepende de tu presupuesto, pero generalmente las opciones de gama media ofrecen el mejor equilibrio.\n\n**¿Dónde es mejor comprarlo?**\nAmazon suele ofrecer los mejores precios y una política de devoluciones muy cómoda.\n\n**¿Merece la pena gastar más?**\nEn muchos casos sí, especialmente si planeas un uso intensivo o a largo plazo.`;
    else content = `Esta sección analiza en detalle los aspectos más relevantes de **${kw}** para ayudarte a tomar la mejor decisión. Nuestros expertos han evaluado cada característica con criterios objetivos y comparado con la competencia directa del mercado actual.`;
    return { h2, content };
  });

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": metaDesc,
    "datePublished": new Date().toISOString(),
    "dateModified": new Date().toISOString(),
    "author": { "@type": "Organization", "name": "NichoTool Experts" }
  };

  return {
    title,
    metaDesc,
    h1,
    h2s,
    sections,
    intro,
    schemaMarkup: JSON.stringify(schemaMarkup, null, 2),
    estimatedWords: sections.reduce((acc, s) => acc + s.content.split(' ').length, 0) + intro.split(' ').length
  };
}

// ─────────────────────────────────────────────
// 5. AFFILIATE LINK PROCESSOR
// ─────────────────────────────────────────────

async function processAffiliateLink(url, affiliateId = '') {
  let processedUrl = url;
  let platform = 'Unknown';

  try {
    const parsed = new URL(url);
    const domain = parsed.hostname.toLowerCase();

    if (domain.includes('amazon')) {
      platform = 'Amazon';
      // Clean Amazon URL and add affiliate tag
      const asin = url.match(/\/([A-Z0-9]{10})(?:\/|\?|$)/);
      if (asin) {
        processedUrl = `https://www.amazon.es/dp/${asin[1]}${affiliateId ? `?tag=${affiliateId}` : ''}`;
      } else if (affiliateId) {
        processedUrl = url.includes('?')
          ? `${url}&tag=${affiliateId}`
          : `${url}?tag=${affiliateId}`;
      }
    } else if (domain.includes('aliexpress')) {
      platform = 'AliExpress';
      processedUrl = affiliateId
        ? `${url}${url.includes('?') ? '&' : '?'}aff_id=${affiliateId}`
        : url;
    }

    // Try to fetch product info
    let productInfo = { title: '', image: '', price: '', description: '' };

    try {
      const res = await axios.get(url, {
        headers: { 'User-Agent': randomUA() },
        timeout: 8000
      });
      const $ = cheerio.load(res.data);

      if (platform === 'Amazon') {
        productInfo.title = $('#productTitle').text().trim() || $('h1').first().text().trim();
        productInfo.image = $('#landingImage').attr('src') || $('#imgBlkFront').attr('src') || '';
        productInfo.price = $('.a-price-whole').first().text().trim() ||
          $('[data-a-size="xl"]').first().text().trim() || 'Ver precio';
        productInfo.description = $('#feature-bullets li').map((i, el) => $(el).text().trim()).get().slice(0, 4).join(' | ');
      } else {
        productInfo.title = $('meta[property="og:title"]').attr('content') || $('title').text().trim();
        productInfo.image = $('meta[property="og:image"]').attr('content') || '';
        productInfo.price = $('meta[property="product:price:amount"]').attr('content') || 'Ver precio';
        productInfo.description = $('meta[name="description"]').attr('content') || '';
      }
    } catch (e) {
      productInfo.title = `Producto en ${platform}`;
      productInfo.description = 'Haz clic para ver detalles y precio actualizado.';
    }

    return {
      platform,
      originalUrl: url,
      affiliateUrl: processedUrl,
      affiliateId,
      product: productInfo
    };
  } catch (err) {
    return { error: 'URL no válida', platform: 'Unknown' };
  }
}

// ─────────────────────────────────────────────
// 6. WEB GENERATOR
// ─────────────────────────────────────────────

function generateWebsite(keyword, content, affiliateData = null) {
  const kw = keyword;
  const kwSlug = keyword.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const year = new Date().getFullYear();

  const productCard = affiliateData && affiliateData.product ? `
    <div class="product-card">
      ${affiliateData.product.image ? `<img src="${affiliateData.product.image}" alt="${affiliateData.product.title}" loading="lazy">` : ''}
      <div class="product-info">
        <h3>${affiliateData.product.title || 'Producto Recomendado'}</h3>
        <p>${affiliateData.product.description || ''}</p>
        <div class="product-price">${affiliateData.product.price || ''}</div>
        <a href="${affiliateData.affiliateUrl}" class="btn-buy" target="_blank" rel="nofollow noopener">
          Ver en ${affiliateData.platform} →
        </a>
      </div>
    </div>` : '';

  const sectionsHTML = content.sections.slice(0, 5).map(s => `
    <section class="article-section">
      <h2>${s.h2}</h2>
      <p>${s.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '</p><p>')}</p>
    </section>`).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.title}</title>
  <meta name="description" content="${content.metaDesc}">
  <meta property="og:title" content="${content.title}">
  <meta property="og:description" content="${content.metaDesc}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://tudominio.com/${kwSlug}/">
  <script type="application/ld+json">${content.schemaMarkup}</script>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --primary: #0ea5e9;
      --dark: #0f172a;
      --text: #334155;
      --bg: #f8fafc;
      --border: #e2e8f0;
      --radius: 12px;
    }
    body { font-family: 'Segoe UI', system-ui, sans-serif; color: var(--text); background: var(--bg); line-height: 1.7; }
    header { background: var(--dark); color: white; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; }
    header .logo { font-weight: 800; font-size: 1.2rem; color: var(--primary); }
    nav a { color: #94a3b8; text-decoration: none; margin-left: 20px; font-size: 0.9rem; }
    nav a:hover { color: white; }
    .hero { background: linear-gradient(135deg, var(--dark) 0%, #1e3a5f 100%); color: white; padding: 60px 24px; text-align: center; }
    .hero h1 { font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 900; max-width: 800px; margin: 0 auto 16px; }
    .hero p { color: #94a3b8; font-size: 1.1rem; max-width: 600px; margin: 0 auto; }
    .container { max-width: 900px; margin: 0 auto; padding: 40px 24px; }
    .breadcrumb { font-size: 0.85rem; color: #94a3b8; margin-bottom: 24px; }
    .breadcrumb a { color: var(--primary); text-decoration: none; }
    .article-intro { background: white; border-radius: var(--radius); padding: 28px; border: 1px solid var(--border); margin-bottom: 32px; font-size: 1.05rem; line-height: 1.8; }
    .article-section { background: white; border-radius: var(--radius); padding: 28px; border: 1px solid var(--border); margin-bottom: 24px; }
    .article-section h2 { font-size: 1.4rem; font-weight: 700; color: var(--dark); margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid var(--primary); }
    .article-section p { margin-bottom: 12px; }
    .product-card { background: white; border-radius: var(--radius); border: 2px solid var(--primary); padding: 24px; display: flex; gap: 24px; align-items: flex-start; margin: 32px 0; }
    .product-card img { width: 160px; height: 160px; object-fit: contain; border-radius: 8px; flex-shrink: 0; }
    .product-info h3 { font-size: 1.15rem; font-weight: 700; margin-bottom: 8px; color: var(--dark); }
    .product-info p { font-size: 0.9rem; color: #64748b; margin-bottom: 12px; }
    .product-price { font-size: 1.5rem; font-weight: 900; color: #059669; margin-bottom: 16px; }
    .btn-buy { display: inline-block; background: var(--primary); color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 1rem; transition: opacity 0.2s; }
    .btn-buy:hover { opacity: 0.85; }
    .toc { background: #f0f9ff; border-left: 4px solid var(--primary); padding: 20px 24px; border-radius: 0 var(--radius) var(--radius) 0; margin-bottom: 32px; }
    .toc h4 { font-weight: 700; margin-bottom: 12px; color: var(--dark); }
    .toc ol { padding-left: 20px; }
    .toc li { margin-bottom: 6px; }
    .toc a { color: var(--primary); text-decoration: none; font-size: 0.95rem; }
    footer { background: var(--dark); color: #64748b; text-align: center; padding: 32px 24px; font-size: 0.85rem; margin-top: 60px; }
    footer a { color: #94a3b8; text-decoration: none; margin: 0 8px; }
    @media (max-width: 600px) {
      .product-card { flex-direction: column; }
      .product-card img { width: 100%; height: 200px; }
    }
  </style>
</head>
<body>
  <header>
    <div class="logo">NichoSite</div>
    <nav>
      <a href="/">Inicio</a>
      <a href="/comparativas/">Comparativas</a>
      <a href="/reviews/">Reviews</a>
    </nav>
  </header>

  <div class="hero">
    <h1>${content.h1}</h1>
    <p>Guía actualizada ${year} con análisis independiente y opiniones reales</p>
  </div>

  <div class="container">
    <div class="breadcrumb">
      <a href="/">Inicio</a> › <a href="/mejores/">Mejores</a> › ${kw}
    </div>

    <div class="toc">
      <h4>📋 Contenido del artículo</h4>
      <ol>
        ${content.h2s.slice(0, 6).map(h => `<li><a href="#">${h}</a></li>`).join('')}
      </ol>
    </div>

    <div class="article-intro">
      ${content.intro.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n\n/g, '</p><p>')}
    </div>

    ${productCard}
    ${sectionsHTML}
  </div>

  <footer>
    <p>© ${year} NichoSite · <a href="#">Aviso legal</a> · <a href="#">Política de privacidad</a> · <a href="#">Política de cookies</a></p>
    <p style="margin-top:8px;">Este sitio contiene enlaces de afiliado. Si compras a través de ellos, podemos recibir una comisión sin coste adicional para ti.</p>
  </footer>
</body>
</html>`;
}

// ─────────────────────────────────────────────
// API ROUTES
// ─────────────────────────────────────────────

// Analyze keyword - get suggestions and scores
app.post('/api/analyze', async (req, res) => {
  const { keyword } = req.body;
  if (!keyword || keyword.trim().length < 2) {
    return res.status(400).json({ error: 'Keyword inválida' });
  }

  try {
    const suggestions = await getAutocompleteSuggestions(keyword.trim());

    // Always include the original keyword variants
    const allKeywords = [
      keyword.trim(),
      ...BUYER_INTENTS.slice(0, 8).map(i => `${keyword.trim()} ${i}`),
      ...suggestions
    ];

    // Deduplicate and score
    const unique = [...new Set(allKeywords.map(k => k.toLowerCase().trim()))];
    const scored = unique
      .filter(k => k.length > 2)
      .map(scoreKeyword)
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 60);

    res.json({
      keyword: keyword.trim(),
      total: scored.length,
      keywords: scored,
      summary: {
        entrar: scored.filter(k => k.classification === 'ENTRAR').length,
        probar: scored.filter(k => k.classification === 'PROBAR').length,
        descartar: scored.filter(k => k.classification === 'DESCARTAR').length,
        withBuyerIntent: scored.filter(k => k.hasBuyerIntent).length
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Error en el análisis: ' + err.message });
  }
});

// Analyze SERP for a specific keyword
app.post('/api/serp', async (req, res) => {
  const { keyword } = req.body;
  if (!keyword) return res.status(400).json({ error: 'Keyword requerida' });

  try {
    const serp = await analyzeSERP(keyword.trim());
    res.json(serp);
  } catch (err) {
    res.status(500).json({ error: 'Error SERP: ' + err.message });
  }
});

// Generate SEO content
app.post('/api/content', async (req, res) => {
  const { keyword, productUrl } = req.body;
  if (!keyword) return res.status(400).json({ error: 'Keyword requerida' });

  try {
    const content = generateContent(keyword.trim(), productUrl);
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: 'Error generando contenido: ' + err.message });
  }
});

// Process affiliate link
app.post('/api/affiliate', async (req, res) => {
  const { url, affiliateId } = req.body;
  if (!url) return res.status(400).json({ error: 'URL requerida' });

  try {
    const data = await processAffiliateLink(url, affiliateId || '');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error procesando enlace: ' + err.message });
  }
});

// Generate website HTML
app.post('/api/generate-web', async (req, res) => {
  const { keyword, affiliateUrl, affiliateId } = req.body;
  if (!keyword) return res.status(400).json({ error: 'Keyword requerida' });

  try {
    const content = generateContent(keyword.trim());
    let affiliateData = null;

    if (affiliateUrl) {
      affiliateData = await processAffiliateLink(affiliateUrl, affiliateId || '');
    }

    const html = generateWebsite(keyword.trim(), content, affiliateData);

    res.json({
      html,
      filename: `${keyword.toLowerCase().replace(/\s+/g, '-')}.html`,
      wordCount: content.estimatedWords
    });
  } catch (err) {
    res.status(500).json({ error: 'Error generando web: ' + err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '2.0.0', timestamp: new Date().toISOString() });
});

// Serve frontend
app.get('*', (req, res) => {
  const indexInPublic = path.join(__dirname, 'public', 'index.html');
  const indexInRoot = path.join(__dirname, 'index.html');
  const fs = require('fs');
  if (fs.existsSync(indexInPublic)) {
    res.sendFile(indexInPublic);
  } else {
    res.sendFile(indexInRoot);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 NichoTool v2.0 running on port ${PORT}`);
});

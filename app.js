/* ═══════════════════════════════════════
   NICHOTOOL PRO — app.js v2.0
═══════════════════════════════════════ */

const API = '';

// ─── STATE ───
let allKeywords = [];
let currentFilter = 'all';

// ─── DOM REFS ───
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ─── NAVIGATION ───
$$('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    $$('.nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    $$('.tab-pane').forEach(p => p.classList.add('hidden'));
    $(`#tab-${tab}`).classList.remove('hidden');
    const labels = {
      analyzer: 'Analizar Nicho',
      serp: 'Análisis SERP',
      content: 'Generar Contenido',
      affiliate: 'Integración Afiliados',
      generator: 'Generar Web'
    };
    $('#breadcrumb').textContent = `Dashboard / ${labels[tab] || tab}`;
    // Close mobile menu
    $('#sidebar').classList.remove('open');
  });
});

$('#menuToggle').addEventListener('click', () => {
  $('#sidebar').classList.toggle('open');
});

// ─── TOAST ───
function toast(msg, duration = 2800) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), duration);
}

function copyToClipboard(text, label = 'Texto') {
  navigator.clipboard.writeText(text).then(() => toast(`✅ ${label} copiado`));
}

// ─── HELPERS ───
function setKw(kw) {
  $('#kwInput').value = kw;
  $('#kwInput').focus();
}

function showLoader(id) { $(`#${id}`).classList.remove('hidden'); }
function hideLoader(id) { $(`#${id}`).classList.add('hidden'); }
function showResults(id) { $(`#${id}`).classList.remove('hidden'); }
function hideResults(id) { $(`#${id}`).classList.add('hidden'); }

function scoreColor(score) {
  if (score >= 70) return '#10b981';
  if (score >= 45) return '#f59e0b';
  return '#ef4444';
}

// ─── API CALLS ───
async function apiPost(endpoint, data) {
  const res = await fetch(`${API}/api/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Error ${res.status}`);
  }
  return res.json();
}

// ═══════════════════════════════════════
// 1. ANALYZER
// ═══════════════════════════════════════

$('#btnAnalyze').addEventListener('click', runAnalyzer);
$('#kwInput').addEventListener('keydown', e => { if (e.key === 'Enter') runAnalyzer(); });

async function runAnalyzer() {
  const keyword = $('#kwInput').value.trim();
  if (!keyword) { toast('⚠️ Introduce una keyword'); return; }

  hideResults('analyzerResults');
  showLoader('analyzerLoader');
  $('#btnAnalyze').disabled = true;

  try {
    const data = await apiPost('analyze', { keyword });
    allKeywords = data.keywords;
    renderAnalyzerResults(data);
    showResults('analyzerResults');
  } catch (err) {
    toast('❌ Error: ' + err.message);
  } finally {
    hideLoader('analyzerLoader');
    $('#btnAnalyze').disabled = false;
  }
}

function renderAnalyzerResults(data) {
  // Stats
  $('#statsRow').innerHTML = `
    <div class="stat-card total">
      <div class="stat-value">${data.total}</div>
      <div class="stat-label">Keywords Totales</div>
    </div>
    <div class="stat-card entrar">
      <div class="stat-value">${data.summary.entrar}</div>
      <div class="stat-label">✅ Entrar</div>
    </div>
    <div class="stat-card probar">
      <div class="stat-value">${data.summary.probar}</div>
      <div class="stat-label">⚡ Probar</div>
    </div>
    <div class="stat-card descartar">
      <div class="stat-value">${data.summary.withBuyerIntent}</div>
      <div class="stat-label">💰 Con Intención</div>
    </div>
  `;

  // Filter buttons
  $$('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderKeywordsGrid();
    });
  });

  currentFilter = 'all';
  renderKeywordsGrid();
}

function renderKeywordsGrid() {
  let filtered = allKeywords;

  if (currentFilter === 'ENTRAR') filtered = allKeywords.filter(k => k.classification === 'ENTRAR');
  else if (currentFilter === 'PROBAR') filtered = allKeywords.filter(k => k.classification === 'PROBAR');
  else if (currentFilter === 'DESCARTAR') filtered = allKeywords.filter(k => k.classification === 'DESCARTAR');
  else if (currentFilter === 'intent') filtered = allKeywords.filter(k => k.hasBuyerIntent);

  if (filtered.length === 0) {
    $('#keywordsGrid').innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">🔍</div><p>No hay resultados para este filtro</p></div>`;
    return;
  }

  $('#keywordsGrid').innerHTML = filtered.map(k => `
    <div class="kw-card ${k.classification}">
      <div class="kw-header">
        <div class="kw-text">${k.keyword}</div>
        <div class="kw-badge badge-${k.classification}">${k.classification}</div>
      </div>
      <div class="kw-scores">
        <div class="score-pill">Intención: <span>${k.intentScore}/5</span></div>
        <div class="score-pill">Long tail: <span>${k.wordCount}p</span></div>
        <div class="score-pill">Especificidad: <span>${k.specificityScore}/5</span></div>
        ${k.hasBuyerIntent ? '<div class="score-pill" style="border-color:#10b981;color:#10b981">💰 Compra</div>' : ''}
      </div>
      <div class="kw-score-bar">
        <div class="score-bar-track">
          <div class="score-bar-fill ${k.classification}" style="width:${k.totalScore}%"></div>
        </div>
        <div class="score-num" style="color:${scoreColor(k.totalScore)}">${k.totalScore}</div>
      </div>
      <div class="kw-actions">
        <button class="btn-secondary" onclick="useForSerp('${k.keyword.replace(/'/g, "\\'")}')">📊 SERP</button>
        <button class="btn-secondary" onclick="useForContent('${k.keyword.replace(/'/g, "\\'")}')">✍️ Contenido</button>
        <button class="btn-secondary" onclick="copyToClipboard('${k.keyword.replace(/'/g, "\\'")}', 'Keyword')">📋</button>
      </div>
    </div>
  `).join('');
}

function useForSerp(kw) {
  $('#serpInput').value = kw;
  $$('.nav-item').forEach(b => b.classList.remove('active'));
  $('[data-tab="serp"]').classList.add('active');
  $$('.tab-pane').forEach(p => p.classList.add('hidden'));
  $('#tab-serp').classList.remove('hidden');
  $('#breadcrumb').textContent = 'Dashboard / Análisis SERP';
  toast(`📊 Keyword "${kw}" lista para analizar SERP`);
}

function useForContent(kw) {
  $('#contentInput').value = kw;
  $$('.nav-item').forEach(b => b.classList.remove('active'));
  $('[data-tab="content"]').classList.add('active');
  $$('.tab-pane').forEach(p => p.classList.add('hidden'));
  $('#tab-content').classList.remove('hidden');
  $('#breadcrumb').textContent = 'Dashboard / Generar Contenido';
  toast(`✍️ Keyword "${kw}" lista para generar contenido`);
}

// ═══════════════════════════════════════
// 2. SERP
// ═══════════════════════════════════════

$('#btnSerp').addEventListener('click', runSerp);
$('#serpInput').addEventListener('keydown', e => { if (e.key === 'Enter') runSerp(); });

async function runSerp() {
  const keyword = $('#serpInput').value.trim();
  if (!keyword) { toast('⚠️ Introduce una keyword'); return; }

  hideResults('serpResults');
  showLoader('serpLoader');
  $('#btnSerp').disabled = true;

  try {
    const data = await apiPost('serp', { keyword });
    renderSerpResults(data);
    showResults('serpResults');
  } catch (err) {
    toast('❌ Error: ' + err.message);
  } finally {
    hideLoader('serpLoader');
    $('#btnSerp').disabled = false;
  }
}

function renderSerpResults(data) {
  const s = data.summary;
  const oppClass = `opp-${(s.opportunity || 'DESCONOCIDA').replace(/\s+/g, '-')}`;

  let html = `
    <div class="serp-summary">
      <div>
        <div style="font-size:0.75rem;color:var(--text3);text-transform:uppercase;font-weight:700;letter-spacing:1px;margin-bottom:10px">Resumen del SERP</div>
        <div class="serp-summary-stats">
          <div class="serp-stat">🏪 Ecommerce: <strong>${s.hasEcommerce ? 'SÍ' : 'NO'}</strong></div>
          <div class="serp-stat">💬 Foros: <strong>${s.hasForums ? 'SÍ' : 'NO'}</strong></div>
          <div class="serp-stat">🌐 Webs nicho: <strong>${s.nicheWebs || 0}</strong></div>
          <div class="serp-stat">📉 Baja autoridad: <strong>${s.lowAuthorityResults || 0}/10</strong></div>
          <div class="serp-stat">📏 Títulos (media): <strong>${s.avgTitleLength || '—'} chars</strong></div>
        </div>
      </div>
      <div class="opportunity-badge ${oppClass}">Oportunidad: ${s.opportunity || 'Desconocida'}</div>
      <div class="serp-recommendation">${s.recommendation || ''}</div>
    </div>
  `;

  if (data.error) {
    html += `<div class="content-block"><div class="content-block-body" style="color:var(--warn)">⚠️ ${data.error}</div></div>`;
  }

  if (data.results && data.results.length > 0) {
    html += `<div class="serp-list">`;
    html += data.results.map(r => {
      const daClass = r.domainAuthority === 'MUY ALTA' ? 'tag-da-high' :
                     r.domainAuthority === 'ALTA' ? 'tag-da-high' : 'tag-da-med';
      return `
        <div class="serp-item">
          <div class="serp-item-header">
            <div class="serp-position">#${r.position}</div>
            <div>
              <div class="serp-item-title" onclick="window.open('${r.url}','_blank')">${r.title || '(sin título)'}</div>
              <div class="serp-domain">🌐 ${r.domain}</div>
            </div>
          </div>
          ${r.snippet ? `<div class="serp-snippet">${r.snippet}</div>` : ''}
          <div class="serp-tags">
            ${r.isEcommerce ? '<span class="serp-tag tag-ecommerce">🛒 Ecommerce</span>' : ''}
            ${r.isForum ? '<span class="serp-tag tag-forum">💬 Foro</span>' : ''}
            ${r.isNiche ? '<span class="serp-tag tag-niche">⚡ Web Nicho</span>' : ''}
            <span class="serp-tag ${daClass}">DA: ${r.domainAuthority}</span>
            ${r.titleHasKeyword ? '<span class="serp-tag tag-niche">🎯 KW en título</span>' : ''}
          </div>
        </div>
      `;
    }).join('');
    html += `</div>`;
  } else if (!data.error) {
    html += `<div class="empty-state"><div class="empty-icon">🔍</div><p>No se encontraron resultados para analizar</p></div>`;
  }

  $('#serpResults').innerHTML = html;
}

// ═══════════════════════════════════════
// 3. CONTENT GENERATOR
// ═══════════════════════════════════════

$('#btnContent').addEventListener('click', runContent);
$('#contentInput').addEventListener('keydown', e => { if (e.key === 'Enter') runContent(); });

async function runContent() {
  const keyword = $('#contentInput').value.trim();
  if (!keyword) { toast('⚠️ Introduce una keyword'); return; }

  hideResults('contentResults');
  showLoader('contentLoader');
  $('#btnContent').disabled = true;

  try {
    const data = await apiPost('content', { keyword });
    renderContentResults(data);
    showResults('contentResults');
  } catch (err) {
    toast('❌ Error: ' + err.message);
  } finally {
    hideLoader('contentLoader');
    $('#btnContent').disabled = false;
  }
}

function renderContentResults(data) {
  const blocks = [
    {
      title: '🔍 Preview en Google',
      body: `
        <div class="meta-preview">
          <div class="preview-title">${data.title}</div>
          <div class="preview-url">https://tudominio.com/mejores/keyword/</div>
          <div class="preview-desc">${data.metaDesc}</div>
        </div>
      `,
      copyText: data.title,
      copyLabel: 'Título'
    },
    {
      title: '📝 Meta Description',
      body: `<div>${data.metaDesc}</div>`,
      copyText: data.metaDesc,
      copyLabel: 'Meta description'
    },
    {
      title: '📰 H1 Principal',
      body: `<div style="font-size:1.05rem;font-weight:700;color:var(--text)">${data.h1}</div>`,
      copyText: data.h1,
      copyLabel: 'H1'
    },
    {
      title: `📋 Estructura H2 (${data.h2s.length} secciones)`,
      body: `<ol class="h2-list">${data.h2s.map(h => `<li>${h}</li>`).join('')}</ol>`,
      copyText: data.h2s.join('\n'),
      copyLabel: 'H2s'
    },
    {
      title: '✍️ Introducción del artículo',
      body: `<div style="line-height:1.8">${data.intro.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}</div>`,
      copyText: data.intro,
      copyLabel: 'Introducción'
    },
    ...data.sections.slice(0, 3).map((s, i) => ({
      title: `📄 Sección ${i + 1}: ${s.h2}`,
      body: `<div style="line-height:1.8">${s.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}</div>`,
      copyText: `## ${s.h2}\n\n${s.content}`,
      copyLabel: `Sección ${i + 1}`
    })),
    {
      title: '🔧 Schema Markup JSON-LD',
      body: `<pre class="schema-pre">${escapeHtml(data.schemaMarkup)}</pre>`,
      copyText: data.schemaMarkup,
      copyLabel: 'Schema markup'
    }
  ];

  const statsBar = `
    <div class="stats-row" style="margin-bottom:20px">
      <div class="stat-card total">
        <div class="stat-value" style="font-size:1.5rem">${data.estimatedWords}+</div>
        <div class="stat-label">Palabras estimadas</div>
      </div>
      <div class="stat-card entrar">
        <div class="stat-value" style="font-size:1.5rem">${data.h2s.length}</div>
        <div class="stat-label">Secciones H2</div>
      </div>
      <div class="stat-card probar">
        <div class="stat-value" style="font-size:1.5rem">${data.title.length}</div>
        <div class="stat-label">Chars en título</div>
      </div>
      <div class="stat-card descartar" style="--c:var(--accent)">
        <div class="stat-value" style="font-size:1.5rem;color:var(--accent)">${data.metaDesc.length}</div>
        <div class="stat-label">Chars en meta</div>
      </div>
    </div>
  `;

  $('#contentResults').innerHTML = statsBar + blocks.map(b => `
    <div class="content-block">
      <div class="content-block-header">
        <div class="content-block-title">${b.title}</div>
        ${b.copyText ? `<button class="copy-btn" onclick="copyToClipboard(${JSON.stringify(b.copyText)}, '${b.copyLabel}')">📋 Copiar</button>` : ''}
      </div>
      <div class="content-block-body">${b.body}</div>
    </div>
  `).join('');
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ═══════════════════════════════════════
// 4. AFFILIATE
// ═══════════════════════════════════════

$('#btnAffiliate').addEventListener('click', runAffiliate);

async function runAffiliate() {
  const url = $('#affiliateUrl').value.trim();
  const affiliateId = $('#affiliateId').value.trim();
  if (!url) { toast('⚠️ Introduce la URL del producto'); return; }

  hideResults('affiliateResults');
  showLoader('affiliateLoader');
  $('#btnAffiliate').disabled = true;

  try {
    const data = await apiPost('affiliate', { url, affiliateId });
    renderAffiliateResults(data);
    showResults('affiliateResults');
  } catch (err) {
    toast('❌ Error: ' + err.message);
  } finally {
    hideLoader('affiliateLoader');
    $('#btnAffiliate').disabled = false;
  }
}

function renderAffiliateResults(data) {
  if (data.error) {
    $('#affiliateResults').innerHTML = `<div class="content-block"><div class="content-block-body" style="color:var(--danger)">❌ ${data.error}</div></div>`;
    return;
  }

  const p = data.product || {};
  const imgHTML = p.image
    ? `<img class="product-img" src="${p.image}" alt="${p.title || 'Producto'}" onerror="this.style.display='none'">`
    : `<div class="product-img-placeholder">🛍️</div>`;

  $('#affiliateResults').innerHTML = `
    <div class="product-card-result">
      ${imgHTML}
      <div class="product-details">
        <div class="product-platform">${data.platform}</div>
        <div class="product-title">${p.title || 'Producto sin título'}</div>
        ${p.description ? `<div class="product-desc">${p.description.substring(0, 200)}${p.description.length > 200 ? '...' : ''}</div>` : ''}
        ${p.price && p.price !== 'Ver precio' ? `<div class="product-price">${p.price}€</div>` : ''}
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <a href="${data.affiliateUrl}" target="_blank" rel="nofollow noopener" class="btn-primary" style="text-decoration:none">
            <span>🛒</span> Ver producto
          </a>
          <button class="btn-secondary" onclick="copyToClipboard('${data.affiliateUrl.replace(/'/g, "\\'")}', 'Enlace afiliado')">📋 Copiar enlace</button>
        </div>
      </div>
    </div>
    <div class="affiliate-url-box">
      <div class="affiliate-url-label">🔗 Enlace de afiliado generado</div>
      <div class="affiliate-url-text">${data.affiliateUrl}</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn-secondary" onclick="copyToClipboard('${data.affiliateUrl.replace(/'/g, "\\'")}', 'URL afiliado')">📋 Copiar URL</button>
        <button class="btn-secondary" onclick="useForWebGen('${data.affiliateUrl.replace(/'/g, "\\'")}')">🚀 Usar en Generar Web</button>
      </div>
    </div>
    ${generateProductCardHTML(p, data.affiliateUrl, data.platform)}
  `;
}

function generateProductCardHTML(product, url, platform) {
  const card = `<div style="border:1px solid #e2e8f0;border-radius:12px;padding:20px;max-width:400px;font-family:system-ui">
  ${product.image ? `<img src="${product.image}" style="width:100%;max-height:200px;object-fit:contain;margin-bottom:12px" alt="">` : ''}
  <h3 style="font-size:1rem;margin-bottom:8px">${product.title || 'Producto'}</h3>
  ${product.price ? `<div style="font-size:1.4rem;font-weight:900;color:#059669;margin-bottom:12px">${product.price}€</div>` : ''}
  <a href="${url}" target="_blank" rel="nofollow" style="display:block;background:#0ea5e9;color:white;text-align:center;padding:12px;border-radius:8px;text-decoration:none;font-weight:700">Ver en ${platform} →</a>
</div>`;

  return `
    <div class="content-block" style="margin-top:16px">
      <div class="content-block-header">
        <div class="content-block-title">🃏 Ficha de producto (HTML)</div>
        <button class="copy-btn" onclick="copyToClipboard(${JSON.stringify(card)}, 'Ficha HTML')">📋 Copiar HTML</button>
      </div>
      <div class="content-block-body">
        <pre class="schema-pre" style="font-size:0.72rem;white-space:pre-wrap;word-break:break-all">${escapeHtml(card)}</pre>
      </div>
    </div>
  `;
}

function useForWebGen(url) {
  $('#genAffUrl').value = url;
  $$('.nav-item').forEach(b => b.classList.remove('active'));
  $('[data-tab="generator"]').classList.add('active');
  $$('.tab-pane').forEach(p => p.classList.add('hidden'));
  $('#tab-generator').classList.remove('hidden');
  $('#breadcrumb').textContent = 'Dashboard / Generar Web';
  toast('🚀 Enlace cargado en el generador de webs');
}

// ═══════════════════════════════════════
// 5. WEB GENERATOR
// ═══════════════════════════════════════

$('#btnGenerate').addEventListener('click', runGenerator);

async function runGenerator() {
  const keyword = $('#genKeyword').value.trim();
  const affiliateUrl = $('#genAffUrl').value.trim();
  const affiliateId = $('#genAffId').value.trim();

  if (!keyword) { toast('⚠️ Introduce una keyword'); return; }

  hideResults('generatorResults');
  showLoader('generatorLoader');
  $('#btnGenerate').disabled = true;

  try {
    const data = await apiPost('generate-web', { keyword, affiliateUrl, affiliateId });
    renderGeneratorResults(data);
    showResults('generatorResults');
  } catch (err) {
    toast('❌ Error: ' + err.message);
  } finally {
    hideLoader('generatorLoader');
    $('#btnGenerate').disabled = false;
  }
}

function renderGeneratorResults(data) {
  const blob = new Blob([data.html], { type: 'text/html;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);

  $('#generatorResults').innerHTML = `
    <div class="stats-row" style="margin-bottom:20px">
      <div class="stat-card total">
        <div class="stat-value" style="font-size:1.4rem">${data.wordCount || '1000'}+</div>
        <div class="stat-label">Palabras generadas</div>
      </div>
      <div class="stat-card entrar">
        <div class="stat-value" style="font-size:1.4rem">✅</div>
        <div class="stat-label">SEO Optimizado</div>
      </div>
      <div class="stat-card probar">
        <div class="stat-value" style="font-size:1.4rem">📱</div>
        <div class="stat-label">Responsive</div>
      </div>
      <div class="stat-card descartar" style="">
        <div class="stat-value" style="font-size:1.4rem;color:var(--accent)">⚡</div>
        <div class="stat-label">Velocidad A+</div>
      </div>
    </div>

    <div class="web-preview">
      <div class="web-preview-bar">
        <div class="web-preview-dots">
          <div class="dot red"></div>
          <div class="dot yellow"></div>
          <div class="dot green"></div>
        </div>
        <div style="font-size:0.78rem;color:var(--text3)">📄 ${data.filename}</div>
        <div style="font-size:0.75rem;color:var(--accent3)">Preview en vivo</div>
      </div>
      <iframe class="web-preview-iframe" src="${blobUrl}" title="Preview de la web generada"></iframe>
    </div>

    <div class="web-download-row">
      <button class="btn-primary" onclick="downloadHTML(${JSON.stringify(data.html)}, '${data.filename}')">
        <span>⬇️</span> Descargar HTML
      </button>
      <button class="btn-secondary" onclick="copyToClipboard(${JSON.stringify(data.html)}, 'HTML completo')">
        📋 Copiar HTML completo
      </button>
    </div>

    <div class="content-block" style="margin-top:16px">
      <div class="content-block-header">
        <div class="content-block-title">📌 Pasos para publicar</div>
      </div>
      <div class="content-block-body" style="line-height:2">
        1. Descarga el archivo HTML<br>
        2. Sube el archivo a tu servidor o hosting<br>
        3. Configura tu dominio para apuntar a la carpeta<br>
        4. Actualiza los enlaces de afiliado con tus IDs reales<br>
        5. Añade Google Analytics y Search Console<br>
        6. Crea enlaces internos entre tus artículos
      </div>
    </div>
  `;
}

function downloadHTML(html, filename) {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  toast('⬇️ Descargando ' + filename);
}

// ─── INIT ───
console.log('🚀 NichoTool Pro v2.0 loaded');

// ─── GUIDE NAVIGATION ───
function goTab(tab) {
  $$('.nav-item').forEach(b => b.classList.remove('active'));
  const btn = $(`[data-tab="${tab}"]`);
  if (btn) btn.classList.add('active');
  $$('.tab-pane').forEach(p => p.classList.add('hidden'));
  const pane = $(`#tab-${tab}`);
  if (pane) pane.classList.remove('hidden');
  const labels = {
    guia: 'Cómo funciona',
    analyzer: 'Paso 1 — Buscar Keywords',
    serp: 'Paso 2 — Ver Competencia',
    content: 'Paso 3 — Crear Artículo',
    affiliate: 'Paso 4 — Enlace Afiliado',
    generator: 'Paso 5 — Generar Web'
  };
  $('#breadcrumb').textContent = `Dashboard / ${labels[tab] || tab}`;
  $('#sidebar').classList.remove('open');
}

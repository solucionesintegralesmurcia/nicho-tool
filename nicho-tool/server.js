const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const patrones = [
  "mejor","opiniones","barato","calidad precio",
  "comparativa","vs","review","merece la pena"
];

const headers = { "User-Agent": "Mozilla/5.0" };

async function getSuggestions(query) {
  const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`;
  try {
    const res = await axios.get(url);
    return res.data[1];
  } catch {
    return [];
  }
}

function scoreKeyword(k, base) {
  let score = 0;
  const text = k.toLowerCase();

  if (patrones.some(p => text.includes(p))) score += 3;
  if (k.split(" ").length >= 3) score += 2;
  if (text.includes("barato") || text.includes("vs")) score += 2;
  if (text === base) score -= 3;

  return score;
}

async function analizarGoogle(k) {
  const url = `https://www.google.com/search?q=${encodeURIComponent(k)}`;
  try {
    const res = await axios.get(url, { headers });
    const $ = cheerio.load(res.data);

    let score = 0;

    $("h3").each((i, el) => {
      const t = $(el).text().toLowerCase();

      if (t.includes("foro") || t.includes("reddit")) score += 2;
      if (t.includes("amazon")) score -= 2;
      if (t.length < 40) score += 1;
    });

    return score;
  } catch {
    return 0;
  }
}

app.post("/analizar", async (req, res) => {
  const keyword = req.body.keyword;

  let sugerencias = await getSuggestions(keyword);

  let filtradas = sugerencias.filter(k =>
    patrones.some(p => k.includes(p))
  );

  filtradas = [...new Set(filtradas)];

  let resultados = [];

  for (let k of filtradas.slice(0, 10)) {

    const s = scoreKeyword(k, keyword);
    const serp = await analizarGoogle(k);

    const total = s + serp;

    let decision = "DESCARTAR";
    if (total >= 4) decision = "ENTRAR";
    if (total >= 2 && total < 4) decision = "PROBAR";

    resultados.push({ keyword: k, total, decision });
  }

  resultados.sort((a, b) => b.total - a.total);

  res.json(resultados);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor listo en puerto " + PORT);
});

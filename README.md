# ⬡ NichoTool Pro v2.0

**Detector de nichos rentables + Generador de webs de afiliación**

## 🚀 Despliegue en Render

1. Sube el proyecto a un repo de GitHub
2. En Render: New > Web Service > conecta el repo
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Environment: Node

## 💻 Desarrollo local

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`

## 📁 Estructura

```
nicho-tool/
├── server.js          # Backend Express + todas las APIs
├── package.json
├── .env.example
└── public/
    ├── index.html     # Frontend SaaS UI
    ├── style.css      # Diseño Pro Dark
    └── app.js         # Lógica frontend
```

## 🧠 Funcionalidades

- **Analizar Nicho**: 50+ keywords con scoring SEO automático
- **Análisis SERP**: Top 10 Google con detección de oportunidades
- **Generar Contenido**: H1/H2/H3 + meta + schema markup
- **Afiliados**: Procesa enlaces Amazon/AliExpress + ficha HTML
- **Generar Web**: Página HTML completa lista para publicar

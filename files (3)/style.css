/* ═══════════════════════════════════════
   NICHOTOOL PRO — STYLESHEET v2.0
   Design: Dark SaaS + Acid Accent
═══════════════════════════════════════ */

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #090c14;
  --bg2: #0e1320;
  --bg3: #131928;
  --surface: #161d2e;
  --surface2: #1c2538;
  --border: #1f2d45;
  --border2: #263348;
  --accent: #00e5ff;
  --accent2: #7c3aed;
  --accent3: #10b981;
  --danger: #ef4444;
  --warn: #f59e0b;
  --text: #e2e8f0;
  --text2: #94a3b8;
  --text3: #64748b;
  --sidebar-w: 240px;
  --topbar-h: 60px;
  --radius: 12px;
  --radius-lg: 18px;
  --shadow: 0 4px 24px rgba(0,0,0,0.4);
  --glow: 0 0 20px rgba(0,229,255,0.15);
  font-size: 15px;
}

body {
  font-family: 'DM Sans', system-ui, sans-serif;
  background: var(--bg);
  color: var(--text);
  display: flex;
  min-height: 100vh;
  overflow-x: hidden;
}

/* ─── SCROLLBAR ─── */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: var(--bg2); }
::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--text3); }

/* ─── SIDEBAR ─── */
.sidebar {
  width: var(--sidebar-w);
  background: var(--bg2);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  z-index: 100;
  transition: transform 0.3s ease;
}

.sidebar-logo {
  padding: 20px 20px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid var(--border);
}

.logo-icon {
  font-size: 1.4rem;
  filter: drop-shadow(0 0 8px var(--accent));
}

.logo-text {
  font-family: 'Syne', sans-serif;
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.5px;
}

.logo-text em {
  color: var(--accent);
  font-style: normal;
}

.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: var(--text2);
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: left;
  width: 100%;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: var(--surface);
  color: var(--text);
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(0,229,255,0.12), rgba(124,58,237,0.08));
  color: var(--accent);
  border: 1px solid rgba(0,229,255,0.2);
  box-shadow: var(--glow);
}

.nav-icon { font-size: 1rem; }

.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 10px;
}

.plan-badge {
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: var(--bg);
  font-size: 0.7rem;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 6px;
  font-family: 'Syne', sans-serif;
  letter-spacing: 1px;
}

.plan-text {
  font-size: 0.8rem;
  color: var(--text3);
}

/* ─── MAIN ─── */
.main-content {
  margin-left: var(--sidebar-w);
  flex: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ─── TOPBAR ─── */
.topbar {
  height: var(--topbar-h);
  background: var(--bg2);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 50;
}

.topbar-left { display: flex; align-items: center; gap: 14px; }

.menu-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--text2);
  font-size: 1.2rem;
  cursor: pointer;
}

.breadcrumb {
  font-size: 0.82rem;
  color: var(--text3);
  font-weight: 500;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 8px; height: 8px;
  background: var(--accent3);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--accent3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-text {
  font-size: 0.82rem;
  color: var(--text3);
}

/* ─── TAB CONTENT ─── */
.tab-content {
  flex: 1;
  padding: 32px 28px;
  max-width: 1100px;
  width: 100%;
}

.tab-pane { animation: fadeIn 0.3s ease; }
.tab-pane.hidden { display: none; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ─── PAGE HEADER ─── */
.page-header { margin-bottom: 28px; }

.page-header h1 {
  font-family: 'Syne', sans-serif;
  font-size: 1.9rem;
  font-weight: 900;
  color: var(--text);
  letter-spacing: -0.5px;
  margin-bottom: 6px;
}

.page-header p {
  color: var(--text3);
  font-size: 0.95rem;
}

/* ─── SEARCH CARD ─── */
.search-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  margin-bottom: 28px;
  box-shadow: var(--shadow);
}

.search-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-input {
  flex: 1;
  background: var(--bg2);
  border: 1px solid var(--border2);
  border-radius: 10px;
  padding: 13px 18px;
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input::placeholder { color: var(--text3); }
.search-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(0,229,255,0.1);
}

.search-input.small { max-width: 240px; flex: none; }

.form-group {
  margin-bottom: 14px;
}

.form-group label {
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

/* ─── BUTTONS ─── */
.btn-primary {
  background: linear-gradient(135deg, var(--accent), #00b4cc);
  color: var(--bg);
  border: none;
  border-radius: 10px;
  padding: 13px 24px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  transition: all 0.2s;
  box-shadow: 0 4px 16px rgba(0,229,255,0.25);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 24px rgba(0,229,255,0.35);
}

.btn-primary:active { transform: translateY(0); }

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: var(--surface2);
  color: var(--text2);
  border: 1px solid var(--border2);
  border-radius: 8px;
  padding: 9px 16px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: var(--border);
  color: var(--text);
}

.btn-icon { font-size: 1rem; }

/* ─── SEARCH TAGS ─── */
.search-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.tag {
  background: var(--bg3);
  border: 1px solid var(--border2);
  color: var(--text3);
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tag:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: rgba(0,229,255,0.05);
}

/* ─── STATS ROW ─── */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}

.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 18px 20px;
  text-align: center;
}

.stat-value {
  font-family: 'Syne', sans-serif;
  font-size: 2rem;
  font-weight: 900;
  line-height: 1;
  margin-bottom: 6px;
}

.stat-label {
  font-size: 0.78rem;
  color: var(--text3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-card.entrar .stat-value { color: var(--accent3); }
.stat-card.probar .stat-value { color: var(--warn); }
.stat-card.descartar .stat-value { color: var(--danger); }
.stat-card.total .stat-value { color: var(--accent); }

/* ─── FILTER BAR ─── */
.filter-bar {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.filter-btn {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text3);
  padding: 7px 14px;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover { color: var(--text); border-color: var(--border2); }

.filter-btn.active {
  background: rgba(0,229,255,0.1);
  border-color: var(--accent);
  color: var(--accent);
}

/* ─── KEYWORDS GRID ─── */
.keywords-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 12px;
}

.kw-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px 18px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.kw-card::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
}

.kw-card.ENTRAR::before { background: var(--accent3); }
.kw-card.PROBAR::before { background: var(--warn); }
.kw-card.DESCARTAR::before { background: var(--danger); }

.kw-card:hover {
  border-color: var(--border2);
  transform: translateY(-1px);
  box-shadow: var(--shadow);
}

.kw-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.kw-text {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text);
  line-height: 1.3;
  flex: 1;
  margin-right: 10px;
}

.kw-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  white-space: nowrap;
  letter-spacing: 0.5px;
}

.badge-ENTRAR { background: rgba(16,185,129,0.15); color: var(--accent3); border: 1px solid rgba(16,185,129,0.3); }
.badge-PROBAR { background: rgba(245,158,11,0.15); color: var(--warn); border: 1px solid rgba(245,158,11,0.3); }
.badge-DESCARTAR { background: rgba(239,68,68,0.15); color: var(--danger); border: 1px solid rgba(239,68,68,0.3); }

.kw-scores {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.score-pill {
  font-size: 0.72rem;
  padding: 2px 8px;
  border-radius: 12px;
  background: var(--bg2);
  color: var(--text3);
  border: 1px solid var(--border);
}

.score-pill span { color: var(--text2); font-weight: 600; }

.kw-score-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.score-bar-track {
  flex: 1;
  height: 4px;
  background: var(--bg2);
  border-radius: 2px;
  overflow: hidden;
}

.score-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.5s ease;
}

.score-bar-fill.ENTRAR { background: linear-gradient(90deg, var(--accent3), #34d399); }
.score-bar-fill.PROBAR { background: linear-gradient(90deg, var(--warn), #fcd34d); }
.score-bar-fill.DESCARTAR { background: linear-gradient(90deg, var(--danger), #f87171); }

.score-num {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text2);
  min-width: 28px;
  text-align: right;
}

.kw-actions {
  display: flex;
  gap: 6px;
  margin-top: 10px;
  opacity: 0;
  transition: opacity 0.2s;
}

.kw-card:hover .kw-actions { opacity: 1; }

/* ─── SERP RESULTS ─── */
.serp-summary {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 22px 24px;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 20px;
  align-items: center;
}

.serp-summary-stats {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.serp-stat {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: var(--text2);
}

.serp-stat strong { color: var(--text); }

.opportunity-badge {
  font-family: 'Syne', sans-serif;
  font-size: 0.85rem;
  font-weight: 800;
  padding: 8px 18px;
  border-radius: 10px;
  white-space: nowrap;
}

.opp-ALTA { background: rgba(16,185,129,0.15); color: var(--accent3); border: 1px solid rgba(16,185,129,0.3); }
.opp-MEDIA-ALTA { background: rgba(0,229,255,0.1); color: var(--accent); border: 1px solid rgba(0,229,255,0.2); }
.opp-MEDIA { background: rgba(245,158,11,0.1); color: var(--warn); border: 1px solid rgba(245,158,11,0.2); }
.opp-BAJA { background: rgba(239,68,68,0.1); color: var(--danger); border: 1px solid rgba(239,68,68,0.2); }
.opp-DESCONOCIDA { background: rgba(100,116,139,0.1); color: var(--text3); border: 1px solid var(--border); }

.serp-recommendation {
  grid-column: 1 / -1;
  padding: 12px 16px;
  background: var(--bg2);
  border-radius: 8px;
  font-size: 0.9rem;
  color: var(--text2);
  border: 1px solid var(--border);
}

.serp-list { display: flex; flex-direction: column; gap: 10px; }

.serp-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px 18px;
  transition: border-color 0.2s;
}

.serp-item:hover { border-color: var(--border2); }

.serp-item-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 6px;
}

.serp-position {
  font-family: 'Syne', sans-serif;
  font-size: 1.1rem;
  font-weight: 900;
  color: var(--accent);
  min-width: 28px;
  line-height: 1;
  margin-top: 2px;
}

.serp-item-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--accent);
  margin-bottom: 2px;
  cursor: pointer;
}

.serp-item-title:hover { text-decoration: underline; }

.serp-domain {
  font-size: 0.78rem;
  color: var(--accent3);
}

.serp-snippet {
  font-size: 0.83rem;
  color: var(--text3);
  line-height: 1.5;
  margin-bottom: 8px;
  padding-left: 40px;
}

.serp-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  padding-left: 40px;
}

.serp-tag {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 600;
}

.tag-ecommerce { background: rgba(245,158,11,0.15); color: var(--warn); }
.tag-forum { background: rgba(124,58,237,0.15); color: #a78bfa; }
.tag-niche { background: rgba(16,185,129,0.15); color: var(--accent3); }
.tag-da-high { background: rgba(239,68,68,0.12); color: var(--danger); }
.tag-da-med { background: rgba(0,229,255,0.1); color: var(--accent); }

/* ─── CONTENT RESULTS ─── */
.content-block {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  margin-bottom: 14px;
  overflow: hidden;
}

.content-block-header {
  padding: 14px 18px;
  background: var(--bg2);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.content-block-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text3);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.content-block-body {
  padding: 16px 18px;
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--text2);
}

.content-block-body strong { color: var(--text); }

.copy-btn {
  background: none;
  border: 1px solid var(--border);
  color: var(--text3);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-btn:hover { border-color: var(--accent); color: var(--accent); }

.h2-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.h2-list li {
  padding: 8px 12px;
  background: var(--bg2);
  border-radius: 6px;
  border-left: 3px solid var(--accent2);
  font-size: 0.88rem;
  color: var(--text2);
}

.schema-pre {
  background: var(--bg);
  border-radius: 8px;
  padding: 14px;
  font-family: 'Courier New', monospace;
  font-size: 0.78rem;
  color: var(--accent3);
  overflow-x: auto;
  line-height: 1.6;
}

.meta-preview {
  background: var(--bg);
  border-radius: 8px;
  padding: 16px;
  border: 1px solid var(--border);
}

.meta-preview .preview-title {
  color: #8ab4f8;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 2px;
}

.meta-preview .preview-url {
  color: var(--accent3);
  font-size: 0.8rem;
  margin-bottom: 4px;
}

.meta-preview .preview-desc {
  color: var(--text3);
  font-size: 0.85rem;
  line-height: 1.5;
}

/* ─── AFFILIATE RESULTS ─── */
.product-card-result {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  display: flex;
  gap: 24px;
  align-items: flex-start;
  margin-bottom: 20px;
}

.product-img {
  width: 140px;
  height: 140px;
  object-fit: contain;
  border-radius: 10px;
  background: var(--bg2);
  flex-shrink: 0;
  border: 1px solid var(--border);
}

.product-img-placeholder {
  width: 140px;
  height: 140px;
  background: var(--bg2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  flex-shrink: 0;
  border: 1px solid var(--border);
}

.product-details { flex: 1; }

.product-platform {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--warn);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 6px;
}

.product-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
  line-height: 1.4;
}

.product-desc {
  font-size: 0.85rem;
  color: var(--text3);
  margin-bottom: 14px;
  line-height: 1.5;
}

.product-price {
  font-family: 'Syne', sans-serif;
  font-size: 1.6rem;
  font-weight: 900;
  color: var(--accent3);
  margin-bottom: 14px;
}

.affiliate-url-box {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px 18px;
}

.affiliate-url-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.affiliate-url-text {
  font-size: 0.82rem;
  color: var(--accent);
  word-break: break-all;
  margin-bottom: 10px;
}

/* ─── GENERATOR RESULTS ─── */
.web-preview {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: 20px;
}

.web-preview-bar {
  background: var(--bg2);
  padding: 12px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
}

.web-preview-dots { display: flex; gap: 6px; }
.dot { width: 10px; height: 10px; border-radius: 50%; }
.dot.red { background: #ef4444; }
.dot.yellow { background: #f59e0b; }
.dot.green { background: var(--accent3); }

.web-preview-iframe {
  width: 100%;
  height: 480px;
  border: none;
  background: white;
}

.web-download-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* ─── LOADER ─── */
.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  gap: 16px;
}

.loader.hidden { display: none; }

.loader-spinner {
  width: 44px;
  height: 44px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.loader-text {
  font-size: 0.9rem;
  color: var(--text3);
}

/* ─── TOAST ─── */
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: var(--surface2);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 0.88rem;
  box-shadow: var(--shadow);
  z-index: 999;
  transform: translateY(80px);
  opacity: 0;
  transition: all 0.3s ease;
}

.toast.show {
  transform: translateY(0);
  opacity: 1;
}

/* ─── HELPERS ─── */
.hidden { display: none !important; }
.mt-16 { margin-top: 16px; }

.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: var(--text3);
}

.empty-state .empty-icon { font-size: 2.5rem; margin-bottom: 12px; }
.empty-state p { font-size: 0.9rem; }

/* ─── RESPONSIVE ─── */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  .sidebar.open {
    transform: translateX(0);
  }
  .main-content {
    margin-left: 0;
  }
  .menu-toggle {
    display: block;
  }
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
  .keywords-grid {
    grid-template-columns: 1fr;
  }
  .search-row {
    flex-direction: column;
    align-items: stretch;
  }
  .product-card-result {
    flex-direction: column;
  }
  .serp-summary {
    grid-template-columns: 1fr;
  }
  .tab-content {
    padding: 20px 16px;
  }
}

import React, { useState, useEffect, useCallback, useRef } from "react";

// ─── DEFAULT DATA ────────────────────────────────────────────────────────────
const DEFAULT_DATA = {
  meta: { companyName: "FinServe NBFC Ltd", reportDate: "Feb 2026" },
  portfolio: {
    totalAUM: 4820.5, totalAUMGrowth: 18.4,
    disbursed: 1240.2, disbursedGrowth: 22.1,
    outstanding: 3890.4, outstandingGrowth: 15.8,
    activeLoans: 24680, activeLoansGrowth: 12.3,
  },
  // Lender-specific breakdowns
  lenderData: {
    ALL: {
      creditQuality: { gnpa: 3.42, nnpa: 1.87, par30: 6.21, par60: 4.18, par90: 3.42, pcr: 68.4, writeOff: 0.92, creditCost: 2.1 },
      agingBucket: [
        { bucket: "Current", pct: 86.1 },
        { bucket: "1-30 DPD", pct: 6.2 },
        { bucket: "31-60 DPD", pct: 3.7 },
        { bucket: "61-90 DPD", pct: 2.1 },
        { bucket: "91-180 DPD", pct: 1.3 },
        { bucket: "180+ DPD", pct: 0.6 },
      ],
    },
    CS: {
      creditQuality: { gnpa: 2.85, nnpa: 1.52, par30: 5.42, par60: 3.65, par90: 2.85, pcr: 72.1, writeOff: 0.78, creditCost: 1.85 },
      agingBucket: [
        { bucket: "Current", pct: 88.3 },
        { bucket: "1-30 DPD", pct: 5.4 },
        { bucket: "31-60 DPD", pct: 3.2 },
        { bucket: "61-90 DPD", pct: 1.8 },
        { bucket: "91-180 DPD", pct: 0.9 },
        { bucket: "180+ DPD", pct: 0.4 },
      ],
    },
    IDFC: {
      creditQuality: { gnpa: 3.98, nnpa: 2.21, par30: 7.12, par60: 4.82, par90: 3.98, pcr: 64.5, writeOff: 1.08, creditCost: 2.42 },
      agingBucket: [
        { bucket: "Current", pct: 84.2 },
        { bucket: "1-30 DPD", pct: 7.1 },
        { bucket: "31-60 DPD", pct: 4.3 },
        { bucket: "61-90 DPD", pct: 2.5 },
        { bucket: "91-180 DPD", pct: 1.4 },
        { bucket: "180+ DPD", pct: 0.5 },
      ],
    },
    InCred: {
      creditQuality: { gnpa: 4.21, nnpa: 2.38, par30: 7.85, par60: 5.21, par90: 4.21, pcr: 61.8, writeOff: 1.15, creditCost: 2.68 },
      agingBucket: [
        { bucket: "Current", pct: 82.5 },
        { bucket: "1-30 DPD", pct: 7.8 },
        { bucket: "31-60 DPD", pct: 4.9 },
        { bucket: "61-90 DPD", pct: 2.8 },
        { bucket: "91-180 DPD", pct: 1.6 },
        { bucket: "180+ DPD", pct: 0.4 },
      ],
    },
  },
  creditQuality: {
    gnpa: 3.42, nnpa: 1.87, par30: 6.21,
    par60: 4.18, par90: 3.42, pcr: 68.4,
    writeOff: 0.92, creditCost: 2.1,
  },
  profitability: {
    nim: 8.4, roa: 2.8, roe: 18.2,
    costOfFunds: 9.2, yield: 17.6, spread: 8.4,
  },
  collections: {
    efficiency: 96.8, resolution: 72.4,
    rollback: 34.2, contactability: 88.6,
    firstBounce: 8.2, ptp: 64.3,
    ptpHonored: 71.8, fieldEff: 82.4,
  },
  collectionsMonthly: [
    { month: "Feb", disbursal: 320, femi: 7.8, currentPOS: 2850, bucketX: 185, bucket1: 98, bucket2: 54, bucket3: 42, contactability: 87.5 },
    { month: "Mar", disbursal: 420, femi: 8.2, currentPOS: 3120, bucketX: 205, bucket1: 112, bucket2: 62, bucket3: 48, contactability: 88.1 },
    { month: "Apr", disbursal: 380, femi: 7.5, currentPOS: 3340, bucketX: 198, bucket1: 105, bucket2: 58, bucket3: 45, contactability: 88.8 },
    { month: "May", disbursal: 510, femi: 8.5, currentPOS: 3680, bucketX: 242, bucket1: 128, bucket2: 71, bucket3: 52, contactability: 89.2 },
    { month: "Jun", disbursal: 480, femi: 8.1, currentPOS: 3920, bucketX: 235, bucket1: 121, bucket2: 68, bucket3: 49, contactability: 88.9 },
    { month: "Jul", disbursal: 560, femi: 8.7, currentPOS: 4180, bucketX: 268, bucket1: 142, bucket2: 78, bucket3: 58, contactability: 88.4 },
    { month: "Aug", disbursal: 620, femi: 9.1, currentPOS: 4520, bucketX: 295, bucket1: 158, bucket2: 87, bucket3: 64, contactability: 87.9 },
    { month: "Sep", disbursal: 580, femi: 8.4, currentPOS: 4680, bucketX: 278, bucket1: 148, bucket2: 82, bucket3: 61, contactability: 88.6 },
    { month: "Oct", disbursal: 640, femi: 8.9, currentPOS: 4850, bucketX: 305, bucket1: 162, bucket2: 89, bucket3: 66, contactability: 88.2 },
    { month: "Nov", disbursal: 710, femi: 9.3, currentPOS: 5120, bucketX: 332, bucket1: 176, bucket2: 97, bucket3: 72, contactability: 87.8 },
    { month: "Dec", disbursal: 680, femi: 8.6, currentPOS: 5280, bucketX: 318, bucket1: 169, bucket2: 93, bucket3: 69, contactability: 88.5 },
    { month: "Jan", disbursal: 750, femi: 9.0, currentPOS: 5480, bucketX: 348, bucket1: 184, bucket2: 102, bucket3: 76, contactability: 88.3 },
  ],
  productMix: [
    { product: "Home Loans",      aum: 1420, pct: 29.5, npa: 2.1 },
    { product: "Business Loans",  aum: 980,  pct: 20.3, npa: 4.2 },
    { product: "Personal Loans",  aum: 760,  pct: 15.8, npa: 5.8 },
    { product: "Two-Wheeler",     aum: 640,  pct: 13.3, npa: 3.9 },
    { product: "Gold Loans",      aum: 520,  pct: 10.8, npa: 1.4 },
    { product: "Microfinance",    aum: 500,  pct: 10.3, npa: 7.2 },
  ],
  agingBucket: [
    { bucket: "Current",     pct: 86.1 },
    { bucket: "1-30 DPD",   pct: 6.2  },
    { bucket: "31-60 DPD",  pct: 3.7  },
    { bucket: "61-90 DPD",  pct: 2.1  },
    { bucket: "91-180 DPD", pct: 1.3  },
    { bucket: "180+ DPD",   pct: 0.6  },
  ],
  monthly: [320, 420, 380, 510, 480, 560, 620, 580, 640, 710, 680, 750],
  months:  ["Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan"],
  monthlyAUM: [3200, 3420, 3680, 3890, 4120, 4280, 4350, 4480, 4620, 4720, 4780, 4820],
  monthlyROI: [16.8, 17.0, 17.2, 17.3, 17.5, 17.6, 17.6, 17.7, 17.6, 17.6, 17.5, 17.6],
  lenderMix: [
    { lender: "CS (CreditSaison)", share: 45.2 },
    { lender: "IDFC", share: 32.8 },
    { lender: "InCred", share: 15.4 },
    { lender: "Others", share: 6.6 },
  ],
  newVsRepeat: [
    { month: "Feb", new: 180, repeat: 140 },
    { month: "Mar", new: 240, repeat: 180 },
    { month: "Apr", new: 210, repeat: 170 },
    { month: "May", new: 290, repeat: 220 },
    { month: "Jun", new: 270, repeat: 210 },
    { month: "Jul", new: 310, repeat: 250 },
    { month: "Aug", new: 350, repeat: 270 },
    { month: "Sep", new: 320, repeat: 260 },
    { month: "Oct", new: 360, repeat: 280 },
    { month: "Nov", new: 400, repeat: 310 },
    { month: "Dec", new: 380, repeat: 300 },
    { month: "Jan", new: 420, repeat: 330 },
  ],
  liquidity: {
    car: 19.4, tier1: 16.2, lcr: 142,
    debtEquity: 4.8, borrowingCost: 9.2,
    bankLines: 42.6, ncd: 38.2, ecb: 10.8, cp: 8.4,
  },
  panelVisibility: {
    kpiCards: true, disbursementChart: true, productMix: true,
    agingBucket: true, profitability: true, creditQuality: true,
    collections: true, liquidity: true,
  },
  selectedLender: "ALL", // ALL / CS / IDFC / InCred
};

// ─── localStorage HELPERS ────────────────────────────────────────────────────
const LS_DATA_KEY  = "nbfc_dashboard_data_v2";
const LS_THEME_KEY = "nbfc_dashboard_theme_v2";

function lsGet(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; }
  catch { return null; }
}
function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ─── THEMES ──────────────────────────────────────────────────────────────────
const THEMES = {
  dark:     { bg:"#080E18", card:"#0C1624", border:"#1A2535", text:"#E5E9F0", subtext:"#6B7280", accent:"#00D4AA", accent2:"#3B82F6", name:"Dark Ocean"       },
  midnight: { bg:"#0A0A14", card:"#12121E", border:"#1E1E32", text:"#E0E0F0", subtext:"#5A5A7A", accent:"#A78BFA", accent2:"#60A5FA", name:"Midnight Purple"   },
  slate:    { bg:"#0F1117", card:"#161B22", border:"#21262D", text:"#E6EDF3", subtext:"#7D8590", accent:"#58A6FF", accent2:"#3FB950", name:"GitHub Slate"       },
  ember:    { bg:"#0D0905", card:"#150F08", border:"#2A1F12", text:"#F5E6D0", subtext:"#8B7355", accent:"#F97316", accent2:"#EAB308", name:"Ember Gold"         },
  forest:   { bg:"#050D0A", card:"#0A1610", border:"#14261E", text:"#D4EDDA", subtext:"#4A7C59", accent:"#22C55E", accent2:"#06B6D4", name:"Forest Green"       },
};

// ─── INLINE EDITABLE NUMBER ───────────────────────────────────────────────────
function EditableValue({ value, onChange, prefix="", suffix="", fontSize=26, color="#fff" }) {
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState(String(value));
  const ref = useRef(null);

  useEffect(() => { if (editing && ref.current) ref.current.focus(); }, [editing]);

  const commit = () => {
    const n = parseFloat(draft);
    if (!isNaN(n)) onChange(n);
    setEditing(false);
  };

  if (editing) return (
    <input
      ref={ref}
      value={draft}
      onChange={e => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
      style={{
        fontSize, fontWeight: 800, color,
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.3)",
        borderRadius: 6, padding: "2px 6px",
        width: Math.max(60, String(draft).length * (fontSize * 0.62)),
        outline: "none",
      }}
    />
  );

  return (
    <span
      onClick={() => { setDraft(String(value)); setEditing(true); }}
      title="Click to edit"
      style={{ cursor: "text", borderBottom: "1px dashed rgba(255,255,255,0.25)", paddingBottom: 1 }}
    >
      {prefix}{typeof value === "number" ? (Number.isInteger(value) ? value.toLocaleString() : value.toFixed(1)) : value}{suffix}
    </span>
  );
}

// ─── INLINE EDITABLE TEXT ────────────────────────────────────────────────────
function EditableText({ value, onChange, style = {} }) {
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState(value);
  const ref = useRef(null);

  useEffect(() => { if (editing && ref.current) ref.current.focus(); }, [editing]);

  const commit = () => { if (draft.trim()) onChange(draft.trim()); setEditing(false); };

  if (editing) return (
    <input
      ref={ref} value={draft}
      onChange={e => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
      style={{ background:"transparent", border:"none", borderBottom:"1px solid rgba(255,255,255,0.4)", color:"inherit", fontSize:"inherit", fontWeight:"inherit", outline:"none", width:"100%", ...style }}
    />
  );

  return (
    <span
      onClick={() => { setDraft(value); setEditing(true); }}
      style={{ cursor:"text", borderBottom:"1px dashed rgba(255,255,255,0.15)", ...style }}
    >
      {value}
    </span>
  );
}

// ─── DONUT CHART ─────────────────────────────────────────────────────────────
function Donut({ segments, size = 110, accent, accent2 }) {
  const clrs = [accent, accent2, "#F59E0B", "#EF4444", "#A855F7", "#EC4899"];
  const total = segments.reduce((a, b) => a + (b.value || 0), 0) || 1;
  const cx = size / 2, cy = size / 2, r = size / 2 - 10;
  let angle = -90;
  return (
    <svg width={size} height={size}>
      {segments.map((seg, i) => {
        const sweep = (seg.value / total) * 359.99;
        const x1 = cx + r * Math.cos((angle * Math.PI) / 180);
        const y1 = cy + r * Math.sin((angle * Math.PI) / 180);
        angle += sweep;
        const x2 = cx + r * Math.cos((angle * Math.PI) / 180);
        const y2 = cy + r * Math.sin((angle * Math.PI) / 180);
        return (
          <path
            key={i}
            d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${sweep > 180 ? 1 : 0} 1 ${x2},${y2}Z`}
            fill={clrs[i % clrs.length]}
            opacity={0.85}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r * 0.55} fill="#0F1923" />
    </svg>
  );
}

// ─── PANEL WRAPPER ────────────────────────────────────────────────────────────
function Panel({ title, subtitle, children, theme, onHide, style = {} }) {
  return (
    <div style={{ background: theme.card, borderRadius: 14, padding: 18, border: `1px solid ${theme.border}`, position: "relative", ...style }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>{title}</div>
          {subtitle && <div style={{ fontSize: 10, color: theme.subtext, marginTop: 2 }}>{subtitle}</div>}
        </div>
        {onHide && (
          <button onClick={onHide} title="Hide panel" style={{ background:"none", border:"none", cursor:"pointer", color: theme.subtext, fontSize: 14, padding:"0 2px" }}>✕</button>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [data,        setData]        = useState(null);
  const [themeName,   setThemeName]   = useState("dark");
  const [activeTab,   setActiveTab]   = useState(0);
  const [editMode,    setEditMode]    = useState(false);
  const [showSettings,setShowSettings]= useState(false);
  const [saved,       setSaved]       = useState(false);

  const theme = THEMES[themeName];

  // ── Load from localStorage on mount ──
  useEffect(() => {
    const saved = lsGet(LS_DATA_KEY);
    setData(saved || DEFAULT_DATA);
    const savedTheme = lsGet(LS_THEME_KEY);
    if (savedTheme && THEMES[savedTheme]) setThemeName(savedTheme);
  }, []);

  // ── Save helper ──
  const save = useCallback((d) => {
    lsSet(LS_DATA_KEY, d);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }, []);

  // ── Deep update by dot-path ──
  const update = useCallback((path, value) => {
    setData(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        const arrayMatch = keys[i].match(/^(\w+)\[(\d+)\]$/);
        if (arrayMatch) obj = obj[arrayMatch[1]][parseInt(arrayMatch[2])];
        else obj = obj[keys[i]];
      }
      const lastKey = keys[keys.length - 1];
      const lastMatch = lastKey.match(/^(\w+)\[(\d+)\]$/);
      if (lastMatch) obj[lastMatch[1]][parseInt(lastMatch[2])] = value;
      else obj[lastKey] = value;
      save(next);
      return next;
    });
  }, [save]);

  const updateTheme = (t) => { setThemeName(t); lsSet(LS_THEME_KEY, t); };
  const togglePanel = (key) => update(`panelVisibility.${key}`, !data.panelVisibility[key]);
  const resetAll    = () => { setData(DEFAULT_DATA); lsSet(LS_DATA_KEY, DEFAULT_DATA); };
  const npaColor    = (v) => v < 3 ? theme.accent : v < 5 ? "#F59E0B" : "#EF4444";
  const growthColor = (v) => v >= 0 ? theme.accent : "#EF4444";

  if (!data) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#080E18", color:"#6B7280", fontFamily:"system-ui" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
        <div>Loading dashboard…</div>
      </div>
    </div>
  );

  const pv   = data.panelVisibility;
  const TABS = ["Overview","Credit Quality","Collections","Product Mix","Liquidity"];

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily:"'DM Sans','Segoe UI',sans-serif", background: theme.bg, minHeight:"100vh", color: theme.text }}>

      {/* ── HEADER ── */}
      <div style={{
        padding:"14px 20px", borderBottom:`1px solid ${theme.border}`,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        flexWrap:"wrap", gap:10, position:"sticky", top:0, background: theme.bg, zIndex:100,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:38, height:38, borderRadius:10, background:`linear-gradient(135deg,${theme.accent},${theme.accent2})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:900, color:"#fff" }}>N</div>
          <div>
            <div style={{ fontSize:16, fontWeight:800, letterSpacing:"-0.3px" }}>
              <EditableText value={data.meta.companyName} onChange={v => update("meta.companyName", v)} />
            </div>
            <div style={{ fontSize:10, color: theme.subtext, letterSpacing:"0.08em", textTransform:"uppercase" }}>
              Lending Intelligence •{" "}
              <EditableText value={data.meta.reportDate} onChange={v => update("meta.reportDate", v)} style={{ fontSize:10 }} />
            </div>
          </div>
        </div>

        <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
          {saved && <span style={{ fontSize:11, color: theme.accent, background: theme.accent+"22", padding:"4px 10px", borderRadius:6 }}>✓ Saved</span>}
          <button onClick={() => setEditMode(e => !e)} style={{ padding:"7px 14px", borderRadius:8, fontSize:12, fontWeight:700, border:"none", cursor:"pointer", background: editMode ? theme.accent : theme.card, color: editMode ? "#fff" : theme.subtext, transition:"all .2s" }}>
            ✏️ {editMode ? "Editing ON" : "Edit Mode"}
          </button>
          <button onClick={() => setShowSettings(s => !s)} style={{ padding:"7px 14px", borderRadius:8, fontSize:12, fontWeight:700, border:`1px solid ${theme.border}`, cursor:"pointer", background: showSettings ? theme.card : "transparent", color: theme.subtext }}>
            ⚙️ Settings
          </button>
          <button onClick={resetAll} style={{ padding:"7px 14px", borderRadius:8, fontSize:12, fontWeight:700, border:`1px solid ${theme.border}`, cursor:"pointer", background:"transparent", color: theme.subtext }}>
            ↺ Reset
          </button>
        </div>
      </div>

      {/* ── EDIT MODE BANNER ── */}
      {editMode && (
        <div style={{ background: theme.accent+"18", borderBottom:`1px solid ${theme.accent}44`, padding:"8px 20px", fontSize:11, color: theme.accent }}>
          ✏️ <strong>Edit Mode Active</strong> — Click any number or label to edit it. All changes auto-save to localStorage.
        </div>
      )}

      {/* ── SETTINGS DRAWER ── */}
      {showSettings && (
        <div style={{ background: theme.card, borderBottom:`1px solid ${theme.border}`, padding:"16px 20px" }}>
          <div style={{ display:"flex", gap:32, flexWrap:"wrap" }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color: theme.subtext, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Color Theme</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {Object.entries(THEMES).map(([key, t]) => (
                  <button key={key} onClick={() => updateTheme(key)} style={{ padding:"6px 12px", borderRadius:8, fontSize:11, fontWeight:600, cursor:"pointer", border: themeName === key ? `2px solid ${t.accent}` : `1px solid ${theme.border}`, background: t.bg, color: t.text }}>
                    <span style={{ color: t.accent }}>●</span> {t.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color: theme.subtext, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Panel Visibility</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {Object.entries(pv).map(([key, vis]) => (
                  <button key={key} onClick={() => togglePanel(key)} style={{ padding:"5px 12px", borderRadius:6, fontSize:11, fontWeight:600, cursor:"pointer", border:`1px solid ${theme.border}`, background: vis ? theme.accent+"22" : "transparent", color: vis ? theme.accent : theme.subtext }}>
                    {vis ? "✓" : "○"} {key.replace(/([A-Z])/g, " $1").trim()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth:1400, margin:"0 auto", padding:"16px 16px 32px" }}>

        {/* ── TAB BAR ── */}
        <div style={{ display:"flex", gap:0, borderBottom:`1px solid ${theme.border}`, marginBottom:18, overflowX:"auto" }}>
          {TABS.map((tab, i) => (
            <button key={i} onClick={() => setActiveTab(i)} style={{ padding:"10px 18px", fontSize:12, fontWeight:600, border:"none", cursor:"pointer", background:"transparent", whiteSpace:"nowrap", color: activeTab===i ? theme.accent : theme.subtext, borderBottom: activeTab===i ? `2px solid ${theme.accent}` : "2px solid transparent" }}>
              {tab}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════
            TAB 0 — OVERVIEW (UPDATED)
        ══════════════════════════════════════════════ */}
        {activeTab === 0 && (
          <div>
            {/* KPI Cards */}
            {pv.kpiCards && (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))", gap:12, marginBottom:16 }}>
                {[
                  { label:"Total AUM",         field:"portfolio.totalAUM",       gField:"portfolio.totalAUMGrowth",     icon:"🏦", color: theme.accent,  pfx:"₹", sfx:"Cr" },
                  { label:"Monthly Disburse",  field:"portfolio.disbursed",      gField:"portfolio.disbursedGrowth",    icon:"💸", color: theme.accent2, pfx:"₹", sfx:"Cr" },
                  { label:"Outstanding",       field:"portfolio.outstanding",    gField:"portfolio.outstandingGrowth",  icon:"📊", color:"#A855F7",       pfx:"₹", sfx:"Cr" },
                  { label:"Active Accounts",   field:"portfolio.activeLoans",    gField:"portfolio.activeLoansGrowth",  icon:"👥", color:"#F59E0B",       pfx:"",  sfx:"",  noDecimal:true },
                ].map((k, i) => {
                  const val    = k.field.split(".").reduce((o,p)=>o[p], data);
                  const growth = k.gField.split(".").reduce((o,p)=>o[p], data);
                  return (
                    <div key={i} style={{ background: theme.card, borderRadius:14, padding:"18px 20px", border:`1px solid ${k.color}22`, borderTop:`3px solid ${k.color}` }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                        <div style={{ fontSize:10, color: theme.subtext, textTransform:"uppercase", letterSpacing:"0.06em", fontWeight:600 }}>{k.label}</div>
                        <span style={{ fontSize:18 }}>{k.icon}</span>
                      </div>
                      <div style={{ fontSize:26, fontWeight:800, color: k.color, marginBottom:4 }}>
                        {k.pfx}
                        <EditableValue value={k.noDecimal ? Math.round(val) : val} onChange={v=>update(k.field,v)} fontSize={22} color={k.color} />
                        {k.sfx}
                      </div>
                      <div style={{ fontSize:12, color: growthColor(growth), display:"flex", alignItems:"center", gap:4 }}>
                        {growth>=0?"▲":"▼"}
                        <EditableValue value={Math.abs(growth)} onChange={v=>update(k.gField,v)} fontSize={12} color={growthColor(growth)} suffix="% YoY" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Row: Monthly AUM + Monthly Disbursement */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
              <Panel title="Monthly AUM Trend (₹ Cr)" subtitle="Last 12 months AUM progression" theme={theme}>
                <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:130 }}>
                  {data.monthlyAUM.map((v, i) => {
                    const max  = Math.max(...data.monthlyAUM);
                    const h    = (v / max) * 110;
                    const last = i === data.monthlyAUM.length - 1;
                    return (
                      <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
                        <div style={{ fontSize:7, color: theme.subtext, marginBottom:2 }}>
                          <EditableValue value={v} onChange={val=>update(`monthlyAUM[${i}]`,val)} fontSize={7} color={theme.subtext} />
                        </div>
                        <div style={{ width:"90%", height: h, background: last ? `linear-gradient(0deg,${theme.accent},${theme.accent}88)` : `${theme.accent2}44`, borderRadius:"3px 3px 0 0", minHeight:4 }} />
                        <div style={{ fontSize:7, color: theme.subtext, marginTop:3 }}>{data.months[i]}</div>
                      </div>
                    );
                  })}
                </div>
              </Panel>

              <Panel title="Monthly Disbursement (₹ Cr)" subtitle="Last 12 months disbursement run-rate" theme={theme}>
                <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:130 }}>
                  {data.monthly.map((v, i) => {
                    const max  = Math.max(...data.monthly);
                    const h    = (v / max) * 110;
                    const last = i === data.monthly.length - 1;
                    return (
                      <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
                        <div style={{ fontSize:7, color: theme.subtext, marginBottom:2 }}>
                          <EditableValue value={v} onChange={val=>update(`monthly[${i}]`,val)} fontSize={7} color={theme.subtext} />
                        </div>
                        <div style={{ width:"90%", height: h, background: last ? `linear-gradient(0deg,${theme.accent},${theme.accent}88)` : `${theme.accent2}44`, borderRadius:"3px 3px 0 0", minHeight:4 }} />
                        <div style={{ fontSize:7, color: theme.subtext, marginTop:3 }}>{data.months[i]}</div>
                      </div>
                    );
                  })}
                </div>
              </Panel>
            </div>

            {/* Row: Lender Mix + New vs Repeat */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
              <Panel title="Lender-wise Portfolio Mix" subtitle="Click labels & % to edit" theme={theme}>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <Donut segments={data.lenderMix.map(p=>({value:p.share}))} size={100} accent={theme.accent} accent2={theme.accent2} />
                  <div style={{ flex:1 }}>
                    {data.lenderMix.map((p, i) => {
                      const clrs = [theme.accent, theme.accent2,"#F59E0B","#EF4444"];
                      return (
                        <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                            <div style={{ width:7, height:7, borderRadius:"50%", background: clrs[i] }} />
                            <span style={{ fontSize:10, color: theme.subtext }}>
                              <EditableText value={p.lender} onChange={v=>update(`lenderMix[${i}].lender`,v)} style={{ fontSize:10, color: theme.subtext }} />
                            </span>
                          </div>
                          <span style={{ fontSize:10, fontWeight:700, color: theme.text }}>
                            <EditableValue value={p.share} onChange={v=>update(`lenderMix[${i}].share`,v)} fontSize={10} color={theme.text} suffix="%" />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Panel>

              <Panel title="New vs Repeat Disbursals" subtitle="Monthly customer acquisition breakdown" theme={theme}>
                <div style={{ display:"flex", alignItems:"flex-end", gap:3, height:130 }}>
                  {data.newVsRepeat.map((d, i) => {
                    const total = d.new + d.repeat;
                    const maxTotal = Math.max(...data.newVsRepeat.map(x => x.new + x.repeat));
                    const h = (total / maxTotal) * 110;
                    return (
                      <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
                        <div style={{ fontSize:7, color: theme.subtext, marginBottom:2 }}>{total}</div>
                        <div style={{ width:"90%", height: h, display:"flex", flexDirection:"column-reverse", borderRadius:"3px 3px 0 0", overflow:"hidden" }}>
                          <div style={{ height: `${(d.repeat/total)*100}%`, background: theme.accent2 }} />
                          <div style={{ height: `${(d.new/total)*100}%`, background: theme.accent }} />
                        </div>
                        <div style={{ fontSize:7, color: theme.subtext, marginTop:3 }}>{d.month}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display:"flex", gap:12, marginTop:12, justifyContent:"center", fontSize:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <div style={{ width:10, height:10, background: theme.accent, borderRadius:2 }} />
                    <span style={{ color: theme.subtext }}>New Customers</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <div style={{ width:10, height:10, background: theme.accent2, borderRadius:2 }} />
                    <span style={{ color: theme.subtext }}>Repeat Customers</span>
                  </div>
                </div>
              </Panel>
            </div>

            {/* Row: ROI Trend + Profitability */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <Panel title="Average ROI Trend (%)" subtitle="Monthly ROI progression" theme={theme}>
                <div style={{ height:100, position:"relative", display:"flex", alignItems:"flex-end", paddingBottom:20 }}>
                  <svg width="100%" height="100" viewBox="0 0 360 100" style={{ overflow:"visible" }}>
                    <defs>
                      <linearGradient id="roiGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={theme.accent} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={theme.accent} stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {(() => {
                      const min = Math.min(...data.monthlyROI);
                      const max = Math.max(...data.monthlyROI);
                      const range = max - min || 1;
                      const pts = data.monthlyROI.map((v, i) => 
                        `${(i / (data.monthlyROI.length - 1)) * 340 + 10},${90 - ((v - min) / range) * 70}`
                      ).join(" ");
                      const area = `${pts} 350,90 10,90`;
                      return (
                        <>
                          <polygon points={area} fill="url(#roiGrad)" />
                          <polyline points={pts} fill="none" stroke={theme.accent} strokeWidth="2.5" strokeLinejoin="round" />
                          {data.monthlyROI.map((v, i) => {
                            const x = (i / (data.monthlyROI.length - 1)) * 340 + 10;
                            const y = 90 - ((v - min) / range) * 70;
                            return <circle key={i} cx={x} cy={y} r="3" fill={theme.accent} />;
                          })}
                        </>
                      );
                    })()}
                  </svg>
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, display:"flex", justifyContent:"space-between", paddingTop:8 }}>
                    {data.months.map((m, i) => (
                      <span key={i} style={{ fontSize:7, color: theme.subtext }}>{m}</span>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop:8, padding:"8px 12px", background:`${theme.accent}11`, borderRadius:8, fontSize:11, color: theme.text, textAlign:"center" }}>
                  Current ROI: <strong style={{ color: theme.accent }}>{data.monthlyROI[data.monthlyROI.length-1]}%</strong>
                </div>
              </Panel>

              {pv.profitability && (
                <Panel title="Profitability KPIs" subtitle="Click any value to edit" theme={theme} onHide={()=>togglePanel("profitability")}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                    {[
                      { label:"NIM",    field:"profitability.nim",         desc:"Net Interest Margin",  color: theme.accent  },
                      { label:"ROA",    field:"profitability.roa",         desc:"Return on Assets",     color: theme.accent2 },
                      { label:"ROE",    field:"profitability.roe",         desc:"Return on Equity",     color:"#A855F7"       },
                      { label:"Spread", field:"profitability.spread",      desc:"Yield − Cost of Funds",color:"#F59E0B"       },
                      { label:"Yield",  field:"profitability.yield",       desc:"Portfolio Yield",      color: theme.accent  },
                      { label:"CoF",    field:"profitability.costOfFunds", desc:"Cost of Funds",        color:"#EF4444"       },
                    ].map((k, i) => {
                      const val = k.field.split(".").reduce((o,p)=>o[p], data);
                      return (
                        <div key={i} style={{ background:`${k.color}11`, borderRadius:10, padding:"10px 12px", borderLeft:`3px solid ${k.color}` }}>
                          <div style={{ fontSize:10, color: theme.subtext, marginBottom:2 }}>{k.desc}</div>
                          <div style={{ fontSize:20, fontWeight:800, color: k.color }}>
                            <EditableValue value={val} onChange={v=>update(k.field,v)} fontSize={20} color={k.color} suffix="%" />
                          </div>
                          <div style={{ fontSize:10, fontWeight:700, color: theme.subtext }}>{k.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </Panel>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            TAB 1 — CREDIT QUALITY (UPDATED with DPD aging + lender filter)
        ══════════════════════════════════════════════ */}
        {activeTab === 1 && pv.creditQuality && (
          <div>
            {/* Lender Dropdown Filter */}
            <div style={{ marginBottom:16, display:"flex", gap:12, alignItems:"center" }}>
              <span style={{ fontSize:11, color: theme.subtext, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>Filter by Lender:</span>
              <div style={{ position:"relative" }}>
                <select
                  value={data.selectedLender}
                  onChange={(e) => update("selectedLender", e.target.value)}
                  style={{
                    padding:"8px 36px 8px 14px",
                    borderRadius:8,
                    fontSize:12,
                    fontWeight:600,
                    border:`1px solid ${theme.border}`,
                    background: theme.card,
                    color: theme.text,
                    cursor:"pointer",
                    outline:"none",
                    appearance:"none",
                  }}
                >
                  <option value="ALL">All Lenders</option>
                  <option value="CS">CS (CreditSaison)</option>
                  <option value="IDFC">IDFC</option>
                  <option value="InCred">InCred</option>
                </select>
                <div style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color: theme.subtext }}>▼</div>
              </div>
              <div style={{ fontSize:11, color: theme.accent, background: theme.accent+"22", padding:"6px 12px", borderRadius:6 }}>
                Showing: <strong>{data.selectedLender === "ALL" ? "All Lenders" : data.selectedLender}</strong>
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12, marginBottom:16 }}>
              {[
                { label:"GNPA",        field:"gnpa",       desc:"Gross NPA %",           color:"#EF4444", icon:"⚠️" },
                { label:"NNPA",        field:"nnpa",       desc:"Net NPA %",             color:"#F97316", icon:"🔴" },
                { label:"PAR 30+",     field:"par30",      desc:"Portfolio at Risk 30+", color:"#F59E0B", icon:"📉" },
                { label:"PAR 60+",     field:"par60",      desc:"Portfolio at Risk 60+", color:"#F59E0B", icon:"📉" },
                { label:"PAR 90+",     field:"par90",      desc:"Portfolio at Risk 90+", color:"#EF4444", icon:"🚨" },
                { label:"PCR",         field:"pcr",        desc:"Provision Coverage",    color: theme.accent, icon:"🛡️" },
                { label:"Write-off",   field:"writeOff",   desc:"Write-off Rate %",      color:"#A855F7", icon:"✏️" },
                { label:"Credit Cost", field:"creditCost", desc:"Annualised Credit Cost",color: theme.accent2, icon:"💰" },
              ].map((k, i) => {
                const lenderKey = data.selectedLender;
                const val = data.lenderData[lenderKey].creditQuality[k.field];
                return (
                  <div key={i} style={{ background: theme.card, borderRadius:14, padding:"16px 18px", border:`1px solid ${k.color}33` }}>
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <div style={{ fontSize:10, color: theme.subtext, textTransform:"uppercase", letterSpacing:"0.06em", fontWeight:600 }}>{k.label}</div>
                      <span style={{ fontSize:14 }}>{k.icon}</span>
                    </div>
                    <div style={{ fontSize:24, fontWeight:800, color: k.color, margin:"8px 0 2px" }}>
                      {val.toFixed(2)}%
                    </div>
                    <div style={{ fontSize:10, color: theme.subtext }}>{k.desc}</div>
                  </div>
                );
              })}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
              {/* DPD Aging Bucket (moved from Overview) - now reactive to lender */}
              {pv.agingBucket && (
                <Panel title="DPD Aging Bucket" subtitle={`Overdue distribution for ${data.selectedLender === "ALL" ? "all lenders" : data.selectedLender}`} theme={theme} onHide={()=>togglePanel("agingBucket")}>
                  {data.lenderData[data.selectedLender].agingBucket.map((b, i) => {
                    const clrs=["#00D4AA","#3B82F6","#F59E0B","#F97316","#EF4444","#7F1D1D"];
                    return (
                      <div key={i} style={{ marginBottom:10 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                          <span style={{ fontSize:11, color: theme.subtext }}>{b.bucket}</span>
                          <span style={{ fontSize:11, fontWeight:700, color: clrs[i] }}>{b.pct.toFixed(1)}%</span>
                        </div>
                        <div style={{ background: theme.border, borderRadius:4, height:6, overflow:"hidden" }}>
                          <div style={{ width:`${b.pct}%`, background: clrs[i], height:"100%", borderRadius:4 }} />
                        </div>
                      </div>
                    );
                  })}
                </Panel>
              )}

              <Panel title="NPA by Product" subtitle="Click values to edit" theme={theme}>
                {data.productMix.map((p, i) => {
                  const c = npaColor(p.npa);
                  return (
                    <div key={i} style={{ marginBottom:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                        <span style={{ fontSize:12, color: theme.subtext }}>
                          <EditableText value={p.product} onChange={v=>update(`productMix[${i}].product`,v)} style={{ fontSize:12, color: theme.subtext }} />
                        </span>
                        <span style={{ fontSize:12, fontWeight:700, color: c }}>
                          <EditableValue value={p.npa} onChange={v=>update(`productMix[${i}].npa`,v)} fontSize={12} color={c} suffix="%" />
                        </span>
                      </div>
                      <div style={{ background: theme.border, borderRadius:4, height:8, overflow:"hidden" }}>
                        <div style={{ width:`${(p.npa/10)*100}%`, background: c, height:"100%", borderRadius:4 }} />
                      </div>
                    </div>
                  );
                })}
              </Panel>
            </div>

            {/* Placeholder for Redshift query view */}
            <Panel title="Custom Query View" subtitle="Bring your Redshift query results here" theme={theme}>
              <div style={{ padding:"40px 20px", textAlign:"center", background: theme.bg, borderRadius:10 }}>
                <div style={{ fontSize:32, marginBottom:12 }}>📊</div>
                <div style={{ color: theme.subtext, fontSize:13 }}>
                  Connect your Redshift query output here.<br/>
                  This panel will display the results from your custom lending analytics query.
                </div>
                <div style={{ marginTop:16, padding:"8px 16px", background: theme.accent+"22", borderRadius:8, fontSize:11, color: theme.accent, display:"inline-block" }}>
                  Query placeholder - add your data connection
                </div>
              </div>
            </Panel>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            TAB 2 — COLLECTIONS (unchanged)
        ══════════════════════════════════════════════ */}
        {activeTab === 2 && pv.collections && (
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12, marginBottom:16 }}>
              {[
                { label:"Collection Efficiency", field:"collections.efficiency",   target:97, lowerBad:true,  icon:"✅", color: theme.accent,  desc:"Actual vs demand"  },
                { label:"Resolution Rate",        field:"collections.resolution",   target:75, lowerBad:true,  icon:"🔄", color: theme.accent2, desc:"NPA resolved"      },
                { label:"Rollback Rate",          field:"collections.rollback",     target:40, lowerBad:true,  icon:"↩️", color:"#A855F7",       desc:"NPA cured"         },
                { label:"Contactability",         field:"collections.contactability",target:90,lowerBad:true,  icon:"📞", color:"#F59E0B",       desc:"Customers reached" },
                { label:"First Bounce",           field:"collections.firstBounce",  target:8,  lowerBad:false, icon:"🏓", color:"#EF4444",       desc:"EMI bounce rate"   },
                { label:"PTP Rate",               field:"collections.ptp",          target:70, lowerBad:true,  icon:"🤝", color: theme.accent2, desc:"Promise to pay"    },
                { label:"PTP Honored",            field:"collections.ptpHonored",   target:75, lowerBad:true,  icon:"💯", color: theme.accent,  desc:"Promises kept"     },
                { label:"Field Efficiency",       field:"collections.fieldEff",     target:85, lowerBad:true,  icon:"🚗", color:"#F97316",       desc:"Field conversion"  },
              ].map((k, i) => {
                const val     = k.field.split(".").reduce((o,p)=>o[p], data);
                const onTrack = k.lowerBad ? val >= k.target : val <= k.target;
                return (
                  <div key={i} style={{ background: theme.card, borderRadius:14, padding:"16px 18px", border:`1px solid ${onTrack?k.color+"33":"#EF444433"}` }}>
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <div style={{ fontSize:9, color: theme.subtext, textTransform:"uppercase", letterSpacing:"0.06em", fontWeight:600, lineHeight:1.4 }}>{k.label}</div>
                      <span style={{ fontSize:14 }}>{k.icon}</span>
                    </div>
                    <div style={{ fontSize:22, fontWeight:800, color: onTrack?k.color:"#EF4444", margin:"8px 0 2px" }}>
                      <EditableValue value={val} onChange={v=>update(k.field,v)} fontSize={20} color={onTrack?k.color:"#EF4444"} suffix="%" />
                    </div>
                    <div style={{ fontSize:10, color: theme.subtext, marginBottom:6 }}>{k.desc}</div>
                    <div style={{ background: theme.border, borderRadius:4, height:4, overflow:"hidden" }}>
                      <div style={{ width:`${val}%`, background: onTrack?k.color:"#EF4444", height:"100%", borderRadius:4 }} />
                    </div>
                    <div style={{ fontSize:9, color: theme.subtext, marginTop:3 }}>Target: {k.target}% • {onTrack?"✅":"❌"}</div>
                  </div>
                );
              })}
            </div>

            <Panel title="Collection Funnel" subtitle="End-to-end demand → collected pipeline" theme={theme}>
              {[
                { stage:"Total Demand",     val:100 },
                { stage:"Contactable",      val: data.collections.contactability },
                { stage:"PTP Received",     val: data.collections.ptp },
                { stage:"PTP Honored",      val: data.collections.ptp * data.collections.ptpHonored / 100 },
                { stage:"Finally Collected",val: data.collections.efficiency },
              ].map((s, i) => {
                const clrs=[theme.accent2,"#F59E0B","#A855F7","#F97316",theme.accent];
                return (
                  <div key={i} style={{ marginBottom:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                      <span style={{ fontSize:12, color: theme.subtext }}>{s.stage}</span>
                      <span style={{ fontSize:12, fontWeight:700, color: clrs[i] }}>{s.val.toFixed(1)}%</span>
                    </div>
                    <div style={{ background: theme.border, borderRadius:6, height:12, overflow:"hidden" }}>
                      <div style={{ width:`${s.val}%`, background: clrs[i], height:"100%", borderRadius:6, opacity:0.85 }} />
                    </div>
                  </div>
                );
              })}
            </Panel>

            <Panel title="Collections Efficiency — Monthly Column View" subtitle="Month-wise collection %, contactability %, and first bounce %" theme={theme} style={{ marginTop:14 }}>
              <div style={{ overflowX:"auto", background:theme.bg, border:`1px solid ${theme.border}`, borderRadius:12, padding:"12px 12px 10px" }}>
                <div style={{ minWidth:980 }}>
                  <div style={{ height:240, position:"relative", borderBottom:`1px solid ${theme.border}` }}>
                    {[25, 50, 75, 100].map(tick => (
                      <div key={tick} style={{ position:"absolute", left:0, right:0, bottom:`${tick * 2}px`, borderTop:`1px dashed ${theme.border}`, opacity:0.75 }} />
                    ))}
                    <div style={{ position:"absolute", right:0, top:0, display:"flex", flexDirection:"column", gap:36, color:theme.subtext, fontSize:9 }}>
                      <span>100%</span><span>75%</span><span>50%</span><span>25%</span>
                    </div>

                    <div style={{ height:"100%", display:"flex", alignItems:"flex-end", gap:14, padding:"0 26px 0 6px" }}>
                      {data.collectionsMonthly.map((row, i) => {
                        const collectionPct = Math.max(0, Math.min(100, row.contactability - row.femi * 1.35));
                        const series = [
                          { label:"Collection %", value: collectionPct, color: theme.accent },
                          { label:"Contactability %", value: row.contactability, color: theme.accent2 },
                          { label:"First Bounce %", value: row.femi, color: "#EF4444" },
                        ];

                        return (
                          <div key={row.month} style={{ minWidth:68, flex:"0 0 auto" }}>
                            <div style={{ height:220, display:"flex", alignItems:"flex-end", justifyContent:"center", gap:6 }}>
                              {series.map((bar, idx) => (
                                <div key={idx} style={{ width:14, borderRadius:"8px 8px 3px 3px", height:`${Math.max(10, bar.value * 2)}px`, background: bar.color, boxShadow:`0 6px 16px ${bar.color}33`, position:"relative" }} title={`${bar.label}: ${bar.value.toFixed(1)}%`}>
                                  <span style={{ position:"absolute", top:-16, left:"50%", transform:"translateX(-50%)", fontSize:9, color:bar.color, fontWeight:700, whiteSpace:"nowrap" }}>{bar.value.toFixed(1)}%</span>
                                </div>
                              ))}
                            </div>
                            <div style={{ marginTop:8, textAlign:"center", fontSize:11, fontWeight:700, color: theme.text }}>
                              <EditableText value={row.month} onChange={v=>update(`collectionsMonthly[${i}].month`,v)} style={{ fontSize:11, fontWeight:700 }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginTop:12 }}>
                {[
                  { label:"Collection %", color: theme.accent },
                  { label:"Contactability %", color: theme.accent2 },
                  { label:"First Bounce %", color: "#EF4444" },
                ].map((l, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:7, fontSize:11, color: theme.subtext, padding:"4px 8px", border:`1px solid ${theme.border}`, borderRadius:16 }}>
                    <span style={{ width:10, height:10, borderRadius:2, background:l.color, display:"inline-block" }} />
                    {l.label}
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Collections Month-wise Table" subtitle="Monthly disbursal, bounce, bucket, and contactability view" theme={theme} style={{ marginTop:14 }}>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, minWidth:980 }}>
                  <thead>
                    <tr style={{ borderBottom:`2px solid ${theme.border}` }}>
                      {[
                        "Month",
                        "Disbursal Amount",
                        "FEMI % (First Bounce)",
                        "Current POS",
                        "Currently Bucket X (Users in DPD 1-30)",
                        "Currently Bucket 1 (Users in DPD 31-60)",
                        "Currently Bucket 2 (Users in DPD 61-90)",
                        "Currently Bucket 3 (Users in DPD 90+)",
                        "Contactability %",
                      ].map(h => (
                        <th key={h} style={{ padding:"10px 12px", textAlign:"left", color: theme.subtext, fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.04em", whiteSpace:"nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.collectionsMonthly.map((row, i) => (
                      <tr key={row.month} style={{ borderBottom:`1px solid ${theme.border}` }}>
                        <td style={{ padding:"10px 12px", color: theme.text, fontWeight:600 }}>
                          <EditableText value={row.month} onChange={v=>update(`collectionsMonthly[${i}].month`,v)} style={{ fontSize:12, fontWeight:600 }} />
                        </td>
                        <td style={{ padding:"10px 12px", color: theme.subtext }}>₹<EditableValue value={row.disbursal} onChange={v=>update(`collectionsMonthly[${i}].disbursal`,v)} fontSize={12} color={theme.subtext} /></td>
                        <td style={{ padding:"10px 12px", color: theme.subtext }}><EditableValue value={row.femi} onChange={v=>update(`collectionsMonthly[${i}].femi`,v)} fontSize={12} color={theme.subtext} suffix="%" /></td>
                        <td style={{ padding:"10px 12px", color: theme.subtext }}>₹<EditableValue value={row.currentPOS} onChange={v=>update(`collectionsMonthly[${i}].currentPOS`,v)} fontSize={12} color={theme.subtext} /></td>
                        <td style={{ padding:"10px 12px", color: theme.subtext }}><EditableValue value={row.bucketX} onChange={v=>update(`collectionsMonthly[${i}].bucketX`,v)} fontSize={12} color={theme.subtext} /></td>
                        <td style={{ padding:"10px 12px", color: theme.subtext }}><EditableValue value={row.bucket1} onChange={v=>update(`collectionsMonthly[${i}].bucket1`,v)} fontSize={12} color={theme.subtext} /></td>
                        <td style={{ padding:"10px 12px", color: theme.subtext }}><EditableValue value={row.bucket2} onChange={v=>update(`collectionsMonthly[${i}].bucket2`,v)} fontSize={12} color={theme.subtext} /></td>
                        <td style={{ padding:"10px 12px", color: theme.subtext }}><EditableValue value={row.bucket3} onChange={v=>update(`collectionsMonthly[${i}].bucket3`,v)} fontSize={12} color={theme.subtext} /></td>
                        <td style={{ padding:"10px 12px", color: theme.subtext }}><EditableValue value={row.contactability} onChange={v=>update(`collectionsMonthly[${i}].contactability`,v)} fontSize={12} color={theme.subtext} suffix="%" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            TAB 3 — PRODUCT MIX (unchanged)
        ══════════════════════════════════════════════ */}
        {activeTab === 3 && (
          <div>
            <Panel title="Product Portfolio — Full Detail" subtitle="Click any cell to edit" theme={theme} style={{ marginBottom:14 }}>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                  <thead>
                    <tr style={{ borderBottom:`2px solid ${theme.border}` }}>
                      {["Product","AUM (₹Cr)","Portfolio %","NPA %","Status"].map(h => (
                        <th key={h} style={{ padding:"10px 12px", textAlign: h==="Product"?"left":"center", color: theme.subtext, fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.productMix.map((p, i) => {
                      const c      = npaColor(p.npa);
                      const status = p.npa < 3 ? "Healthy" : p.npa < 5 ? "Watch" : "Stress";
                      return (
                        <tr key={i} style={{ borderBottom:`1px solid ${theme.border}` }}>
                          <td style={{ padding:"12px", color: theme.text, fontWeight:600 }}>
                            <EditableText value={p.product} onChange={v=>update(`productMix[${i}].product`,v)} style={{ fontWeight:600 }} />
                          </td>
                          <td style={{ padding:"12px", textAlign:"center", color: theme.subtext }}>
                            ₹<EditableValue value={p.aum} onChange={v=>update(`productMix[${i}].aum`,v)} fontSize={12} color={theme.subtext} />
                          </td>
                          <td style={{ padding:"12px", textAlign:"center" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:6, justifyContent:"center" }}>
                              <div style={{ width:36, background: theme.border, borderRadius:4, height:6 }}>
                                <div style={{ width:`${(p.pct/30)*100}%`, background: theme.accent2, height:"100%", borderRadius:4 }} />
                              </div>
                              <EditableValue value={p.pct} onChange={v=>update(`productMix[${i}].pct`,v)} fontSize={12} color={theme.subtext} suffix="%" />
                            </div>
                          </td>
                          <td style={{ padding:"12px", textAlign:"center", color: c, fontWeight:700 }}>
                            <EditableValue value={p.npa} onChange={v=>update(`productMix[${i}].npa`,v)} fontSize={12} color={c} suffix="%" />
                          </td>
                          <td style={{ padding:"12px", textAlign:"center" }}>
                            <span style={{ background:`${c}22`, color: c, padding:"3px 10px", borderRadius:20, fontSize:10, fontWeight:700 }}>{status}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Panel>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <Panel title="AUM Distribution" subtitle="Donut by product AUM" theme={theme}>
                <div style={{ display:"flex", justifyContent:"center", marginBottom:12 }}>
                  <Donut segments={data.productMix.map(p=>({value:p.aum}))} size={130} accent={theme.accent} accent2={theme.accent2} />
                </div>
                {data.productMix.map((p, i) => {
                  const clrs=[theme.accent,theme.accent2,"#F59E0B","#EF4444","#A855F7","#EC4899"];
                  const total = data.productMix.reduce((a,b)=>a+b.aum,0);
                  return (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                      <div style={{ width:10, height:10, borderRadius:2, background: clrs[i], flexShrink:0 }} />
                      <span style={{ fontSize:11, color: theme.subtext, flex:1 }}>{p.product}</span>
                      <span style={{ fontSize:11, fontWeight:700, color: theme.text }}>₹{p.aum}Cr</span>
                      <span style={{ fontSize:10, color: clrs[i] }}>{((p.aum/total)*100).toFixed(1)}%</span>
                    </div>
                  );
                })}
              </Panel>

              <Panel title="NPA Heatmap" subtitle="Intensity = NPA severity" theme={theme}>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:4 }}>
                  {data.productMix.map((p, i) => {
                    const intensity = Math.min(p.npa / 10, 1);
                    const c = npaColor(p.npa);
                    return (
                      <div key={i} style={{ background:`rgba(239,68,68,${intensity*0.55+0.04})`, borderRadius:10, padding:"14px 16px", flex:"1 1 120px", border:`1px solid ${c}44` }}>
                        <div style={{ fontSize:11, color: theme.text, fontWeight:600, marginBottom:4 }}>{p.product}</div>
                        <div style={{ fontSize:24, fontWeight:800, color: c }}>{p.npa}%</div>
                        <div style={{ fontSize:9, color: theme.subtext }}>GNPA</div>
                      </div>
                    );
                  })}
                </div>
              </Panel>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            TAB 4 — LIQUIDITY & CAPITAL (unchanged)
        ══════════════════════════════════════════════ */}
        {activeTab === 4 && pv.liquidity && (
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12, marginBottom:16 }}>
              {[
                { label:"CAR",            field:"liquidity.car",           desc:"Capital Adequacy",  color: theme.accent,  threshold:15, higher:true,  icon:"🏛️", sfx:"%" },
                { label:"Tier 1 Capital", field:"liquidity.tier1",         desc:"Core Capital",      color: theme.accent2, threshold:12, higher:true,  icon:"💎", sfx:"%" },
                { label:"LCR",            field:"liquidity.lcr",           desc:"Liquidity Coverage",color:"#A855F7",       threshold:100,higher:true,  icon:"💧", sfx:"%" },
                { label:"Debt / Equity",  field:"liquidity.debtEquity",    desc:"Leverage Ratio",    color:"#F59E0B",       threshold:7,  higher:false, icon:"⚖️", sfx:"x" },
                { label:"Borrowing Cost", field:"liquidity.borrowingCost", desc:"Weighted Avg CoF",  color:"#EF4444",       threshold:10, higher:false, icon:"💸", sfx:"%" },
                { label:"Bank Lines",     field:"liquidity.bankLines",     desc:"Share of borrowings",color: theme.accent2, threshold:50, higher:false, icon:"🏦", sfx:"%" },
              ].map((k, i) => {
                const val = k.field.split(".").reduce((o,p)=>o[p], data);
                const ok  = k.higher ? val >= k.threshold : val <= k.threshold;
                return (
                  <div key={i} style={{ background: theme.card, borderRadius:14, padding:"18px 20px", border:`1px solid ${ok?k.color+"33":"#EF444433"}` }}>
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <div style={{ fontSize:10, color: theme.subtext, textTransform:"uppercase", letterSpacing:"0.06em", fontWeight:600 }}>{k.label}</div>
                      <span style={{ fontSize:14 }}>{k.icon}</span>
                    </div>
                    <div style={{ fontSize:24, fontWeight:800, color: ok?k.color:"#EF4444", margin:"8px 0 2px" }}>
                      <EditableValue value={val} onChange={v=>update(k.field,v)} fontSize={22} color={ok?k.color:"#EF4444"} suffix={k.sfx} />
                    </div>
                    <div style={{ fontSize:10, color: theme.subtext, marginBottom:4 }}>{k.desc}</div>
                    <div style={{ fontSize:9, color: ok?theme.accent+"88":"#EF444488" }}>RBI min: {k.threshold}{k.sfx} • {ok?"✅ Compliant":"❌ Breached"}</div>
                  </div>
                );
              })}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <Panel title="Borrowing Mix" subtitle="Funding diversification — click to edit" theme={theme}>
                {[
                  { label:"Bank Lines / CC", field:"liquidity.bankLines", color: theme.accent2 },
                  { label:"NCDs / Bonds",    field:"liquidity.ncd",       color: theme.accent  },
                  { label:"ECB / FCNR",      field:"liquidity.ecb",       color:"#A855F7"       },
                  { label:"Commercial Paper",field:"liquidity.cp",        color:"#F59E0B"       },
                ].map((b, i) => {
                  const val = b.field.split(".").reduce((o,p)=>o[p], data);
                  return (
                    <div key={i} style={{ marginBottom:14 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                        <span style={{ fontSize:12, color: theme.subtext }}>{b.label}</span>
                        <span style={{ fontSize:12, fontWeight:700, color: b.color }}>
                          <EditableValue value={val} onChange={v=>update(b.field,v)} fontSize={12} color={b.color} suffix="%" />
                        </span>
                      </div>
                      <div style={{ background: theme.border, borderRadius:4, height:10, overflow:"hidden" }}>
                        <div style={{ width:`${val}%`, background: b.color, height:"100%", borderRadius:4, opacity:0.85 }} />
                      </div>
                    </div>
                  );
                })}
                <div style={{ marginTop:8, padding:"8px 10px", background:`${theme.accent}11`, borderRadius:8, fontSize:10, color: theme.subtext }}>
                  Total = {["bankLines","ncd","ecb","cp"].reduce((a,k)=>a+data.liquidity[k],0).toFixed(1)}% · Aim for &lt;50% in any single bucket
                </div>
              </Panel>

              <Panel title="ALM — Maturity Ladder" subtitle="Asset-liability gap by time bucket" theme={theme}>
                {[
                  { bucket:"Upto 1M", inflow:380,  outflow:320  },
                  { bucket:"1–3M",    inflow:620,  outflow:580  },
                  { bucket:"3–6M",    inflow:840,  outflow:810  },
                  { bucket:"6M–1Y",   inflow:1100, outflow:960  },
                  { bucket:"1–3Y",    inflow:2400, outflow:1800 },
                ].map((b, i) => {
                  const gap = b.inflow - b.outflow;
                  const c   = gap >= 0 ? theme.accent : "#EF4444";
                  return (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10, padding:"8px 10px", background: theme.bg, borderRadius:8 }}>
                      <div style={{ fontSize:10, color: theme.subtext, width:52, flexShrink:0 }}>{b.bucket}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", gap:4, marginBottom:3 }}>
                          <div style={{ flex: b.inflow/(b.inflow+b.outflow), background:`${theme.accent}55`, height:6, borderRadius:3 }} />
                          <div style={{ flex: b.outflow/(b.inflow+b.outflow), background:"#EF444455",        height:6, borderRadius:3 }} />
                        </div>
                        <div style={{ display:"flex", gap:8, fontSize:9, color: theme.subtext }}>
                          <span style={{ color: theme.accent }}>In: ₹{b.inflow}Cr</span>
                          <span style={{ color:"#EF4444" }}>Out: ₹{b.outflow}Cr</span>
                        </div>
                      </div>
                      <div style={{ fontSize:11, fontWeight:800, color: c, width:56, textAlign:"right" }}>
                        {gap>0?"+":""}₹{gap}Cr
                      </div>
                    </div>
                  );
                })}
              </Panel>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div style={{ padding:"16px 0 4px", borderTop:`1px solid ${theme.border}`, marginTop:20, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
          <div style={{ fontSize:10, color: theme.subtext }}>
            © 2026 <EditableText value={data.meta.companyName} onChange={v=>update("meta.companyName",v)} style={{ fontSize:10, color: theme.subtext }} /> · All figures in ₹ Crores unless stated
          </div>
          <div style={{ display:"flex", gap:6 }}>
            {["🟢 Live Data","RBI Compliant","IRAC Norms"].map(t=>(
              <span key={t} style={{ fontSize:9, color: theme.subtext, background: theme.card, padding:"3px 8px", borderRadius:4, border:`1px solid ${theme.border}` }}>{t}</span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

import { useState, useEffect, useRef, useCallback } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, ReferenceLine } from "recharts";

// ============================================================
// PRISM AI — Dashboard v2
// Anomaly Detection · Trend Analysis · Health Score
// Correlation Engine · Forecasting · AI Narrative
// ============================================================

const C = {
  bg: "#F0F2F5", bgCard: "#FFFFFF", bgEl: "#F7F8FA", bgHov: "#EFF1F3",
  border: "#D4D7DC", borderS: "#E4E6EB", text: "#1C2028", textS: "#606770",
  muted: "#8A8D91", accent: "#1877F2", accentS: "rgba(24,119,242,0.08)",
  accentG: "rgba(24,119,242,0.2)", green: "#31A24C", greenS: "rgba(49,162,76,0.08)",
  amber: "#F7B928", amberS: "rgba(247,185,40,0.08)", red: "#E4405F", redS: "rgba(228,64,95,0.08)",
  cyan: "#1DA1F2", cyanS: "rgba(29,161,242,0.08)", purple: "#833AB4", purpleS: "rgba(131,58,180,0.08)",
};

const I = {
  Activity: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  TrendUp: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  TrendDown: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>,
  Minus: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Alert: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Check: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  Sparkle: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>,
  Regen: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  Brain: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a7 7 0 0 1 7 7c0 2.4-1.2 4.5-3 5.7V17H8v-2.3C6.2 13.5 5 11.4 5 9a7 7 0 0 1 7-7z"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="9" y1="17" x2="9" y2="21"/><line x1="15" y1="17" x2="15" y2="21"/></svg>,
  Users: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Dollar: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Heart: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  Shield: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Link: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  Gauge: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
};

// ============================================================
// RAW METRIC DATA (12 months)
// ============================================================
const monthLabels = ["Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb"];

const rawMetrics = {
  activeUsers: { label: "Active Users", icon: <I.Users />, unit: "", data: [2410, 2580, 2790, 3100, 3340, 3510, 3680, 3890, 4120, 4350, 4280, 4540], category: "growth" },
  mrr: { label: "MRR", icon: <I.Dollar />, unit: "$", data: [18200, 19400, 21100, 23400, 25800, 27600, 29100, 31200, 33800, 36200, 35100, 38400], category: "revenue" },
  nps: { label: "NPS", icon: <I.Heart />, unit: "", data: [42, 44, 45, 47, 48, 46, 44, 43, 41, 38, 36, 34], category: "engagement" },
  churnRate: { label: "Churn Rate", icon: <I.Shield />, unit: "%", data: [3.2, 3.0, 2.8, 2.5, 2.3, 2.4, 2.6, 2.8, 3.1, 3.4, 3.8, 4.1], category: "retention", inverse: true },
  sessionDuration: { label: "Avg Session", icon: <I.Activity />, unit: "min", data: [12.3, 12.8, 13.2, 14.1, 14.8, 15.2, 15.0, 14.6, 14.1, 13.4, 12.8, 12.2], category: "engagement" },
  featureAdoption: { label: "Feature Adoption", icon: <I.Check />, unit: "%", data: [34, 36, 39, 42, 45, 48, 51, 53, 52, 50, 48, 47], category: "engagement" },
  supportTickets: { label: "Support Tickets", icon: <I.Alert />, unit: "", data: [145, 132, 128, 118, 110, 115, 124, 138, 156, 178, 195, 212], category: "retention", inverse: true },
  conversionRate: { label: "Conversion Rate", icon: <I.TrendUp />, unit: "%", data: [3.8, 4.1, 4.3, 4.6, 4.9, 5.1, 5.0, 4.8, 4.5, 4.2, 3.9, 3.7], category: "growth" },
};

// ============================================================
// ALGORITHM 1: Statistical Functions
// ============================================================
const Stats = {
  mean: (arr) => arr.reduce((s, v) => s + v, 0) / arr.length,
  stdDev: (arr) => {
    const m = Stats.mean(arr);
    return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length);
  },
  zScore: (value, arr) => {
    const sd = Stats.stdDev(arr);
    return sd === 0 ? 0 : (value - Stats.mean(arr)) / sd;
  },
  // Linear regression: returns { slope, intercept, r2 }
  linearRegression: (arr) => {
    const n = arr.length;
    const xs = arr.map((_, i) => i);
    const xm = Stats.mean(xs);
    const ym = Stats.mean(arr);
    let num = 0, den = 0, ssTot = 0, ssRes = 0;
    for (let i = 0; i < n; i++) {
      num += (xs[i] - xm) * (arr[i] - ym);
      den += (xs[i] - xm) ** 2;
    }
    const slope = den === 0 ? 0 : num / den;
    const intercept = ym - slope * xm;
    for (let i = 0; i < n; i++) {
      const pred = slope * xs[i] + intercept;
      ssTot += (arr[i] - ym) ** 2;
      ssRes += (arr[i] - pred) ** 2;
    }
    const r2 = ssTot === 0 ? 0 : 1 - ssRes / ssTot;
    return { slope, intercept, r2 };
  },
  // Exponential smoothing forecast
  forecast: (arr, periods = 3, alpha = 0.3) => {
    let level = arr[0];
    let trend = arr[1] - arr[0];
    for (let i = 1; i < arr.length; i++) {
      const newLevel = alpha * arr[i] + (1 - alpha) * (level + trend);
      trend = alpha * (newLevel - level) + (1 - alpha) * trend;
      level = newLevel;
    }
    return Array.from({ length: periods }, (_, i) => Math.round((level + trend * (i + 1)) * 10) / 10);
  },
  // Pearson correlation
  correlation: (a, b) => {
    const n = Math.min(a.length, b.length);
    const ma = Stats.mean(a.slice(0, n));
    const mb = Stats.mean(b.slice(0, n));
    let num = 0, da = 0, db = 0;
    for (let i = 0; i < n; i++) {
      num += (a[i] - ma) * (b[i] - mb);
      da += (a[i] - ma) ** 2;
      db += (b[i] - mb) ** 2;
    }
    const den = Math.sqrt(da * db);
    return den === 0 ? 0 : num / den;
  },
  percentChange: (arr) => {
    const prev = arr[arr.length - 2];
    const curr = arr[arr.length - 1];
    return prev === 0 ? 0 : Math.round(((curr - prev) / prev) * 1000) / 10;
  },
};

// ============================================================
// ALGORITHM 2: Anomaly Detection
// ============================================================
function detectAnomalies(metrics) {
  const anomalies = [];
  Object.entries(metrics).forEach(([key, metric]) => {
    const data = metric.data;
    const current = data[data.length - 1];
    const z = Stats.zScore(current, data);
    const absZ = Math.abs(z);

    if (absZ > 1.5) {
      const isNegative = metric.inverse ? z > 0 : z < 0;
      const severity = absZ > 2.5 ? "critical" : absZ > 2 ? "high" : "medium";
      const direction = (metric.inverse ? z > 0 : z < 0) ? "negative" : "positive";

      anomalies.push({
        key,
        metric: metric.label,
        value: current,
        unit: metric.unit,
        zScore: Math.round(z * 100) / 100,
        severity,
        direction,
        mean: Math.round(Stats.mean(data) * 10) / 10,
        stdDev: Math.round(Stats.stdDev(data) * 10) / 10,
        pctChange: Stats.percentChange(data),
      });
    }
  });
  return anomalies.sort((a, b) => Math.abs(b.zScore) - Math.abs(a.zScore));
}

// ============================================================
// ALGORITHM 3: Trend Analysis
// ============================================================
function analyzeTrends(metrics) {
  return Object.entries(metrics).map(([key, metric]) => {
    const reg = Stats.linearRegression(metric.data);
    const forecast = Stats.forecast(metric.data, 3);
    const pctChange = Stats.percentChange(metric.data);
    const direction = reg.slope > 0 ? (metric.inverse ? "worsening" : "improving") : reg.slope < 0 ? (metric.inverse ? "improving" : "declining") : "stable";
    const strength = Math.abs(reg.r2);

    return {
      key, label: metric.label, unit: metric.unit, icon: metric.icon,
      current: metric.data[metric.data.length - 1],
      pctChange,
      slope: Math.round(reg.slope * 100) / 100,
      r2: Math.round(reg.r2 * 100) / 100,
      direction,
      strength,
      forecast,
      category: metric.category,
    };
  });
}

// ============================================================
// ALGORITHM 4: Health Score
// ============================================================
function calculateHealthScore(metrics) {
  const normalize = (val, min, max, inverse = false) => {
    const clamped = Math.max(min, Math.min(max, val));
    const norm = (clamped - min) / (max - min);
    return inverse ? 1 - norm : norm;
  };

  const latest = (key) => metrics[key].data[metrics[key].data.length - 1];

  const growth = (
    normalize(Stats.percentChange(metrics.activeUsers.data), -10, 20) * 0.5 +
    normalize(latest("conversionRate"), 2, 8) * 0.5
  ) * 10;

  const engagement = (
    normalize(latest("sessionDuration"), 5, 20) * 0.4 +
    normalize(latest("featureAdoption"), 20, 70) * 0.3 +
    normalize(latest("nps"), 0, 60) * 0.3
  ) * 10;

  const retention = (
    normalize(latest("churnRate"), 0, 8, true) * 0.6 +
    normalize(latest("supportTickets"), 50, 250, true) * 0.4
  ) * 10;

  const revenue = (
    normalize(Stats.percentChange(metrics.mrr.data), -10, 20) * 0.5 +
    normalize(latest("mrr"), 10000, 50000) * 0.5
  ) * 10;

  const composite = (growth * 0.25) + (engagement * 0.25) + (retention * 0.25) + (revenue * 0.25);

  return {
    composite: Math.round(composite * 10) / 10,
    breakdown: {
      growth: Math.round(growth * 10) / 10,
      engagement: Math.round(engagement * 10) / 10,
      retention: Math.round(retention * 10) / 10,
      revenue: Math.round(revenue * 10) / 10,
    },
  };
}

// ============================================================
// ALGORITHM 5: Correlation Engine
// ============================================================
function findCorrelations(metrics) {
  const keys = Object.keys(metrics);
  const correlations = [];
  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const r = Stats.correlation(metrics[keys[i]].data, metrics[keys[j]].data);
      if (Math.abs(r) > 0.7) {
        correlations.push({
          metricA: metrics[keys[i]].label,
          metricB: metrics[keys[j]].label,
          keyA: keys[i],
          keyB: keys[j],
          correlation: Math.round(r * 100) / 100,
          strength: Math.abs(r) > 0.9 ? "strong" : "moderate",
          type: r > 0 ? "positive" : "negative",
        });
      }
    }
  }
  return correlations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
}

// ============================================================
// UI COMPONENTS
// ============================================================
const ScoreBar = ({ label, value, max = 10, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
    <span style={{ fontSize: 11, color: C.textS, width: 80, flexShrink: 0 }}>{label}</span>
    <div style={{ flex: 1, height: 5, background: C.bgEl, borderRadius: 3, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${(value / max) * 100}%`, background: color, borderRadius: 3, transition: "width 0.8s ease" }} />
    </div>
    <span style={{ fontSize: 10.5, fontFamily: "'SF Mono','Roboto Mono',monospace", color, width: 26, textAlign: "right", fontWeight: 600 }}>{value}</span>
  </div>
);

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.borderS}`, borderRadius: 8, padding: "8px 12px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
      <div style={{ fontSize: 10, color: C.muted, marginBottom: 3 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 12, color: p.color, display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.color }} />
          {p.name}: <strong>{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</strong>
        </div>
      ))}
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function DashboardV2() {
  const [aiNarrative, setAiNarrative] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);

  // Run all algorithms
  const anomalies = detectAnomalies(rawMetrics);
  const trends = analyzeTrends(rawMetrics);
  const health = calculateHealthScore(rawMetrics);
  const correlations = findCorrelations(rawMetrics);

  const healthColor = health.composite >= 7 ? C.green : health.composite >= 5 ? C.amber : C.red;

  // AI Narrative — explains algorithm results, not decides
  const generateNarrative = async () => {
    setAiLoading(true);
    try {
      const anomalyStr = anomalies.map(a => `${a.metric}: value=${a.value}${a.unit}, z-score=${a.zScore}, severity=${a.severity}, direction=${a.direction}, mean=${a.mean}`).join("\n");
      const trendStr = trends.map(t => `${t.label}: ${t.direction}, slope=${t.slope}, r²=${t.r2}, change=${t.pctChange}%, forecast=[${t.forecast.join(",")}]`).join("\n");
      const corrStr = correlations.slice(0, 5).map(c => `${c.metricA} ↔ ${c.metricB}: r=${c.correlation} (${c.type})`).join("\n");
      const healthStr = `Composite: ${health.composite}/10. Growth: ${health.breakdown.growth}, Engagement: ${health.breakdown.engagement}, Retention: ${health.breakdown.retention}, Revenue: ${health.breakdown.revenue}`;

      const response = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          system: `You are a product analytics assistant. You receive PRE-COMPUTED results from our algorithms. Your job is to EXPLAIN the findings in plain language and suggest 2-3 actions. Be concise (4-5 sentences). Do not re-analyze — explain what the algorithms found and why it matters.`,
          messages: [{ role: "user", content: `HEALTH SCORE:\n${healthStr}\n\nANOMALIES DETECTED:\n${anomalyStr || "None"}\n\nTREND ANALYSIS:\n${trendStr}\n\nCORRELATIONS:\n${corrStr}\n\nExplain the most important findings and recommend actions.` }],
        }),
      });
      const data = await response.json();
      setAiNarrative(data.content?.map(b => b.text || "").join("") || "No response.");
    } catch (err) {
      setAiNarrative(`Analysis failed: ${err.message}`);
    } finally { setAiLoading(false); }
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes slideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Inter',system-ui,sans-serif;background:${C.bg};color:${C.text}}
    ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}
  `;

  const trendIcon = (dir) => dir === "improving" ? <I.TrendUp /> : dir === "declining" || dir === "worsening" ? <I.TrendDown /> : <I.Minus />;
  const trendColor = (dir) => dir === "improving" ? C.green : dir === "declining" || dir === "worsening" ? C.red : C.muted;

  const sevColor = { critical: C.red, high: C.amber, medium: C.cyan };
  const sevBg = { critical: C.redS, high: C.amberS, medium: C.cyanS };

  return (
    <>
      <style>{css}</style>
      <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: C.bg, flex: 1, overflow: "auto" }}>
        {/* HEADER */}
        <header style={{ padding: "14px 28px", borderBottom: `1px solid ${C.borderS}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <I.Activity />
            <h1 style={{ fontSize: 17, fontWeight: 600 }}>Dashboard</h1>
            <span style={{ fontSize: 11, color: C.muted }}>Last 12 months</span>
          </div>
          <button onClick={generateNarrative} disabled={aiLoading} style={{
            display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 8, border: "none",
            background: C.accent, color: "white", fontSize: 12.5, fontWeight: 500, fontFamily: "'Inter',system-ui,sans-serif", cursor: "pointer",
            boxShadow: "0 2px 8px rgba(24,119,242,0.25)", opacity: aiLoading ? 0.7 : 1,
          }}>
            <span style={{ display: "flex", animation: aiLoading ? "spin 1s linear infinite" : "none" }}>{aiLoading ? <I.Regen /> : <I.Brain />}</span>
            {aiLoading ? "Analyzing..." : "AI Summary"}
          </button>
        </header>

        <div style={{ padding: "20px 28px", maxWidth: 1280, margin: "0 auto" }}>

          {/* ROW 1: Health Score + Anomalies */}
          <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 16, marginBottom: 16 }}>
            {/* Health Score */}
            <div style={{ background: C.bgCard, border: `1px solid ${C.borderS}`, borderRadius: 12, padding: 18, animation: "slideUp 0.3s ease" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}><I.Gauge /> Product Health</span>
                <span style={{ fontSize: 24, fontWeight: 700, fontFamily: "'SF Mono','Roboto Mono',monospace", color: healthColor }}>{health.composite}</span>
              </div>
              <ScoreBar label="Growth" value={health.breakdown.growth} color={C.accent} />
              <ScoreBar label="Engagement" value={health.breakdown.engagement} color={C.purple} />
              <ScoreBar label="Retention" value={health.breakdown.retention} color={health.breakdown.retention >= 6 ? C.green : C.red} />
              <ScoreBar label="Revenue" value={health.breakdown.revenue} color={C.green} />
              <div style={{ marginTop: 10, padding: "8px 10px", background: healthColor + "08", borderRadius: 7, fontSize: 11.5, color: healthColor, fontWeight: 500, textAlign: "center" }}>
                {health.composite >= 7 ? "Product is healthy" : health.composite >= 5 ? "Attention needed — engagement declining" : "Critical — multiple metrics declining"}
              </div>
            </div>

            {/* Anomalies */}
            <div style={{ background: C.bgCard, border: `1px solid ${C.borderS}`, borderRadius: 12, padding: 18, animation: "slideUp 0.3s ease 0.05s both" }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}><I.Alert /> Anomaly Detection <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 7px", borderRadius: 4, background: anomalies.length > 0 ? C.redS : C.greenS, color: anomalies.length > 0 ? C.red : C.green }}>{anomalies.length} detected</span></div>
              {anomalies.length === 0 ? (
                <div style={{ fontSize: 12.5, color: C.green, padding: 12, textAlign: "center" }}>All metrics within normal range.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {anomalies.map((a, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: sevBg[a.severity], borderRadius: 8, borderLeft: `3px solid ${sevColor[a.severity]}`, animation: `slideUp 0.2s ease ${i * 0.04}s both` }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 500, color: C.text }}>{a.metric}: {a.unit}{a.value.toLocaleString()}</div>
                        <div style={{ fontSize: 11, color: C.textS }}>
                          z-score: <strong style={{ color: sevColor[a.severity] }}>{a.zScore}</strong> | mean: {a.unit}{a.mean.toLocaleString()} | change: <span style={{ color: a.direction === "negative" ? C.red : C.green }}>{a.pctChange > 0 ? "+" : ""}{a.pctChange}%</span>
                        </div>
                      </div>
                      <span style={{ fontSize: 9.5, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: sevColor[a.severity] + "18", color: sevColor[a.severity], textTransform: "uppercase" }}>{a.severity}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ROW 2: Metric Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
            {trends.slice(0, 4).map((t, i) => {
              const chartData = rawMetrics[t.key].data.map((v, j) => ({ m: monthLabels[j], v }));
              const forecast = t.forecast;
              const forecastData = [...chartData, ...forecast.map((v, j) => ({ m: `+${j + 1}`, v, forecast: true }))];
              return (
                <div key={t.key} onClick={() => setSelectedMetric(selectedMetric === t.key ? null : t.key)} style={{
                  background: C.bgCard, border: `1px solid ${selectedMetric === t.key ? C.accent + "44" : C.borderS}`, borderRadius: 10, padding: 14, cursor: "pointer",
                  transition: "all 0.2s", animation: `slideUp 0.3s ease ${0.1 + i * 0.04}s both`,
                }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: C.textS, fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>{t.icon} {t.label}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: trendColor(t.direction) }}>{trendIcon(t.direction)} {t.pctChange > 0 ? "+" : ""}{t.pctChange}%</span>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'SF Mono','Roboto Mono',monospace", color: C.text, marginBottom: 8 }}>
                    {t.unit === "$" ? "$" : ""}{t.current.toLocaleString()}{t.unit === "%" ? "%" : t.unit === "min" ? " min" : ""}
                  </div>
                  <ResponsiveContainer width="100%" height={44}>
                    <AreaChart data={chartData}>
                      <defs><linearGradient id={`g-${t.key}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={trendColor(t.direction)} stopOpacity={0.15}/><stop offset="100%" stopColor={trendColor(t.direction)} stopOpacity={0}/></linearGradient></defs>
                      <Area type="monotone" dataKey="v" stroke={trendColor(t.direction)} strokeWidth={1.5} fill={`url(#g-${t.key})`} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 4, display: "flex", justifyContent: "space-between" }}>
                    <span>r² = {t.r2}</span>
                    <span>Forecast: {t.unit === "$" ? "$" : ""}{forecast[0].toLocaleString()}{t.unit === "%" ? "%" : ""}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ROW 3: Selected Metric Detail + Correlations + AI */}
          <div style={{ display: "grid", gridTemplateColumns: selectedMetric ? "1fr 1fr" : "1fr 1fr", gap: 16, marginBottom: 16 }}>
            {/* Full chart — top 4 second row or selected metric */}
            <div style={{ background: C.bgCard, border: `1px solid ${C.borderS}`, borderRadius: 12, padding: 18, animation: "fadeIn 0.3s" }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
                {selectedMetric ? `${rawMetrics[selectedMetric].label} — Trend + Forecast` : "Active Users — 12 Month Trend"}
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={(() => {
                  const key = selectedMetric || "activeUsers";
                  const d = rawMetrics[key].data;
                  const f = Stats.forecast(d, 3);
                  const mn = Stats.mean(d);
                  return [...d.map((v, i) => ({ m: monthLabels[i], value: v, mean: mn })), ...f.map((v, i) => ({ m: `+${i+1}`, forecast: v, mean: mn }))];
                })()}>
                  <defs>
                    <linearGradient id="mainGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.accent} stopOpacity={0.12}/><stop offset="100%" stopColor={C.accent} stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.borderS} vertical={false} />
                  <XAxis dataKey="m" tick={{ fontSize: 10, fill: C.muted }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: C.muted, fontFamily: "'SF Mono','Roboto Mono',monospace" }} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="value" stroke={C.accent} strokeWidth={2} fill="url(#mainGrad)" dot={{ r: 3, fill: C.accent, stroke: C.bgCard, strokeWidth: 2 }} name="Actual" />
                  <Line type="monotone" dataKey="forecast" stroke={C.accent} strokeWidth={2} strokeDasharray="6 4" dot={{ r: 3, fill: C.bgCard, stroke: C.accent, strokeWidth: 2 }} name="Forecast" />
                  <Line type="monotone" dataKey="mean" stroke={C.muted} strokeWidth={1} strokeDasharray="3 3" dot={false} name="Mean" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Correlations */}
            <div style={{ background: C.bgCard, border: `1px solid ${C.borderS}`, borderRadius: 12, padding: 18, animation: "slideUp 0.3s ease 0.15s both" }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}><I.Link /> Correlation Engine <span style={{ fontSize: 10, color: C.muted, fontWeight: 400 }}>|r| &gt; 0.7</span></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {correlations.slice(0, 6).map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", background: C.bgEl, borderRadius: 7, animation: `slideUp 0.2s ease ${i * 0.04}s both` }}>
                    <span style={{ fontSize: 11.5, fontWeight: 500, flex: 1, color: C.text }}>{c.metricA}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <div style={{ width: 40, height: 4, background: C.borderS, borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${Math.abs(c.correlation) * 100}%`, background: c.type === "positive" ? C.green : C.red, borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 10, fontFamily: "'SF Mono','Roboto Mono',monospace", color: c.type === "positive" ? C.green : C.red, fontWeight: 600, width: 38, textAlign: "right" }}>{c.correlation}</span>
                    </div>
                    <span style={{ fontSize: 11.5, fontWeight: 500, flex: 1, textAlign: "right", color: C.text }}>{c.metricB}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10, fontSize: 11, color: C.muted, lineHeight: 1.5 }}>
                Strong correlations suggest causal links. Negative r values mean metrics move in opposite directions.
              </div>
            </div>
          </div>

          {/* ROW 4: Second set of metrics + AI Narrative */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Bottom 4 metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {trends.slice(4).map((t, i) => {
                const chartData = rawMetrics[t.key].data.map((v, j) => ({ m: monthLabels[j], v }));
                return (
                  <div key={t.key} onClick={() => setSelectedMetric(selectedMetric === t.key ? null : t.key)} style={{
                    background: C.bgCard, border: `1px solid ${selectedMetric === t.key ? C.accent + "44" : C.borderS}`, borderRadius: 10, padding: 12, cursor: "pointer",
                    transition: "all 0.2s", animation: `slideUp 0.3s ease ${0.2 + i * 0.04}s both`,
                  }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: C.textS, fontWeight: 500 }}>{t.label}</span>
                      <span style={{ fontSize: 10, color: trendColor(t.direction), display: "flex", alignItems: "center", gap: 2 }}>{trendIcon(t.direction)} {t.pctChange > 0 ? "+" : ""}{t.pctChange}%</span>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'SF Mono','Roboto Mono',monospace", marginBottom: 6 }}>
                      {t.unit === "$" ? "$" : ""}{t.current.toLocaleString()}{t.unit === "%" ? "%" : t.unit === "min" ? " min" : ""}
                    </div>
                    <ResponsiveContainer width="100%" height={32}>
                      <AreaChart data={chartData}>
                        <Area type="monotone" dataKey="v" stroke={trendColor(t.direction)} strokeWidth={1.2} fill={trendColor(t.direction) + "12"} dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                );
              })}
            </div>

            {/* AI Narrative */}
            <div style={{ background: C.bgCard, border: `1px solid ${C.borderS}`, borderRadius: 12, padding: 18, animation: "slideUp 0.3s ease 0.3s both" }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}><I.Brain /> AI Analysis</div>
              {aiNarrative ? (
                <div style={{ animation: "fadeIn 0.3s" }}>
                  <div style={{ fontSize: 13, color: C.textS, lineHeight: 1.75, marginBottom: 12 }}>{aiNarrative}</div>
                  <div style={{ padding: "8px 10px", background: C.bgEl, borderRadius: 7, fontSize: 10.5, color: C.muted }}>
                    AI explains pre-computed algorithm results. Scores, anomalies, and correlations calculated by Prism engine.
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: 24, color: C.muted }}>
                  <div style={{ width: 44, height: 44, borderRadius: 11, background: C.bgEl, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}><I.Brain /></div>
                  <div style={{ fontSize: 13, marginBottom: 4 }}>AI analysis not yet generated</div>
                  <div style={{ fontSize: 12 }}>Click "AI Summary" to explain algorithm findings in natural language.</div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

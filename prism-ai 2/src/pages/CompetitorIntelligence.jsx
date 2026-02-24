import { useState, useEffect, useRef } from "react";

// ============================================================
// PRISM AI — Competitor Intelligence v2
// Real Web Search · Proprietary Threat Scoring · AI Narrative
// ============================================================

const C = {
  bg: "#F0F2F5", bgCard: "#FFFFFF", bgEl: "#F7F8FA", bgHov: "#EFF1F3",
  border: "#D4D7DC", borderS: "#E4E6EB", text: "#1C2028", textS: "#606770",
  muted: "#8A8D91", accent: "#1877F2", accentS: "rgba(24,119,242,0.08)",
  accentG: "rgba(24,119,242,0.2)", green: "#31A24C", greenS: "rgba(49,162,76,0.08)",
  amber: "#F7B928", amberS: "rgba(247,185,40,0.08)", red: "#E4405F", redS: "rgba(228,64,95,0.08)",
  cyan: "#1DA1F2", cyanS: "rgba(29,161,242,0.08)", purple: "#833AB4", purpleS: "rgba(131,58,180,0.08)",
};

// --- ICONS ---
const I = {
  Plus: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Close: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Sparkle: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>,
  Alert: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Check: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  X: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Minus: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Globe: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Regen: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  Zap: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  TrendUp: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Shield: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Scan: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  Ext: () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  Brain: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a7 7 0 0 1 7 7c0 2.4-1.2 4.5-3 5.7V17H8v-2.3C6.2 13.5 5 11.4 5 9a7 7 0 0 1 7-7z"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="9" y1="17" x2="9" y2="21"/><line x1="15" y1="17" x2="15" y2="21"/></svg>,
};

// ============================================================
// COMPETITOR PROFILES (user-managed data)
// ============================================================
const competitors = [
  { id: "notion", name: "Notion", logo: "N", color: "#191919", category: "Workspace", keywords: ["notion product update", "notion new feature", "notion AI", "notion changelog"], website: "notion.so" },
  { id: "linear", name: "Linear", logo: "L", color: "#5E6AD2", category: "Project Management", keywords: ["linear app update", "linear new feature", "linear changelog"], website: "linear.app" },
  { id: "productboard", name: "Productboard", logo: "P", color: "#FF6B2B", category: "Product Management", keywords: ["productboard update", "productboard new feature", "productboard product"], website: "productboard.com" },
  { id: "asana", name: "Asana", logo: "A", color: "#F06A6A", category: "Work Management", keywords: ["asana product update", "asana AI feature", "asana new release"], website: "asana.com" },
];

// Our product features — used for overlap scoring
const ourFeatures = [
  "AI PRD generation", "feedback analysis", "feature prioritization", "sprint planning",
  "roadmap builder", "competitor tracking", "AI insights dashboard", "predictive analytics",
  "natural language search", "real-time collaboration", "custom dashboards",
];

const ourUserRequests = [
  "real-time collaboration", "offline mode", "slack integration", "SSO SAML",
  "role-based permissions", "API webhooks", "mobile app", "custom workflows",
  "jira integration", "audit logs", "bulk operations", "dark mode",
];

// ============================================================
// THREAT SCORING ENGINE (proprietary algorithm)
// ============================================================
const ThreatEngine = {
  // Keyword sets for scoring dimensions
  highImpactKeywords: ["ai", "machine learning", "automation", "analytics", "insights", "intelligence", "prediction", "copilot", "assistant"],
  urgentKeywords: ["launch", "release", "ship", "announce", "available now", "general availability", "beta", "new feature"],
  pricingKeywords: ["pricing", "price", "plan", "tier", "free", "enterprise", "cost", "discount"],
  partnerKeywords: ["partnership", "acquire", "acquisition", "merge", "integrate", "integration"],

  // Score relevance: how much this relates to our market (0-10)
  scoreRelevance(text, competitor) {
    let score = 3; // baseline
    const lower = text.toLowerCase();
    // PM-specific terms boost relevance
    const pmTerms = ["product management", "product manager", "roadmap", "prd", "sprint", "backlog", "feature request", "user feedback", "prioritization"];
    pmTerms.forEach(t => { if (lower.includes(t)) score += 1.5; });
    // AI terms are highly relevant to us
    this.highImpactKeywords.forEach(k => { if (lower.includes(k)) score += 0.8; });
    // Same category = higher relevance
    if (competitor.category === "Product Management") score += 2;
    if (competitor.category === "Project Management") score += 1;
    return Math.min(10, Math.round(score * 10) / 10);
  },

  // Score impact: potential effect on our users (0-10)
  scoreImpact(text) {
    let score = 2;
    const lower = text.toLowerCase();
    this.highImpactKeywords.forEach(k => { if (lower.includes(k)) score += 1.2; });
    this.partnerKeywords.forEach(k => { if (lower.includes(k)) score += 0.8; });
    // Check overlap with features our users are requesting
    ourUserRequests.forEach(req => { if (lower.includes(req)) score += 1.5; });
    // Check overlap with our existing features
    ourFeatures.forEach(feat => { if (lower.includes(feat)) score += 1.0; });
    return Math.min(10, Math.round(score * 10) / 10);
  },

  // Score urgency: how quickly we need to respond (0-10)
  scoreUrgency(text) {
    let score = 2;
    const lower = text.toLowerCase();
    this.urgentKeywords.forEach(k => { if (lower.includes(k)) score += 1.5; });
    this.pricingKeywords.forEach(k => { if (lower.includes(k)) score += 1.0; });
    // Recent = more urgent (simple heuristic)
    if (lower.includes("today") || lower.includes("just")) score += 2;
    if (lower.includes("this week") || lower.includes("yesterday")) score += 1.5;
    return Math.min(10, Math.round(score * 10) / 10);
  },

  // Score feature overlap: does this directly compete with our features (0-10)
  scoreOverlap(text) {
    let score = 0;
    const lower = text.toLowerCase();
    ourFeatures.forEach(feat => {
      const keywords = feat.toLowerCase().split(" ");
      const matches = keywords.filter(k => lower.includes(k)).length;
      if (matches >= 2) score += 2.5;
      else if (matches >= 1) score += 1.0;
    });
    ourUserRequests.forEach(req => {
      if (lower.includes(req.toLowerCase())) score += 2;
    });
    return Math.min(10, Math.round(score * 10) / 10);
  },

  // COMPOSITE THREAT SCORE
  calculateThreatScore(text, competitor) {
    const relevance = this.scoreRelevance(text, competitor);
    const impact = this.scoreImpact(text);
    const urgency = this.scoreUrgency(text);
    const overlap = this.scoreOverlap(text);

    const composite = (relevance * 0.35) + (impact * 0.30) + (urgency * 0.20) + (overlap * 0.15);
    const normalized = Math.round(composite * 10) / 10;

    return {
      composite: normalized,
      breakdown: { relevance, impact, urgency, overlap },
      severity: normalized >= 7 ? "critical" : normalized >= 5 ? "high" : normalized >= 3 ? "medium" : "low",
    };
  },
};

// ============================================================
// SEVERITY CONFIG
// ============================================================
const severityCfg = {
  critical: { label: "Critical", color: C.red, bg: C.redS, icon: <I.Alert /> },
  high: { label: "High", color: C.amber, bg: C.amberS, icon: <I.TrendUp /> },
  medium: { label: "Medium", color: C.cyan, bg: C.cyanS, icon: <I.Shield /> },
  low: { label: "Low", color: C.muted, bg: "rgba(113,113,126,0.1)", icon: <I.Shield /> },
};

// ============================================================
// FEATURE MATRIX
// ============================================================
const featureMatrix = [
  { cat: "Core PM", features: [
    { name: "AI PRD Generation", us: "full", notion: "partial", linear: "none", productboard: "none", asana: "none" },
    { name: "Feedback Analysis", us: "full", notion: "none", linear: "none", productboard: "full", asana: "none" },
    { name: "Feature Prioritization (AI)", us: "full", notion: "none", linear: "partial", productboard: "full", asana: "partial" },
    { name: "Sprint Planning (AI)", us: "full", notion: "none", linear: "full", productboard: "none", asana: "partial" },
    { name: "Roadmap Builder", us: "full", notion: "partial", linear: "full", productboard: "full", asana: "full" },
    { name: "Competitor Tracking", us: "full", notion: "none", linear: "none", productboard: "partial", asana: "none" },
  ]},
  { cat: "AI & Analytics", features: [
    { name: "AI Insights Dashboard", us: "full", notion: "partial", linear: "none", productboard: "none", asana: "partial" },
    { name: "Predictive Analytics", us: "partial", notion: "none", linear: "none", productboard: "none", asana: "none" },
    { name: "Auto-categorization", us: "full", notion: "partial", linear: "partial", productboard: "full", asana: "partial" },
    { name: "Natural Language Search", us: "full", notion: "full", linear: "partial", productboard: "none", asana: "partial" },
  ]},
  { cat: "Enterprise", features: [
    { name: "SSO / SAML", us: "planned", notion: "full", linear: "full", productboard: "full", asana: "full" },
    { name: "Audit Logs", us: "planned", notion: "full", linear: "full", productboard: "full", asana: "full" },
    { name: "API & Webhooks", us: "partial", notion: "full", linear: "full", productboard: "full", asana: "full" },
  ]},
];

const stIcon = { full: <I.Check />, partial: <I.Minus />, none: <I.X />, planned: <I.Zap /> };
const stColor = { full: C.green, partial: C.amber, none: C.red + "66", planned: C.accent };
const stLabel = { full: "Yes", partial: "Partial", none: "No", planned: "Planned" };

// ============================================================
// MARKET MAP DATA
// ============================================================
const mapData = [
  { id: "us", name: "Prism (Us)", x: 85, y: 25, size: 20, color: C.accent },
  { id: "notion", name: "Notion", x: 55, y: 55, size: 34, color: "#191919" },
  { id: "linear", name: "Linear", x: 72, y: 40, size: 18, color: "#5E6AD2" },
  { id: "productboard", name: "Productboard", x: 45, y: 32, size: 22, color: "#FF6B2B" },
  { id: "asana", name: "Asana", x: 30, y: 62, size: 38, color: "#F06A6A" },
];

// ============================================================
// MODAL
// ============================================================
const Modal = ({ isOpen, onClose, title, children, width = 620 }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.25)", backdropFilter: "blur(4px)", animation: "fadeIn 0.15s" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, width: "92%", maxWidth: width, maxHeight: "85vh", overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,0.12)", animation: "scaleIn 0.2s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: `1px solid ${C.borderS}` }}>
          <span style={{ fontSize: 15, fontWeight: 600 }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", display: "flex" }}><I.Close /></button>
        </div>
        <div style={{ padding: 20, overflowY: "auto", maxHeight: "calc(85vh - 56px)" }}>{children}</div>
      </div>
    </div>
  );
};

// ============================================================
// SCORE BAR COMPONENT
// ============================================================
const ScoreBar = ({ label, value, max = 10, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
    <span style={{ fontSize: 10.5, color: C.textS, width: 70, flexShrink: 0 }}>{label}</span>
    <div style={{ flex: 1, height: 5, background: C.bgEl, borderRadius: 3, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${(value / max) * 100}%`, background: color, borderRadius: 3, transition: "width 0.6s ease" }} />
    </div>
    <span style={{ fontSize: 10, fontFamily: "'SF Mono','Roboto Mono',monospace", color, width: 24, textAlign: "right" }}>{value}</span>
  </div>
);

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function CompetitorIntelligenceV2() {
  const [tab, setTab] = useState("intelligence");
  const [scanResults, setScanResults] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState({ step: "", pct: 0, competitor: "" });
  const [selectedResult, setSelectedResult] = useState(null);
  const [aiNarratives, setAiNarratives] = useState({});
  const [narrativeLoading, setNarrativeLoading] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [sortBy, setSortBy] = useState("score");

  // ============================================================
  // STEP 1: SCAN — Real web search for each competitor
  // ============================================================
  const scanCompetitors = async () => {
    setScanning(true);
    setScanResults([]);
    setAiNarratives({});
    const allResults = [];

    for (let ci = 0; ci < competitors.length; ci++) {
      const comp = competitors[ci];
      setScanProgress({ step: "Searching", pct: Math.round(((ci) / competitors.length) * 60), competitor: comp.name });

      // Use Claude with web search tool to find real competitor updates
      try {
        const response = await fetch("/api/claude", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1500,
            tools: [{ type: "web_search_20250305", name: "web_search" }],
            messages: [{ role: "user", content: `Search for the latest product updates, new features, and announcements from ${comp.name} (${comp.website}) in the last 30 days. Focus on product features, AI capabilities, pricing changes, partnerships, and major releases.

Return ONLY a list of findings in this exact format (no other text):

===FINDING===
TITLE: Short title of the update
SUMMARY: 1-2 sentence summary of what happened
SOURCE: URL or source name
DATE: Approximate date
===END_FINDING===

Return 3-5 most important findings. If you find nothing recent, say ===NO_RESULTS===` }],
          }),
        });

        const data = await response.json();
        const text = data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "";

        if (!text.includes("===NO_RESULTS===")) {
          const findingRegex = /===FINDING===\s*TITLE:\s*(.*?)\s*SUMMARY:\s*([\s\S]*?)\s*SOURCE:\s*(.*?)\s*DATE:\s*(.*?)\s*===END_FINDING===/g;
          let match;
          while ((match = findingRegex.exec(text)) !== null) {
            const title = match[1].trim();
            const summary = match[2].trim();
            const source = match[3].trim();
            const date = match[4].trim();
            const fullText = `${title}. ${summary}`;

            // STEP 2: Run our proprietary scoring engine
            const threat = ThreatEngine.calculateThreatScore(fullText, comp);

            allResults.push({
              id: `${comp.id}-${allResults.length}`,
              competitor: comp,
              title,
              summary,
              source,
              date,
              threat,
              narrativeGenerated: false,
            });
          }
        }
      } catch (err) {
        console.error(`Scan failed for ${comp.name}:`, err);
      }
    }

    // Sort by composite threat score
    allResults.sort((a, b) => b.threat.composite - a.threat.composite);

    setScanProgress({ step: "Scoring complete", pct: 100, competitor: "" });
    setScanResults(allResults);
    setScanning(false);
  };

  // ============================================================
  // STEP 3: AI NARRATIVE — explains WHY score is what it is
  // ============================================================
  const generateNarrative = async (result) => {
    const key = result.id;
    setNarrativeLoading(key);

    try {
      const response = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 600,
          system: `You are a competitive intelligence analyst. You are given a competitor update and its pre-calculated threat scores. Your job is to EXPLAIN the scores and recommend action. Be concise (3-4 sentences max).

IMPORTANT: The scoring algorithm already determined the threat level. Do NOT re-evaluate. Instead explain WHY each dimension scored the way it did and what action we should take.

Our product (Prism AI) is an AI-native product management tool with: ${ourFeatures.join(", ")}.
Our users frequently request: ${ourUserRequests.join(", ")}.`,
          messages: [{ role: "user", content: `Competitor: ${result.competitor.name} (${result.competitor.category})
Update: ${result.title} — ${result.summary}

Pre-calculated threat scores:
- Composite: ${result.threat.composite}/10 (${result.threat.severity})
- Relevance: ${result.threat.breakdown.relevance}/10
- Impact: ${result.threat.breakdown.impact}/10
- Urgency: ${result.threat.breakdown.urgency}/10
- Feature Overlap: ${result.threat.breakdown.overlap}/10

Explain why these scores make sense and recommend a specific action. Keep it to 3-4 sentences. Start with the most important insight.` }],
        }),
      });

      const data = await response.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      setAiNarratives(prev => ({ ...prev, [key]: text }));
    } catch (err) {
      setAiNarratives(prev => ({ ...prev, [key]: `Failed to generate narrative: ${err.message}` }));
    } finally {
      setNarrativeLoading(null);
    }
  };

  // Filter & sort
  const filteredResults = scanResults
    .filter(r => filterSeverity === "all" || r.threat.severity === filterSeverity)
    .sort((a, b) => sortBy === "score" ? b.threat.composite - a.threat.composite : sortBy === "date" ? 0 : a.competitor.name.localeCompare(b.competitor.name));

  // Stats
  const criticalCount = scanResults.filter(r => r.threat.severity === "critical").length;
  const highCount = scanResults.filter(r => r.threat.severity === "high").length;
  const avgScore = scanResults.length > 0 ? (scanResults.reduce((s, r) => s + r.threat.composite, 0) / scanResults.length).toFixed(1) : 0;

  const tabs = [
    { id: "intelligence", label: "Threat Intel" },
    { id: "matrix", label: "Feature Matrix" },
    { id: "map", label: "Market Map" },
  ];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes scaleIn{from{opacity:0;transform:scale(0.97)}to{opacity:1;transform:scale(1)}}
    @keyframes slideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(24,119,242,0.15)}50%{box-shadow:0 0 14px 3px rgba(24,119,242,0.1)}}
    @keyframes scanPulse{0%,100%{opacity:1}50%{opacity:0.5}}
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Inter',system-ui,-apple-system,sans-serif;background:${C.bg};color:${C.text}}
    ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}
  `;

  return (
    <>
      <style>{css}</style>
      <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: C.bg, color: C.text, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>

        {/* HEADER */}
        <header style={{ padding: "12px 24px", borderBottom: `1px solid ${C.borderS}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <h1 style={{ fontSize: 17, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}><I.Globe /> Competitor Intelligence</h1>
            <div style={{ display: "flex", gap: 3, background: C.bgCard, padding: 3, borderRadius: 7, border: `1px solid ${C.borderS}` }}>
              {tabs.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  padding: "5px 12px", borderRadius: 5, border: "none", fontSize: 12, fontWeight: 500, cursor: "pointer",
                  background: tab === t.id ? C.accent : "transparent", color: tab === t.id ? "white" : C.muted,
                  fontFamily: "'Inter',system-ui,sans-serif", transition: "all 0.15s",
                }}>{t.label}</button>
              ))}
            </div>
            {scanResults.length > 0 && (
              <div style={{ display: "flex", gap: 6 }}>
                {criticalCount > 0 && <span style={{ fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 5, background: C.redS, color: C.red }}>{criticalCount} Critical</span>}
                {highCount > 0 && <span style={{ fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 5, background: C.amberS, color: C.amber }}>{highCount} High</span>}
                <span style={{ fontSize: 10.5, color: C.muted }}>Avg score: <strong style={{ color: C.accent }}>{avgScore}/10</strong></span>
              </div>
            )}
          </div>
          <button onClick={scanCompetitors} disabled={scanning} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 8, border: "none",
            background: C.accent, color: "white", fontSize: 13, fontWeight: 500, fontFamily: "'Inter',system-ui,sans-serif", cursor: "pointer",
            boxShadow: '0 2px 8px rgba(24,119,242,0.25)', opacity: scanning ? 0.7 : 1,
          }}>
            <span style={{ display: "flex", animation: scanning ? "spin 1s linear infinite" : "none" }}>{scanning ? <I.Regen /> : <I.Scan />}</span>
            {scanning ? "Scanning..." : "Scan Competitors"}
          </button>
        </header>

        {/* SCAN PROGRESS */}
        {scanning && (
          <div style={{ padding: "10px 24px", borderBottom: `1px solid ${C.borderS}`, background: C.bgCard, animation: "fadeIn 0.2s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: C.textS, animation: "scanPulse 1.5s infinite" }}>
                {scanProgress.step} {scanProgress.competitor && `— ${scanProgress.competitor}`}...
              </span>
              <span style={{ fontSize: 11, fontFamily: "'SF Mono','Roboto Mono',monospace", color: C.accent }}>{scanProgress.pct}%</span>
            </div>
            <div style={{ height: 4, background: C.bgEl, borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${scanProgress.pct}%`, background: `linear-gradient(90deg, ${C.accent}, #818cf8)`, borderRadius: 2, transition: "width 0.5s ease" }} />
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              {competitors.map(comp => {
                const done = scanResults.some(r => r.competitor.id === comp.id);
                const current = scanProgress.competitor === comp.name;
                return (
                  <div key={comp.id} style={{ display: "flex", alignItems: "center", gap: 5, opacity: done ? 1 : current ? 0.8 : 0.3 }}>
                    <div style={{ width: 18, height: 18, borderRadius: 4, background: comp.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: comp.id === "notion" ? "#000" : "#fff" }}>{comp.logo}</div>
                    <span style={{ fontSize: 11, color: done ? C.green : current ? C.accent : C.muted }}>{comp.name}</span>
                    {done && <span style={{ color: C.green }}><I.Check /></span>}
                    {current && <span style={{ display: "flex", animation: "spin 1s linear infinite", color: C.accent }}><I.Regen /></span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ flex: 1, overflow: "auto", padding: 20 }}>

          {/* ===== THREAT INTEL TAB ===== */}
          {tab === "intelligence" && (
            <>
              {scanResults.length === 0 && !scanning ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60, gap: 14 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: C.accentS, display: "flex", alignItems: "center", justifyContent: "center" }}><I.Shield /></div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: C.textS }}>Competitive Intelligence Dashboard</div>
                  <div style={{ fontSize: 13, color: C.muted, maxWidth: 480, textAlign: "center", lineHeight: 1.7 }}>
                    Click <strong style={{ color: C.accent }}>Scan Competitors</strong> to search the web for real-time competitor updates. Each finding will be scored by our <strong style={{ color: C.accent }}>Threat Scoring Engine</strong> across 4 dimensions: Relevance, Impact, Urgency, and Feature Overlap.
                  </div>
                  <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                    {["Relevance ×0.35", "Impact ×0.30", "Urgency ×0.20", "Overlap ×0.15"].map((w, i) => (
                      <span key={i} style={{ fontSize: 10.5, padding: "4px 10px", borderRadius: 6, background: C.bgCard, border: `1px solid ${C.borderS}`, color: C.textS }}>
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ animation: "fadeIn 0.3s ease" }}>
                  {/* Controls */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <span style={{ fontSize: 12, color: C.muted, display: "flex", alignItems: "center", gap: 4 }}>Filter:</span>
                      {["all", "critical", "high", "medium", "low"].map(s => (
                        <button key={s} onClick={() => setFilterSeverity(s)} style={{
                          fontSize: 11, padding: "3px 10px", borderRadius: 5, border: `1px solid ${filterSeverity === s ? C.accent + "44" : C.borderS}`,
                          background: filterSeverity === s ? C.accentS : "transparent", color: filterSeverity === s ? C.accent : C.muted,
                          cursor: "pointer", fontFamily: "'Inter',system-ui,sans-serif", textTransform: "capitalize", transition: "all 0.15s",
                        }}>{s === "all" ? "All" : s}</button>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: C.muted }}>Sort:</span>
                      {[{ id: "score", label: "Threat Score" }, { id: "name", label: "Competitor" }].map(s => (
                        <button key={s.id} onClick={() => setSortBy(s.id)} style={{
                          fontSize: 11, padding: "3px 10px", borderRadius: 5, border: `1px solid ${sortBy === s.id ? C.accent + "44" : C.borderS}`,
                          background: sortBy === s.id ? C.accentS : "transparent", color: sortBy === s.id ? C.accent : C.muted,
                          cursor: "pointer", fontFamily: "'Inter',system-ui,sans-serif", transition: "all 0.15s",
                        }}>{s.label}</button>
                      ))}
                    </div>
                  </div>

                  {/* Results */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {filteredResults.map((r, i) => {
                      const sev = severityCfg[r.threat.severity];
                      const hasNarrative = aiNarratives[r.id];
                      const isLoadingNarrative = narrativeLoading === r.id;
                      return (
                        <div key={r.id} style={{
                          background: C.bgCard, border: `1px solid ${sev.color}18`, borderLeft: `3px solid ${sev.color}`,
                          borderRadius: "0 11px 11px 0", padding: 0, overflow: "hidden",
                          animation: `slideUp 0.3s ease ${i * 0.05}s both`, transition: "border-color 0.2s",
                        }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = sev.color + "44"}
                          onMouseLeave={e => e.currentTarget.style.borderColor = sev.color + "18"}
                        >
                          <div style={{ padding: "14px 18px" }}>
                            {/* Header row */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{ width: 24, height: 24, borderRadius: 5, background: r.competitor.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff" }}>{r.competitor.logo}</div>
                                <span style={{ fontSize: 13, fontWeight: 500 }}>{r.competitor.name}</span>
                                <span style={{ fontSize: 9.5, padding: "2px 7px", borderRadius: 4, background: sev.bg, color: sev.color, fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
                                  {sev.icon} {sev.label}
                                </span>
                                <span style={{ fontSize: 10.5, color: C.muted }}>{r.date}</span>
                              </div>
                              {/* COMPOSITE SCORE */}
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ fontSize: 10, color: C.muted }}>Threat Score</span>
                                <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'SF Mono','Roboto Mono',monospace", color: sev.color, background: sev.bg, padding: "2px 10px", borderRadius: 6, minWidth: 44, textAlign: "center" }}>
                                  {r.threat.composite}
                                </div>
                              </div>
                            </div>

                            {/* Title + Summary */}
                            <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 4 }}>{r.title}</div>
                            <div style={{ fontSize: 12.5, color: C.textS, lineHeight: 1.6, marginBottom: 10 }}>{r.summary}</div>

                            {/* Score Breakdown */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 20px", marginBottom: 10 }}>
                              <ScoreBar label="Relevance" value={r.threat.breakdown.relevance} color={C.accent} />
                              <ScoreBar label="Impact" value={r.threat.breakdown.impact} color={C.amber} />
                              <ScoreBar label="Urgency" value={r.threat.breakdown.urgency} color={C.red} />
                              <ScoreBar label="Overlap" value={r.threat.breakdown.overlap} color={C.cyan} />
                            </div>

                            {/* Source */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <span style={{ fontSize: 10.5, color: C.muted, display: "flex", alignItems: "center", gap: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "60%" }}>
                                <I.Globe /> {r.source}
                              </span>

                              {/* AI Narrative button */}
                              <button onClick={() => !hasNarrative && !isLoadingNarrative && generateNarrative(r)} disabled={isLoadingNarrative} style={{
                                display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 6,
                                border: hasNarrative ? `1px solid ${C.green}33` : `1px solid ${C.accent}33`,
                                background: hasNarrative ? C.greenS : C.accentS,
                                color: hasNarrative ? C.green : C.accent,
                                fontSize: 11, fontWeight: 500, fontFamily: "'Inter',system-ui,sans-serif", cursor: hasNarrative ? "default" : "pointer",
                                opacity: isLoadingNarrative ? 0.6 : 1,
                              }}>
                                {isLoadingNarrative ? (
                                  <><span style={{ display: "flex", animation: "spin 1s linear infinite" }}><I.Regen /></span> Analyzing...</>
                                ) : hasNarrative ? (
                                  <><I.Check /> AI Analysis Ready</>
                                ) : (
                                  <><I.Brain /> Explain Score</>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* AI Narrative (expandable) */}
                          {hasNarrative && (
                            <div style={{ padding: "12px 18px", background: C.bgEl, borderTop: `1px solid ${C.borderS}`, animation: "fadeIn 0.3s ease" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                                <I.Brain />
                                <span style={{ fontSize: 10.5, fontWeight: 600, color: C.accent, textTransform: "uppercase", letterSpacing: 0.5 }}>AI Analysis</span>
                              </div>
                              <div style={{ fontSize: 12.5, color: C.textS, lineHeight: 1.7 }}>{aiNarratives[r.id]}</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ===== FEATURE MATRIX ===== */}
          {tab === "matrix" && (
            <div style={{ background: C.bgCard, border: `1px solid ${C.borderS}`, borderRadius: 12, overflow: "auto", animation: "fadeIn 0.3s" }}>
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: 700 }}>
                <thead>
                  <tr>
                    <th style={{ position: "sticky", left: 0, zIndex: 5, background: C.bgCard, padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8, borderBottom: `1px solid ${C.borderS}`, width: 220 }}>Feature</th>
                    <th style={{ padding: "12px 14px", textAlign: "center", fontSize: 11, fontWeight: 600, color: C.accent, borderBottom: `1px solid ${C.borderS}`, background: C.accentS }}>Prism (Us)</th>
                    {competitors.map(c => (
                      <th key={c.id} style={{ padding: "12px 14px", textAlign: "center", fontSize: 11, fontWeight: 600, color: C.textS, borderBottom: `1px solid ${C.borderS}` }}>{c.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {featureMatrix.map((cat, ci) => (
                    <>
                      <tr key={`cat-${ci}`}>
                        <td colSpan={6} style={{ padding: "10px 16px", fontSize: 11, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: 0.8, background: C.bgEl, borderBottom: `1px solid ${C.borderS}` }}>{cat.cat}</td>
                      </tr>
                      {cat.features.map((f, fi) => (
                        <tr key={`${ci}-${fi}`} style={{ transition: "background 0.15s" }}
                          onMouseEnter={e => e.currentTarget.style.background = C.bgHov}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          <td style={{ position: "sticky", left: 0, background: "inherit", padding: "9px 16px", fontSize: 12.5, fontWeight: 500, borderBottom: `1px solid ${C.borderS}` }}>{f.name}</td>
                          {["us", "notion", "linear", "productboard", "asana"].map(key => (
                            <td key={key} style={{ padding: "9px 14px", textAlign: "center", borderBottom: `1px solid ${C.borderS}`, background: key === "us" ? C.accentS + "44" : "transparent" }}>
                              <div style={{ display: "inline-flex", alignItems: "center", gap: 4, color: stColor[f[key]] }}>
                                {stIcon[f[key]]}
                                <span style={{ fontSize: 10.5 }}>{stLabel[f[key]]}</span>
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ===== MARKET MAP ===== */}
          {tab === "map" && (
            <div style={{ animation: "fadeIn 0.3s" }}>
              <div style={{ background: C.bgCard, border: `1px solid ${C.borderS}`, borderRadius: 12, padding: 24, position: "relative", height: 480 }}>
                <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", fontSize: 11, color: C.muted, fontWeight: 500 }}>AI-Native ↑</div>
                <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", fontSize: 11, color: C.muted, fontWeight: 500 }}>Traditional ↓</div>
                <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%) rotate(-90deg)", fontSize: 11, color: C.muted, fontWeight: 500 }}>Narrow</div>
                <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%) rotate(90deg)", fontSize: 11, color: C.muted, fontWeight: 500 }}>Broad</div>
                <div style={{ position: "absolute", left: "50%", top: 40, bottom: 40, width: 1, background: C.borderS }} />
                <div style={{ position: "absolute", top: "50%", left: 40, right: 40, height: 1, background: C.borderS }} />
                {mapData.map((p, i) => (
                  <div key={p.id} style={{
                    position: "absolute", left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%,-50%)",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer",
                    animation: `scaleIn 0.4s ease ${i * 0.1}s both`, transition: "transform 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translate(-50%,-50%) scale(1.1)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translate(-50%,-50%) scale(1)"}
                  >
                    <div style={{
                      width: p.size * 2, height: p.size * 2, borderRadius: "50%", background: p.color + "22", border: `2px solid ${p.color}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: p.id === "us" ? `0 0 20px ${C.accentG}` : "none",
                      animation: p.id === "us" ? "pulse 2s infinite" : "none",
                    }}>
                      <span style={{ fontSize: p.size * 0.55, fontWeight: 700, color: p.color }}>{p.name.charAt(0)}</span>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: p.id === "us" ? C.accent : C.text }}>{p.name}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 14 }}>
                {mapData.map(p => (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: C.textS }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.color }} />{p.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

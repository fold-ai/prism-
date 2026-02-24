import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// PRISM AI — PRD Generator v2
// Readiness Score · Auto-Data · Confidence · Impact · Validator
// Light Meta Theme · No Emojis
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
  Doc: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Sparkle: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>,
  Check: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  Alert: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Close: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Edit: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Regen: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  Copy: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Download: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Data: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
  Brain: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a7 7 0 0 1 7 7c0 2.4-1.2 4.5-3 5.7V17H8v-2.3C6.2 13.5 5 11.4 5 9a7 7 0 0 1 7-7z"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="9" y1="17" x2="9" y2="21"/><line x1="15" y1="17" x2="15" y2="21"/></svg>,
  Shield: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Link: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  Target: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  TrendUp: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Users: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  History: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Plus: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Back: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Gauge: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M12 6v6l4 2"/></svg>,
};

// ============================================================
// SIMULATED PRISM DATA (from other modules)
// In production, this comes from actual Feedback, Roadmap, etc.
// ============================================================
const prismData = {
  feedback: {
    "real-time collaboration": { mentions: 67, sentiment: -0.4, topQuotes: ["Can't edit docs simultaneously", "We lose work when 2 people edit"], trend: "rising" },
    "offline mode": { mentions: 43, sentiment: -0.6, topQuotes: ["Need to work on planes", "Mobile app useless without wifi"], trend: "stable" },
    "slack integration": { mentions: 28, sentiment: -0.2, topQuotes: ["Want notifications in Slack", "Too many tabs switching"], trend: "rising" },
    "sso saml": { mentions: 15, sentiment: -0.8, topQuotes: ["Enterprise requirement", "Blocker for our security team"], trend: "stable" },
    "bulk operations": { mentions: 31, sentiment: -0.3, topQuotes: ["Need to edit 50 items at once", "CSV export is broken"], trend: "declining" },
    "api webhooks": { mentions: 22, sentiment: -0.3, topQuotes: ["Need to automate workflows", "Want to connect to our tools"], trend: "rising" },
    "mobile performance": { mentions: 43, sentiment: -0.5, topQuotes: ["App is too slow on 4G", "Battery drain is insane"], trend: "rising" },
    "custom dashboards": { mentions: 18, sentiment: -0.1, topQuotes: ["Want to see my own metrics", "Default dashboard not useful"], trend: "stable" },
  },
  prioritization: {
    "real-time collaboration": { rice: 84, reach: 9, impact: 8, confidence: 7, effort: 8 },
    "offline mode": { rice: 62, reach: 6, impact: 7, confidence: 8, effort: 5 },
    "slack integration": { rice: 71, reach: 8, impact: 6, confidence: 9, effort: 3 },
    "sso saml": { rice: 58, reach: 4, impact: 9, confidence: 10, effort: 6 },
    "bulk operations": { rice: 52, reach: 7, impact: 5, confidence: 8, effort: 3 },
    "mobile performance": { rice: 76, reach: 8, impact: 8, confidence: 7, effort: 7 },
  },
  competitors: {
    "real-time collaboration": { have: ["Notion", "Linear"], threat: 8.2 },
    "offline mode": { have: [], threat: 3.1 },
    "slack integration": { have: ["Notion", "Asana", "Linear"], threat: 5.5 },
    "sso saml": { have: ["Notion", "Linear", "Productboard", "Asana"], threat: 7.0 },
    "api webhooks": { have: ["Notion", "Linear", "Asana"], threat: 6.2 },
  },
  sprintCapacity: { totalSP: 52, availableSP: 18, avgVelocity: 27, teamSize: 5 },
  roadmap: {
    "real-time collaboration": { planned: true, quarter: "Q2 2026", dependencies: ["WebSocket infrastructure"] },
    "sso saml": { planned: true, quarter: "Q3 2026", dependencies: ["Enterprise audit log API"] },
  },
};

// ============================================================
// TEMPLATE DEFINITIONS
// ============================================================
const templates = [
  { id: "new_feature", name: "New Feature", icon: <I.Plus />, keywords: ["feature", "new", "build", "create"], fields: { featureType: "New Feature" } },
  { id: "improvement", name: "Improvement", icon: <I.TrendUp />, keywords: ["improve", "optimize", "enhance", "fix", "performance"], fields: { featureType: "Improvement" } },
  { id: "integration", name: "Integration", icon: <I.Link />, keywords: ["api", "webhook", "integrate", "connect", "sync", "slack", "jira"], fields: { featureType: "Integration" } },
  { id: "platform", name: "Platform", icon: <I.Data />, keywords: ["infrastructure", "platform", "scale", "migrate", "database", "architecture"], fields: { featureType: "Platform" } },
  { id: "mobile", name: "Mobile", icon: <I.Target />, keywords: ["mobile", "ios", "android", "app", "offline", "responsive"], fields: { featureType: "Mobile" } },
  { id: "ai_feature", name: "AI / ML", icon: <I.Brain />, keywords: ["ai", "ml", "machine learning", "model", "prediction", "intelligence"], fields: { featureType: "AI/ML" } },
];

// ============================================================
// ALGORITHM 1: Smart Template Selection
// ============================================================
function selectTemplate(featureName, problem) {
  const text = `${featureName} ${problem}`.toLowerCase();
  let best = { id: "new_feature", score: 0 };
  templates.forEach(t => {
    const score = t.keywords.reduce((s, k) => s + (text.includes(k) ? 1 : 0), 0);
    if (score > best.score) best = { id: t.id, score };
  });
  return best.id;
}

// ============================================================
// ALGORITHM 2: Auto-populated Data Lookup
// ============================================================
function lookupPrismData(featureName) {
  const key = featureName.toLowerCase().trim();
  const results = { feedback: null, prioritization: null, competitors: null, roadmap: null, matchKey: null };

  // Fuzzy match against keys
  for (const k of Object.keys(prismData.feedback)) {
    const words = k.split(" ");
    const matches = words.filter(w => key.includes(w)).length;
    if (matches >= 2 || (matches === 1 && words.length === 1)) {
      results.feedback = prismData.feedback[k];
      results.matchKey = k;
      break;
    }
  }
  if (results.matchKey) {
    results.prioritization = prismData.prioritization[results.matchKey] || null;
    results.competitors = prismData.competitors[results.matchKey] || null;
    results.roadmap = prismData.roadmap[results.matchKey] || null;
  }
  results.sprint = prismData.sprintCapacity;
  return results;
}

// ============================================================
// ALGORITHM 3: Readiness Score
// ============================================================
function calculateReadiness(fields, autoData) {
  // InputCompleteness (0-10)
  let input = 0;
  if (fields.featureName.trim().length > 3) input += 2;
  if (fields.featureName.trim().length > 10) input += 1;
  if (fields.problem.trim().length > 20) input += 2;
  if (fields.problem.trim().length > 100) input += 2;
  if (fields.context.trim().length > 10) input += 2;
  if (fields.targetUsers !== "All Users") input += 1;
  input = Math.min(10, input);

  // DataAvailability (0-10)
  let data = 0;
  if (autoData.feedback) data += 3;
  if (autoData.feedback?.mentions > 20) data += 1;
  if (autoData.prioritization) data += 2;
  if (autoData.competitors) data += 2;
  if (autoData.roadmap) data += 1;
  data += 1; // sprint data always available
  data = Math.min(10, data);

  // StakeholderClarity (0-10)
  let stakeholder = 2;
  if (fields.targetUsers !== "All Users") stakeholder += 2;
  if (fields.priority !== "Medium") stakeholder += 2;
  if (fields.problem.includes("user") || fields.problem.includes("team")) stakeholder += 2;
  if (fields.context.includes("stakeholder") || fields.context.includes("leadership")) stakeholder += 2;
  stakeholder = Math.min(10, stakeholder);

  // ScopeDefinition (0-10)
  let scope = 2;
  if (autoData.roadmap?.planned) scope += 3;
  if (autoData.roadmap?.quarter) scope += 2;
  if (autoData.roadmap?.dependencies?.length > 0) scope += 1;
  if (fields.problem.length > 50) scope += 1;
  if (fields.context.includes("sprint") || fields.context.includes("timeline")) scope += 1;
  scope = Math.min(10, scope);

  const composite = (input * 0.25) + (data * 0.30) + (stakeholder * 0.20) + (scope * 0.25);

  return {
    composite: Math.round(composite * 10) / 10,
    breakdown: { input, data, stakeholder, scope },
    ready: composite >= 5,
    warnings: [
      ...(input < 4 ? ["Add more detail to the problem statement"] : []),
      ...(data < 3 ? ["No matching feedback data found — consider adding user context"] : []),
      ...(stakeholder < 4 ? ["Specify target users and priority level"] : []),
      ...(scope < 4 ? ["Add timeline context or link to roadmap"] : []),
    ],
  };
}

// ============================================================
// ALGORITHM 4: Impact Estimation
// ============================================================
function estimateImpact(autoData) {
  if (!autoData.feedback && !autoData.prioritization) return null;
  const fb = autoData.feedback;
  const pr = autoData.prioritization;

  const userReach = fb ? Math.min(10, fb.mentions / 7) : 3;
  const frequency = pr ? (pr.reach + pr.impact) / 2 : 4;
  const revenueCorr = autoData.competitors?.threat > 6 ? 8 : autoData.competitors?.threat > 3 ? 5 : 3;
  const churnPrev = fb ? (fb.sentiment < -0.5 ? 8 : fb.sentiment < -0.2 ? 5 : 3) : 3;

  const impact = (userReach * 0.30) + (frequency * 0.25) + (revenueCorr * 0.25) + (churnPrev * 0.20);

  return {
    composite: Math.round(impact * 10) / 10,
    breakdown: { userReach: Math.round(userReach * 10) / 10, frequency: Math.round(frequency * 10) / 10, revenueCorr, churnPrev },
  };
}

// ============================================================
// ALGORITHM 5: Section Confidence Score
// ============================================================
function scoreSectionConfidence(section, autoData) {
  let dataPoints = 0;
  let specificity = 3;
  let consistency = 7;

  const content = section.content.toLowerCase();

  // Count data-backed claims
  const numberMatches = content.match(/\d+/g) || [];
  dataPoints = Math.min(10, numberMatches.length * 0.8);

  // Specificity: penalize vague language
  const vagueTerms = ["many", "some", "various", "several", "significant", "important", "key"];
  const specificTerms = ["%", "users", "revenue", "hours", "days", "sprint", "per week", "monthly"];
  const vagueCount = vagueTerms.filter(t => content.includes(t)).length;
  const specificCount = specificTerms.filter(t => content.includes(t)).length;
  specificity = Math.min(10, Math.max(0, 5 + specificCount * 1.2 - vagueCount * 0.8));

  // Consistency bonus if we have matching data
  if (autoData.feedback) consistency += 1;
  if (autoData.prioritization) consistency += 1;
  consistency = Math.min(10, consistency);

  const composite = (dataPoints * 0.40) + (specificity * 0.30) + (consistency * 0.30);
  return { composite: Math.round(composite * 10) / 10, dataPoints: Math.round(dataPoints * 10) / 10, specificity: Math.round(specificity * 10) / 10, consistency };
}

// ============================================================
// ALGORITHM 6: Cross-reference Validator
// ============================================================
function validatePRD(sections, fields, autoData) {
  const checks = [];
  const allContent = sections.map(s => s.content).join(" ").toLowerCase();

  // Timeline vs Roadmap
  if (autoData.roadmap?.quarter) {
    checks.push({ label: "Timeline matches roadmap", pass: allContent.includes("q2") || allContent.includes("q3") || allContent.includes("quarter"), type: "timeline" });
  }

  // Priority consistency
  checks.push({ label: `Priority set to ${fields.priority}`, pass: true, type: "priority" });

  // User stories cover feedback
  if (autoData.feedback?.topQuotes) {
    const covered = autoData.feedback.topQuotes.some(q => {
      const words = q.toLowerCase().split(" ").filter(w => w.length > 4);
      return words.some(w => allContent.includes(w));
    });
    checks.push({ label: "User stories reference feedback data", pass: covered, type: "feedback" });
  }

  // Has metrics
  const hasMetrics = (allContent.match(/\d+%/g) || []).length >= 2;
  checks.push({ label: "Goals include measurable metrics", pass: hasMetrics, type: "metrics" });

  // Has acceptance criteria
  const hasAC = allContent.includes("acceptance") || allContent.includes("criteria") || allContent.includes("fr-");
  checks.push({ label: "Functional requirements have acceptance criteria", pass: hasAC, type: "requirements" });

  // Risk section exists and is substantive
  const riskSection = sections.find(s => s.title.toLowerCase().includes("risk"));
  checks.push({ label: "Risk assessment is substantive", pass: riskSection && riskSection.content.length > 200, type: "risk" });

  return checks;
}

// ============================================================
// SCORE BAR
// ============================================================
const ScoreBar = ({ label, value, max = 10, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
    <span style={{ fontSize: 11, color: C.textS, width: 72, flexShrink: 0 }}>{label}</span>
    <div style={{ flex: 1, height: 4, background: C.bgEl, borderRadius: 2, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${(value / max) * 100}%`, background: color, borderRadius: 2, transition: "width 0.5s ease" }} />
    </div>
    <span style={{ fontSize: 10, fontFamily: "'SF Mono','Roboto Mono',monospace", color, width: 22, textAlign: "right" }}>{value}</span>
  </div>
);

// ============================================================
// SECTION EDITOR
// ============================================================
const SectionEditor = ({ section, index, confidence, onUpdate, onRegenerate, isRegenerating }) => {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const confColor = confidence.composite >= 7 ? C.green : confidence.composite >= 4 ? C.amber : C.red;

  const startEdit = () => {
    setEditContent(section.content.replace(/<\/p>/g, "\n\n").replace(/<\/li>/g, "\n").replace(/<br\s*\/?>/g, "\n").replace(/<[^>]+>/g, "").replace(/\n{3,}/g, "\n\n").trim());
    setEditing(true);
  };
  const saveEdit = () => { onUpdate(index, editContent.split("\n\n").map(p => `<p>${p.replace(/\n/g, "<br/>")}</p>`).join("")); setEditing(false); };

  return (
    <div style={{ border: `1px solid ${C.borderS}`, borderRadius: 10, overflow: "hidden", marginBottom: 12, background: C.bgCard, transition: "border-color 0.2s", animation: `slideUp 0.3s ease ${index * 0.06}s both` }}
      onMouseEnter={e => e.currentTarget.style.borderColor = C.border}
      onMouseLeave={e => e.currentTarget.style.borderColor = C.borderS}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px", background: C.bgEl, borderBottom: `1px solid ${C.borderS}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, fontFamily: "'SF Mono','Roboto Mono',monospace", color: C.accent, background: C.accentS, padding: "1px 6px", borderRadius: 4, fontWeight: 600 }}>{section.num}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{section.title}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 10, fontFamily: "'SF Mono','Roboto Mono',monospace", color: confColor, background: confColor + "12", padding: "1px 7px", borderRadius: 4, fontWeight: 600 }}>{confidence.composite}/10</span>
          {!editing ? (
            <>
              <button onClick={startEdit} title="Edit" style={btnS}><I.Edit /></button>
              <button onClick={() => onRegenerate(index)} title="Regenerate" style={{ ...btnS, animation: isRegenerating ? "spin 1s linear infinite" : "none" }}><I.Regen /></button>
            </>
          ) : (
            <>
              <button onClick={saveEdit} style={{ ...btnS, color: C.green }}><I.Check /></button>
              <button onClick={() => setEditing(false)} style={{ ...btnS, color: C.red }}><I.Close /></button>
            </>
          )}
        </div>
      </div>
      <div style={{ padding: "12px 16px" }}>
        {editing ? (
          <textarea value={editContent} onChange={e => setEditContent(e.target.value)} style={{ width: "100%", minHeight: 140, background: C.bgEl, border: `1px solid ${C.accent}33`, borderRadius: 8, padding: 12, color: C.text, fontFamily: "'Inter',system-ui,sans-serif", fontSize: 13, lineHeight: 1.7, resize: "vertical", outline: "none" }} />
        ) : (
          <div style={{ fontSize: 13, color: C.textS, lineHeight: 1.75 }} dangerouslySetInnerHTML={{ __html: section.content }} />
        )}
      </div>
    </div>
  );
};

const btnS = { width: 26, height: 26, borderRadius: 6, border: "none", background: "transparent", color: C.muted, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s" };

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function PRDGeneratorV2() {
  const [fields, setFields] = useState({ featureName: "", problem: "", targetUsers: "All Users", priority: "Medium", context: "", featureType: "New Feature" });
  const [selectedTemplate, setSelectedTemplate] = useState("new_feature");
  const [sections, setSections] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [error, setError] = useState(null);
  const [regenIdx, setRegenIdx] = useState(-1);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showTemplates, setShowTemplates] = useState(true);

  // Auto-computed data
  const autoData = lookupPrismData(fields.featureName);
  const readiness = calculateReadiness(fields, autoData);
  const impact = estimateImpact(autoData);
  const sectionConfidences = sections.map(s => scoreSectionConfidence(s, autoData));
  const validationChecks = sections.length > 0 ? validatePRD(sections, fields, autoData) : [];

  // Smart template detection
  useEffect(() => {
    if (fields.featureName.length > 3) {
      const detected = selectTemplate(fields.featureName, fields.problem);
      setSelectedTemplate(detected);
    }
  }, [fields.featureName, fields.problem]);

  const upd = (k, v) => setFields(f => ({ ...f, [k]: v }));

  // --- Claude API ---
  const callClaude = async (sys, user) => {
    const r = await fetch("/api/claude", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 8000, system: sys, messages: [{ role: "user", content: user }] }) });
    if (!r.ok) throw new Error(`API ${r.status}`);
    const d = await r.json();
    return d.content?.map(b => b.text || "").join("") || "";
  };

  const parseSections = (text) => {
    const secs = [];
    const re = /===SECTION===\s*NUM:\s*(\d+)\s*TITLE:\s*(.*?)\s*CONTENT:\s*([\s\S]*?)===END_SECTION===/g;
    let m;
    while ((m = re.exec(text)) !== null) secs.push({ num: m[1].trim().padStart(2, "0"), title: m[2].trim(), content: m[3].trim() });
    if (secs.length === 0 && text.length > 100) return [{ num: "01", title: "Generated PRD", content: text.replace(/\n/g, "<br/>") }];
    return secs;
  };

  // --- Build enriched prompt with auto data ---
  const buildSystemPrompt = () => {
    let dataContext = "";
    if (autoData.feedback) {
      dataContext += `\n\nAVAILABLE DATA FROM PRISM PLATFORM:
FEEDBACK DATA: ${autoData.feedback.mentions} user mentions, sentiment: ${autoData.feedback.sentiment}, trend: ${autoData.feedback.trend}
Top user quotes: ${autoData.feedback.topQuotes.map(q => `"${q}"`).join(", ")}`;
    }
    if (autoData.prioritization) {
      dataContext += `\nPRIORITIZATION: RICE score ${autoData.prioritization.rice}/100 (Reach: ${autoData.prioritization.reach}, Impact: ${autoData.prioritization.impact}, Confidence: ${autoData.prioritization.confidence}, Effort: ${autoData.prioritization.effort})`;
    }
    if (autoData.competitors) {
      dataContext += `\nCOMPETITOR DATA: ${autoData.competitors.have.length > 0 ? autoData.competitors.have.join(", ") + " already have this feature" : "No competitors have this yet"}. Threat score: ${autoData.competitors.threat}/10`;
    }
    if (autoData.roadmap) {
      dataContext += `\nROADMAP: Planned for ${autoData.roadmap.quarter}. Dependencies: ${autoData.roadmap.dependencies.join(", ")}`;
    }
    dataContext += `\nSPRINT CAPACITY: ${autoData.sprint.availableSP}SP available of ${autoData.sprint.totalSP}SP total. Avg velocity: ${autoData.sprint.avgVelocity}SP. Team: ${autoData.sprint.teamSize} engineers.`;

    return `You are an expert Product Manager. Generate a comprehensive, enterprise-grade PRD.
${dataContext}

IMPORTANT: Use the data above to make the PRD data-driven. Reference specific numbers, user quotes, and metrics from the platform data.

OUTPUT FORMAT — use this EXACT delimiter format:

===SECTION===
NUM: 01
TITLE: Executive Summary
CONTENT:
<p>Your detailed HTML content here...</p>
===END_SECTION===

Use HTML: <p>, <strong>, <ul>, <li>, <table>, <tr>, <th>, <td>
Generate these 10 sections:
01. Executive Summary 02. Problem Statement 03. Goals & Success Metrics 04. User Stories & Personas 05. Functional Requirements 06. Technical Architecture 07. Design & UX Requirements 08. Timeline & Milestones 09. Risks & Mitigations 10. Open Questions & Next Steps`;
  };

  // --- Generate ---
  const generatePRD = async () => {
    if (!fields.featureName.trim() || !fields.problem.trim()) { setError("Feature name and problem statement required."); return; }
    setError(null); setGenerating(true); setSections([]); setGenProgress(0);
    const pi = setInterval(() => setGenProgress(p => Math.min(p + Math.random() * 10, 90)), 500);
    try {
      const raw = await callClaude(buildSystemPrompt(), `Generate PRD for:\nFeature: ${fields.featureName}\nProblem: ${fields.problem}\nTarget: ${fields.targetUsers}\nPriority: ${fields.priority}\nType: ${fields.featureType}\nContext: ${fields.context || "None"}\n\nUse the ===SECTION=== delimiter format.`);
      clearInterval(pi); setGenProgress(100);
      const parsed = parseSections(raw);
      for (let i = 0; i < parsed.length; i++) { await new Promise(r => setTimeout(r, 100)); setSections(prev => [...prev, parsed[i]]); }
      setHistory(h => [{ id: Date.now(), featureName: fields.featureName, template: templates.find(t => t.id === selectedTemplate)?.name, priority: fields.priority, date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }), fields: { ...fields }, sections: parsed, readiness: readiness.composite }, ...h]);
    } catch (err) { clearInterval(pi); setError(`Generation failed: ${err.message}`); }
    finally { setGenerating(false); setGenProgress(0); }
  };

  const regenerateSection = async (idx) => {
    setRegenIdx(idx); const s = sections[idx];
    try {
      const raw = await callClaude("You are an expert PM. Return only the requested section.", `Regenerate section "${s.num}. ${s.title}" for "${fields.featureName}". Problem: ${fields.problem}. Use ===SECTION=== format.`);
      const parsed = parseSections(raw);
      if (parsed.length > 0) setSections(prev => prev.map((sec, i) => i === idx ? parsed[0] : sec));
    } catch (err) { setError(`Regeneration failed: ${err.message}`); }
    finally { setRegenIdx(-1); }
  };

  const updateSection = (idx, content) => setSections(s => s.map((sec, i) => i === idx ? { ...sec, content } : sec));

  // Export
  const exportMarkdown = () => {
    let md = `# PRD: ${fields.featureName}\n\n**Priority:** ${fields.priority} | **Target:** ${fields.targetUsers} | **Type:** ${fields.featureType}\n\n---\n\n`;
    sections.forEach(s => { md += `## ${s.num}. ${s.title}\n\n${s.content.replace(/<\/p>/g, "\n\n").replace(/<li>/g, "- ").replace(/<strong>/g, "**").replace(/<\/strong>/g, "**").replace(/<[^>]+>/g, "").trim()}\n\n`; });
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([md], { type: "text/markdown" })); a.download = `PRD-${fields.featureName.replace(/\s+/g, "-")}.md`; a.click();
  };

  const copyAll = () => {
    let t = `PRD: ${fields.featureName}\n\n`;
    sections.forEach(s => { t += `${s.num}. ${s.title}\n${s.content.replace(/<[^>]+>/g, "").trim()}\n\n`; });
    navigator.clipboard.writeText(t); setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const readyColor = readiness.composite >= 7 ? C.green : readiness.composite >= 4 ? C.amber : C.red;
  const fieldStyle = { width: "100%", background: C.bgEl, border: `1px solid ${C.borderS}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontFamily: "'Inter',system-ui,sans-serif", fontSize: 13, outline: "none", transition: "border-color 0.15s" };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes slideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes scaleIn{from{opacity:0;transform:scale(0.97)}to{opacity:1;transform:scale(1)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Inter',system-ui,sans-serif;background:${C.bg};color:${C.text}}
    ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}
    table{width:100%;border-collapse:collapse;margin:10px 0;font-size:13px}
    th,td{border:1px solid ${C.borderS};padding:8px 10px;text-align:left}th{background:${C.bgEl};color:${C.textS};font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:0.5px}
    ul,ol{padding-left:18px;margin:8px 0}li{padding:3px 0;color:${C.textS};font-size:13px;line-height:1.6}strong{color:${C.text};font-weight:600}p{margin:6px 0}
  `;

  return (
    <>
      <style>{css}</style>
      <div style={{ display: "flex", height: "100%", fontFamily: "'Inter',system-ui,sans-serif", background: C.bg, color: C.text, overflow: "hidden" }}>

        {/* === LEFT PANEL === */}
        <div style={{ width: 400, borderRight: `1px solid ${C.borderS}`, display: "flex", flexDirection: "column", flexShrink: 0, background: C.bgCard }}>
          {/* Header */}
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.borderS}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, background: C.accent, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}><I.Doc /></div>
              <span style={{ fontSize: 15, fontWeight: 600 }}>PRD Generator</span>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <button onClick={() => setShowHistory(!showHistory)} style={{ ...btnS, border: `1px solid ${C.borderS}`, borderRadius: 7, width: 30, height: 30, background: showHistory ? C.accentS : C.bgEl, color: showHistory ? C.accent : C.muted }}><I.History /></button>
              <button onClick={() => { setShowTemplates(true); setSections([]); setFields({ featureName: "", problem: "", targetUsers: "All Users", priority: "Medium", context: "", featureType: "New Feature" }); }} style={{ ...btnS, border: `1px solid ${C.borderS}`, borderRadius: 7, width: 30, height: 30, background: C.bgEl }}><I.Plus /></button>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "14px 20px" }}>
            {showTemplates ? (
              <div style={{ animation: "fadeIn 0.2s" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.textS, marginBottom: 8 }}>Choose Template</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {templates.map((t, i) => (
                    <div key={t.id} onClick={() => { setSelectedTemplate(t.id); setFields(f => ({ ...f, ...t.fields })); setShowTemplates(false); }} style={{
                      background: selectedTemplate === t.id ? C.accentS : C.bgEl, border: `1px solid ${selectedTemplate === t.id ? C.accent + "33" : C.borderS}`,
                      borderRadius: 8, padding: 12, cursor: "pointer", transition: "all 0.15s", animation: `slideUp 0.2s ease ${i * 0.03}s both`,
                    }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = C.accent + "33"}
                      onMouseLeave={e => { if (selectedTemplate !== t.id) e.currentTarget.style.borderColor = C.borderS; }}
                    >
                      <div style={{ color: C.accent, marginBottom: 4 }}>{t.icon}</div>
                      <div style={{ fontSize: 12.5, fontWeight: 500 }}>{t.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ animation: "fadeIn 0.2s" }}>
                <button onClick={() => setShowTemplates(true)} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 11.5, fontFamily: "'Inter',system-ui,sans-serif", marginBottom: 12 }}><I.Back /> Change template</button>

                {/* Readiness Score */}
                <div style={{ background: C.bgEl, borderRadius: 9, padding: 12, marginBottom: 14, border: `1px solid ${readyColor}18` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}><I.Gauge /> Readiness Score</span>
                    <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "'SF Mono','Roboto Mono',monospace", color: readyColor }}>{readiness.composite}/10</span>
                  </div>
                  <ScoreBar label="Input" value={readiness.breakdown.input} color={C.accent} />
                  <ScoreBar label="Data" value={readiness.breakdown.data} color={C.green} />
                  <ScoreBar label="Stakeholder" value={readiness.breakdown.stakeholder} color={C.amber} />
                  <ScoreBar label="Scope" value={readiness.breakdown.scope} color={C.cyan} />
                  {readiness.warnings.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      {readiness.warnings.map((w, i) => (
                        <div key={i} style={{ fontSize: 11, color: C.amber, display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}><I.Alert /> {w}</div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Auto Data */}
                {(autoData.feedback || autoData.prioritization || autoData.competitors) && (
                  <div style={{ background: C.bgEl, borderRadius: 9, padding: 12, marginBottom: 14, border: `1px solid ${C.green}18` }}>
                    <div style={{ fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, marginBottom: 8, color: C.green }}><I.Data /> Auto-populated Data</div>
                    {autoData.feedback && <div style={{ fontSize: 11.5, color: C.textS, marginBottom: 3 }}><strong>{autoData.feedback.mentions}</strong> feedback mentions · sentiment {autoData.feedback.sentiment > 0 ? "positive" : "negative"} · trend {autoData.feedback.trend}</div>}
                    {autoData.prioritization && <div style={{ fontSize: 11.5, color: C.textS, marginBottom: 3 }}>RICE score: <strong>{autoData.prioritization.rice}</strong>/100</div>}
                    {autoData.competitors && <div style={{ fontSize: 11.5, color: C.textS, marginBottom: 3 }}>{autoData.competitors.have.length > 0 ? `${autoData.competitors.have.join(", ")} have this` : "No competitors have this"} · threat {autoData.competitors.threat}/10</div>}
                    {autoData.roadmap && <div style={{ fontSize: 11.5, color: C.textS }}>Roadmap: {autoData.roadmap.quarter} · deps: {autoData.roadmap.dependencies.join(", ")}</div>}
                  </div>
                )}

                {/* Impact Estimation */}
                {impact && (
                  <div style={{ background: C.bgEl, borderRadius: 9, padding: 12, marginBottom: 14, border: `1px solid ${C.accent}18` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}><I.TrendUp /> Impact Estimate</span>
                      <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "'SF Mono','Roboto Mono',monospace", color: C.accent }}>{impact.composite}/10</span>
                    </div>
                    <ScoreBar label="User Reach" value={impact.breakdown.userReach} color={C.accent} />
                    <ScoreBar label="Frequency" value={impact.breakdown.frequency} color={C.green} />
                    <ScoreBar label="Revenue" value={impact.breakdown.revenueCorr} color={C.amber} />
                    <ScoreBar label="Churn Prev" value={impact.breakdown.churnPrev} color={C.red} />
                  </div>
                )}

                {/* Form */}
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: C.textS, marginBottom: 4 }}>Feature Name *</label>
                  <input value={fields.featureName} onChange={e => upd("featureName", e.target.value)} placeholder="e.g. Real-time Collaboration" style={fieldStyle} onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = C.borderS} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: C.textS, marginBottom: 4 }}>Problem Statement *</label>
                  <textarea value={fields.problem} onChange={e => upd("problem", e.target.value)} rows={3} placeholder="What problem does this solve?" style={{ ...fieldStyle, resize: "vertical", lineHeight: 1.6 }} onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = C.borderS} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: C.textS, marginBottom: 4 }}>Target Users</label>
                    <select value={fields.targetUsers} onChange={e => upd("targetUsers", e.target.value)} style={{ ...fieldStyle, cursor: "pointer" }}>
                      {["All Users", "Enterprise Teams", "SMB", "Individual Users", "Mobile Users", "API Developers"].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: C.textS, marginBottom: 4 }}>Priority</label>
                    <select value={fields.priority} onChange={e => upd("priority", e.target.value)} style={{ ...fieldStyle, cursor: "pointer" }}>
                      {["Critical", "High", "Medium", "Low"].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: C.textS, marginBottom: 4 }}>Additional Context</label>
                  <textarea value={fields.context} onChange={e => upd("context", e.target.value)} rows={2} placeholder="Constraints, business goals..." style={{ ...fieldStyle, resize: "vertical", lineHeight: 1.6 }} onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = C.borderS} />
                </div>

                {error && <div style={{ padding: "8px 12px", background: C.redS, border: `1px solid ${C.red}22`, borderRadius: 8, fontSize: 12, color: C.red, marginBottom: 12 }}>{error}</div>}

                <button onClick={generatePRD} disabled={!fields.featureName.trim() || !fields.problem.trim() || generating} style={{
                  width: "100%", padding: "10px", borderRadius: 8, border: "none", fontSize: 13.5, fontWeight: 500, cursor: "pointer",
                  fontFamily: "'Inter',system-ui,sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  background: fields.featureName.trim() && fields.problem.trim() ? C.accent : C.bgEl,
                  color: fields.featureName.trim() && fields.problem.trim() ? "white" : C.muted,
                  boxShadow: fields.featureName.trim() && fields.problem.trim() ? "0 2px 8px rgba(24,119,242,0.25)" : "none",
                  opacity: generating ? 0.7 : 1, transition: "all 0.15s",
                }}>
                  {generating ? <><span style={{ display: "flex", animation: "spin 1s linear infinite" }}><I.Regen /></span> Generating...</> : <><I.Sparkle /> Generate PRD</>}
                </button>

                {generating && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 11, color: C.muted }}>Generating with platform data...</span>
                      <span style={{ fontSize: 10, fontFamily: "'SF Mono','Roboto Mono',monospace", color: C.accent }}>{Math.round(genProgress)}%</span>
                    </div>
                    <div style={{ height: 3, background: C.bgEl, borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", background: C.accent, borderRadius: 2, transition: "width 0.3s", width: `${genProgress}%` }} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* === RIGHT PANEL === */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Output header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", borderBottom: `1px solid ${C.borderS}`, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {generating && <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, animation: "pulse 1s infinite" }} />}
              <span style={{ fontSize: 14, fontWeight: 500 }}>{sections.length > 0 ? fields.featureName : generating ? "Generating..." : "Document Preview"}</span>
              {sections.length > 0 && <span style={{ fontSize: 11, color: C.muted, fontFamily: "'SF Mono','Roboto Mono',monospace" }}>{sections.length} sections</span>}
            </div>
            {sections.length > 0 && (
              <div style={{ display: "flex", gap: 4 }}>
                <button onClick={copyAll} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 6, border: `1px solid ${C.borderS}`, background: C.bgCard, color: copied ? C.green : C.textS, fontSize: 11.5, fontFamily: "'Inter',system-ui,sans-serif", cursor: "pointer" }}>
                  {copied ? <><I.Check /> Copied</> : <><I.Copy /> Copy</>}
                </button>
                <button onClick={exportMarkdown} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 6, border: `1px solid ${C.borderS}`, background: C.bgCard, color: C.textS, fontSize: 11.5, fontFamily: "'Inter',system-ui,sans-serif", cursor: "pointer" }}>
                  <I.Download /> .md
                </button>
              </div>
            )}
          </div>

          {/* Output body */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
            {sections.length === 0 && !generating ? (
              <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: C.muted, textAlign: "center", gap: 12 }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: C.bgEl, display: "flex", alignItems: "center", justifyContent: "center" }}><I.Doc /></div>
                <div style={{ fontSize: 15, fontWeight: 500, color: C.textS }}>No PRD generated yet</div>
                <div style={{ fontSize: 13, maxWidth: 340, lineHeight: 1.6 }}>Fill in feature details. The system will auto-populate data from Feedback, Prioritization, and Competitor modules.</div>
              </div>
            ) : (
              <>
                {/* PRD Header */}
                {sections.length > 0 && (
                  <div style={{ marginBottom: 20, paddingBottom: 14, borderBottom: `1px solid ${C.borderS}`, animation: "fadeIn 0.3s" }}>
                    <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.3, marginBottom: 6 }}>{fields.featureName}</h1>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {[
                        { label: "Priority", value: fields.priority, color: fields.priority === "Critical" ? C.red : fields.priority === "High" ? C.amber : C.accent },
                        { label: "Target", value: fields.targetUsers, color: C.accent },
                        { label: "Readiness", value: `${readiness.composite}/10`, color: readyColor },
                        ...(impact ? [{ label: "Impact", value: `${impact.composite}/10`, color: C.green }] : []),
                      ].map((t, i) => (
                        <span key={i} style={{ fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 5, color: t.color, background: t.color + "12" }}>{t.label}: {t.value}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sections */}
                {sections.map((s, i) => (
                  <SectionEditor key={`${s.num}-${i}`} section={s} index={i} confidence={sectionConfidences[i] || { composite: 0 }} onUpdate={updateSection} onRegenerate={regenerateSection} isRegenerating={regenIdx === i} />
                ))}

                {/* Validation */}
                {validationChecks.length > 0 && (
                  <div style={{ background: C.bgCard, border: `1px solid ${C.borderS}`, borderRadius: 10, padding: 14, marginBottom: 16, animation: "slideUp 0.3s ease 0.5s both" }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}><I.Shield /> Cross-reference Validation</div>
                    {validationChecks.map((ch, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 0", fontSize: 12, color: ch.pass ? C.green : C.amber }}>
                        {ch.pass ? <I.Check /> : <I.Alert />}
                        <span style={{ color: C.textS }}>{ch.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {generating && sections.length < 10 && (
                  <div style={{ padding: 14 }}>
                    {[...Array(3)].map((_, i) => (
                      <div key={i} style={{ height: 12, borderRadius: 6, marginBottom: 8, width: `${80 - i * 15}%`, background: `linear-gradient(90deg, ${C.bgEl} 25%, ${C.bgHov} 50%, ${C.bgEl} 75%)`, backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* History sidebar */}
      {showHistory && (
        <div style={{ position: "fixed", inset: 0, zIndex: 999 }} onClick={() => setShowHistory(false)}>
          <div onClick={e => e.stopPropagation()} style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 340, background: C.bgCard, borderLeft: `1px solid ${C.border}`, boxShadow: "-8px 0 30px rgba(0,0,0,0.08)", animation: "fadeIn 0.2s", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderBottom: `1px solid ${C.borderS}` }}>
              <span style={{ fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}><I.History /> History</span>
              <button onClick={() => setShowHistory(false)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer" }}><I.Close /></button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
              {history.length === 0 ? (
                <div style={{ textAlign: "center", color: C.muted, fontSize: 13, padding: 32 }}>No PRDs generated yet.</div>
              ) : history.map((item, i) => (
                <div key={item.id} onClick={() => { setFields(item.fields); setSections(item.sections); setShowHistory(false); setShowTemplates(false); }} style={{ background: C.bgEl, border: `1px solid ${C.borderS}`, borderRadius: 8, padding: 12, marginBottom: 8, cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = C.accent + "33"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = C.borderS}
                >
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3 }}>{item.featureName}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{item.template} · {item.priority} · Readiness {item.readiness}/10</div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{item.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

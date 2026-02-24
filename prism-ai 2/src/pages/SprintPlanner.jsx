import { useState, useEffect, useCallback } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";

// ============================================================
// PRISM AI — Sprint Planner v2
// Composition Optimizer · Capacity Balancer · Velocity Forecast
// Risk Detector · AI Narrative · Meta Light Theme
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
  Zap: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Plus: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Minus: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Check: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  Alert: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Search: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Brain: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a7 7 0 0 1 7 7c0 2.4-1.2 4.5-3 5.7V17H8v-2.3C6.2 13.5 5 11.4 5 9a7 7 0 0 1 7-7z"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="9" y1="17" x2="9" y2="21"/><line x1="15" y1="17" x2="15" y2="21"/></svg>,
  Regen: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  History: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  TrendUp: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Shield: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Users: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
  Target: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  ArrowR: () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  ArrowL: () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Close: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};

// ============================================================
// DATA
// ============================================================
const team = [
  { name: "Zakhar K.", capacity: 8, avatar: "ZK" },
  { name: "Cole H.", capacity: 13, avatar: "CH" },
  { name: "Sarah M.", capacity: 13, avatar: "SM" },
  { name: "Alex D.", capacity: 10, avatar: "AD" },
  { name: "Nina P.", capacity: 8, avatar: "NP" },
];
const totalCapacity = team.reduce((s, t) => s + t.capacity, 0);

const priorityWeight = { critical: 10, high: 7, medium: 4, low: 1 };
const typeColor = { feature: C.accent, bug: C.red, improvement: C.green, tech_debt: C.amber, design: C.purple };
const typeLabel = { feature: "Feature", bug: "Bug", improvement: "Improvement", tech_debt: "Tech Debt", design: "Design" };
const priorityColor = { critical: C.red, high: C.amber, medium: C.cyan, low: C.muted };

const initialBacklog = [
  { id: 1, name: "WebSocket Infrastructure", points: 8, priority: "critical", type: "tech_debt", assignee: "Cole H.", feedbackMentions: 12, blocked: false, age: 14, dependencies: [] },
  { id: 2, name: "Real-time Cursors", points: 5, priority: "high", type: "feature", assignee: "Cole H.", feedbackMentions: 67, blocked: true, blockedBy: "WebSocket Infrastructure", age: 10, dependencies: [1] },
  { id: 3, name: "Mobile Perf Optimization", points: 5, priority: "high", type: "improvement", assignee: "Alex D.", feedbackMentions: 43, blocked: false, age: 21, dependencies: [] },
  { id: 4, name: "Bulk CSV Export Fix", points: 2, priority: "medium", type: "bug", assignee: "Sarah M.", feedbackMentions: 31, blocked: false, age: 7, dependencies: [] },
  { id: 5, name: "Onboarding V2 Polish", points: 3, priority: "high", type: "design", assignee: "Nina P.", feedbackMentions: 22, blocked: false, age: 5, dependencies: [] },
  { id: 6, name: "SSO SAML Integration", points: 8, priority: "high", type: "feature", assignee: "Alex D.", feedbackMentions: 15, blocked: false, age: 28, dependencies: [] },
  { id: 7, name: "API Rate Limiter", points: 3, priority: "medium", type: "tech_debt", assignee: "Cole H.", feedbackMentions: 8, blocked: false, age: 35, dependencies: [] },
  { id: 8, name: "Dashboard Widget Drag", points: 5, priority: "medium", type: "feature", assignee: "Sarah M.", feedbackMentions: 18, blocked: false, age: 12, dependencies: [] },
  { id: 9, name: "Dark Mode Toggle Fix", points: 1, priority: "low", type: "bug", assignee: "Nina P.", feedbackMentions: 5, blocked: false, age: 42, dependencies: [] },
  { id: 10, name: "Notification Preferences", points: 3, priority: "medium", type: "feature", assignee: "Sarah M.", feedbackMentions: 28, blocked: false, age: 18, dependencies: [] },
  { id: 11, name: "Slack Integration MVP", points: 5, priority: "high", type: "feature", assignee: "Zakhar K.", feedbackMentions: 28, blocked: false, age: 9, dependencies: [] },
  { id: 12, name: "Audit Log System", points: 5, priority: "medium", type: "tech_debt", assignee: "Cole H.", feedbackMentions: 10, blocked: false, age: 30, dependencies: [] },
  { id: 13, name: "Search Performance", points: 3, priority: "high", type: "improvement", assignee: "Alex D.", feedbackMentions: 35, blocked: false, age: 16, dependencies: [] },
  { id: 14, name: "Email Digest Template", points: 2, priority: "low", type: "design", assignee: "Nina P.", feedbackMentions: 7, blocked: false, age: 25, dependencies: [] },
  { id: 15, name: "Webhook Retry Logic", points: 3, priority: "medium", type: "tech_debt", assignee: "Zakhar K.", feedbackMentions: 6, blocked: false, age: 19, dependencies: [] },
];

const sprintHistory = [
  { id: "S-21", planned: 28, completed: 25, velocity: 25, bugs: 3, features: 4, days: 14, burndown: [28,26,24,22,20,19,17,15,13,12,10,8,5,0] },
  { id: "S-22", planned: 32, completed: 27, velocity: 27, bugs: 2, features: 5, days: 14, burndown: [32,30,29,27,25,23,22,20,18,16,14,11,7,0] },
  { id: "S-23", planned: 30, completed: 29, velocity: 29, bugs: 1, features: 6, days: 14, burndown: [30,28,27,25,23,21,19,17,15,13,10,7,3,0] },
  { id: "S-24", planned: 26, completed: 24, velocity: 24, bugs: 4, features: 3, days: 14, burndown: [26,25,24,22,20,19,18,16,14,12,10,7,4,0] },
];

// ============================================================
// ALGORITHM 1: Velocity Forecaster (exponential smoothing)
// ============================================================
const VelocityEngine = {
  history: sprintHistory.map(s => s.velocity),
  forecast(alpha = 0.3) {
    const h = this.history;
    let level = h[0], trend = h[1] - h[0];
    for (let i = 1; i < h.length; i++) {
      const nl = alpha * h[i] + (1 - alpha) * (level + trend);
      trend = alpha * (nl - level) + (1 - alpha) * trend;
      level = nl;
    }
    return Math.round(level + trend);
  },
  average() { return Math.round(this.history.reduce((s, v) => s + v, 0) / this.history.length); },
  trend() {
    const h = this.history;
    const n = h.length; const xm = (n - 1) / 2; const ym = h.reduce((s, v) => s + v, 0) / n;
    let num = 0, den = 0;
    for (let i = 0; i < n; i++) { num += (i - xm) * (h[i] - ym); den += (i - xm) ** 2; }
    return den === 0 ? 0 : num / den;
  },
  completionRate() { return Math.round((sprintHistory.reduce((s, sp) => s + sp.completed, 0) / sprintHistory.reduce((s, sp) => s + sp.planned, 0)) * 100); },
};

// ============================================================
// ALGORITHM 2: Sprint Composition Optimizer
// TaskScore = (Priority × 0.30) + (FeedbackWeight × 0.25) + (DependencyFree × 0.20) + (CapacityFit × 0.15) + (AgeFactor × 0.10)
// ============================================================
const Optimizer = {
  scoreTask(task, memberLoad) {
    // Priority (0-10)
    const priority = priorityWeight[task.priority] || 4;

    // Feedback weight (0-10)
    const feedback = Math.min(10, task.feedbackMentions / 7);

    // Dependency free (0 or 10)
    const depFree = task.blocked ? 0 : 10;

    // Capacity fit — does assignee have room?
    const member = team.find(m => m.name === task.assignee);
    const currentLoad = memberLoad[task.assignee] || 0;
    const remaining = member ? member.capacity - currentLoad : 0;
    const capFit = task.points <= remaining ? 10 : remaining > 0 ? 5 : 0;

    // Age factor (older = higher priority, 0-10)
    const age = Math.min(10, task.age / 4);

    const composite = (priority * 0.30) + (feedback * 0.25) + (depFree * 0.20) + (capFit * 0.15) + (age * 0.10);

    return {
      composite: Math.round(composite * 100) / 100,
      breakdown: {
        priority: Math.round(priority * 10) / 10,
        feedback: Math.round(feedback * 10) / 10,
        depFree,
        capFit,
        age: Math.round(age * 10) / 10,
      },
    };
  },

  autoSelect(backlog, targetVelocity) {
    const memberLoad = {};
    team.forEach(m => { memberLoad[m.name] = 0; });

    // Score all tasks
    const scored = backlog.map(t => ({ ...t, score: this.scoreTask(t, memberLoad) }))
      .filter(t => !t.blocked)
      .sort((a, b) => b.score.composite - a.score.composite);

    const selected = [];
    let totalPoints = 0;

    for (const task of scored) {
      if (totalPoints + task.points > targetVelocity) continue;
      const member = team.find(m => m.name === task.assignee);
      const load = memberLoad[task.assignee] || 0;
      if (member && load + task.points > member.capacity) continue;

      selected.push(task);
      totalPoints += task.points;
      memberLoad[task.assignee] = (memberLoad[task.assignee] || 0) + task.points;
    }

    return { selected, totalPoints, memberLoad };
  },
};

// ============================================================
// ALGORITHM 3: Capacity Balancer
// ============================================================
function analyzeCapacity(sprintItems) {
  const load = {};
  team.forEach(m => { load[m.name] = 0; });
  sprintItems.forEach(t => { load[t.assignee] = (load[t.assignee] || 0) + t.points; });

  return team.map(m => {
    const used = load[m.name] || 0;
    const pct = Math.round((used / m.capacity) * 100);
    const status = pct > 100 ? "overloaded" : pct > 80 ? "heavy" : pct > 50 ? "balanced" : pct > 0 ? "light" : "idle";
    return { ...m, used, pct, status };
  });
}

// ============================================================
// ALGORITHM 4: Sprint Risk Detector
// ============================================================
function detectSprintRisks(sprintItems, backlog) {
  const risks = [];
  const totalSP = sprintItems.reduce((s, t) => s + t.points, 0);
  const forecast = VelocityEngine.forecast();

  // Scope vs velocity
  if (totalSP > forecast * 1.15) risks.push({ severity: "high", label: `Over-scoped: ${totalSP} SP planned vs ${forecast} SP forecasted velocity`, type: "scope" });
  else if (totalSP < forecast * 0.6 && totalSP > 0) risks.push({ severity: "medium", label: `Under-scoped: ${totalSP} SP planned, team can handle ~${forecast} SP`, type: "scope" });

  // Blocked items in sprint
  const blockedInSprint = sprintItems.filter(t => t.blocked);
  if (blockedInSprint.length > 0) risks.push({ severity: "critical", label: `${blockedInSprint.length} blocked task(s) in sprint: ${blockedInSprint.map(t => t.name).join(", ")}`, type: "blocked" });

  // Single person overload
  const cap = analyzeCapacity(sprintItems);
  cap.filter(m => m.status === "overloaded").forEach(m => {
    risks.push({ severity: "high", label: `${m.name} overloaded: ${m.used}/${m.capacity} SP (${m.pct}%)`, type: "capacity" });
  });

  // Idle team members
  const idle = cap.filter(m => m.status === "idle");
  if (idle.length > 0 && totalSP > 0) risks.push({ severity: "low", label: `${idle.length} team member(s) with no tasks: ${idle.map(m => m.name).join(", ")}`, type: "idle" });

  // Too many bugs
  const bugCount = sprintItems.filter(t => t.type === "bug").length;
  const totalCount = sprintItems.length;
  if (totalCount > 0 && bugCount / totalCount > 0.5) risks.push({ severity: "medium", label: `${Math.round(bugCount / totalCount * 100)}% bugs — consider balancing with features`, type: "balance" });

  // High dependency concentration
  const byAssignee = {};
  sprintItems.forEach(t => { byAssignee[t.assignee] = (byAssignee[t.assignee] || 0) + 1; });
  const maxTasks = Math.max(...Object.values(byAssignee), 0);
  if (maxTasks > 4) { const who = Object.entries(byAssignee).find(([, c]) => c === maxTasks)?.[0]; risks.push({ severity: "medium", label: `${who} has ${maxTasks} tasks — context-switching risk`, type: "focus" }); }

  return risks.sort((a, b) => { const o = { critical: 0, high: 1, medium: 2, low: 3 }; return o[a.severity] - o[b.severity]; });
}

// ============================================================
// PROJECTED BURNDOWN
// ============================================================
function projectBurndown(totalSP, days = 14) {
  const ideal = Array.from({ length: days + 1 }, (_, i) => Math.round(totalSP * (1 - i / days) * 10) / 10);
  const completionRate = VelocityEngine.completionRate() / 100;
  const projected = Array.from({ length: days + 1 }, (_, i) => {
    const noise = i > 0 ? (Math.random() - 0.5) * 2 : 0;
    return Math.max(0, Math.round((totalSP * (1 - (i / days) * completionRate) + noise) * 10) / 10);
  });
  return ideal.map((v, i) => ({ day: i, ideal: v, projected: projected[i] }));
}

// ============================================================
// UI
// ============================================================
const ScoreBar = ({ label, value, max = 10, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
    <span style={{ fontSize: 10, color: C.textS, width: 65, flexShrink: 0 }}>{label}</span>
    <div style={{ flex: 1, height: 4, background: C.bgEl, borderRadius: 2, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${(value / max) * 100}%`, background: color, borderRadius: 2, transition: "width 0.5s" }} />
    </div>
    <span style={{ fontSize: 9.5, fontFamily: "monospace", color, width: 20, textAlign: "right" }}>{value}</span>
  </div>
);

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.borderS}`, borderRadius: 7, padding: "6px 10px", boxShadow: "0 4px 12px rgba(0,0,0,0.06)", fontSize: 11 }}>
      <div style={{ color: C.muted, marginBottom: 2 }}>Day {label}</div>
      {payload.map((p, i) => <div key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong> SP</div>)}
    </div>
  );
};

const sevColor = { critical: C.red, high: C.amber, medium: C.cyan, low: C.muted };

const Modal = ({ isOpen, onClose, title, children, width = 580 }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.2)", backdropFilter: "blur(3px)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, width: "92%", maxWidth: width, maxHeight: "85vh", overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,0.1)", animation: "scaleIn 0.2s" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: `1px solid ${C.borderS}` }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", display: "flex" }}><I.Close /></button>
        </div>
        <div style={{ padding: 18, overflowY: "auto", maxHeight: "calc(85vh - 50px)" }}>{children}</div>
      </div>
    </div>
  );
};

// ============================================================
// MAIN
// ============================================================
export default function SprintPlannerV2() {
  const [tab, setTab] = useState("planner");
  const [backlog, setBacklog] = useState(initialBacklog);
  const [sprintItems, setSprintItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filterPri, setFilterPri] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [showTaskDetail, setShowTaskDetail] = useState(null);
  const [aiNarrative, setAiNarrative] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const forecastedVelocity = VelocityEngine.forecast();
  const avgVelocity = VelocityEngine.average();
  const velocityTrend = VelocityEngine.trend();
  const sprintSP = sprintItems.reduce((s, t) => s + t.points, 0);
  const capacityData = analyzeCapacity(sprintItems);
  const sprintRisks = detectSprintRisks(sprintItems, backlog);
  const burndownData = projectBurndown(sprintSP);

  // Filter backlog
  const filteredBacklog = backlog.filter(t => !sprintItems.find(s => s.id === t.id))
    .filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()))
    .filter(t => filterPri === "all" || t.priority === filterPri)
    .filter(t => filterType === "all" || t.type === filterType);

  // Move tasks
  const addToSprint = (task) => { setSprintItems(p => [...p, task]); };
  const removeFromSprint = (taskId) => { setSprintItems(p => p.filter(t => t.id !== taskId)); };

  // Auto-plan
  const autoOptimize = () => {
    setSprintItems([]);
    setTimeout(() => {
      const result = Optimizer.autoSelect(backlog, forecastedVelocity);
      setSprintItems(result.selected);
    }, 100);
  };

  // AI Narrative
  const generateNarrative = async () => {
    setAiLoading(true);
    try {
      const itemStr = sprintItems.map(t => { const sc = Optimizer.scoreTask(t, {}); return `${t.name} (${t.points}SP, ${t.priority}, score:${sc.composite}, feedback:${t.feedbackMentions})`; }).join("\n");
      const capStr = capacityData.map(m => `${m.name}: ${m.used}/${m.capacity} SP (${m.pct}%)`).join("\n");
      const riskStr = sprintRisks.map(r => `[${r.severity}] ${r.label}`).join("\n") || "None";
      const r = await fetch("/api/claude", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 600, system: "You explain PRE-COMPUTED sprint planning results. Be concise: 4-5 sentences. Focus on composition quality, risks, and one recommendation.", messages: [{ role: "user", content: `SPRINT COMPOSITION (${sprintSP}/${forecastedVelocity} SP forecast):\n${itemStr}\n\nCAPACITY:\n${capStr}\n\nRISKS:\n${riskStr}\n\nVelocity trend: ${velocityTrend > 0 ? "improving" : "declining"}, avg: ${avgVelocity}, forecast: ${forecastedVelocity}\n\nExplain the sprint composition and recommend adjustments.` }] }) });
      const d = await r.json();
      setAiNarrative(d.content?.map(b => b.text || "").join("") || "");
    } catch (e) { setAiNarrative(`Failed: ${e.message}`); }
    finally { setAiLoading(false); }
  };

  const pctOfForecast = forecastedVelocity > 0 ? Math.round((sprintSP / forecastedVelocity) * 100) : 0;
  const pctColor = pctOfForecast > 115 ? C.red : pctOfForecast > 90 ? C.green : pctOfForecast > 60 ? C.amber : C.muted;

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes scaleIn{from{opacity:0;transform:scale(0.97)}to{opacity:1;transform:scale(1)}}
    @keyframes slideUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Inter',system-ui,sans-serif;background:${C.bg};color:${C.text}}
    ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}
  `;

  return (
    <>
      <style>{css}</style>
      <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: C.bg, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* HEADER */}
        <header style={{ padding: "12px 24px", borderBottom: `1px solid ${C.borderS}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <I.Zap />
            <h1 style={{ fontSize: 17, fontWeight: 600 }}>Sprint Planner</h1>
            <div style={{ display: "flex", gap: 2, background: C.bgEl, padding: 2, borderRadius: 7, border: `1px solid ${C.borderS}` }}>
              {[{ id: "planner", l: "Planner" }, { id: "history", l: "History" }].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "4px 12px", borderRadius: 5, border: "none", background: tab === t.id ? C.accent : "transparent", color: tab === t.id ? "white" : C.muted, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'Inter',system-ui,sans-serif" }}>{t.l}</button>
              ))}
            </div>
            <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 5, color: pctColor, background: pctColor + "10", fontWeight: 500 }}>
              {sprintSP}/{forecastedVelocity} SP ({pctOfForecast}%)
            </span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => { generateNarrative(); }} disabled={aiLoading || sprintItems.length === 0} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 7, border: "none", background: C.accentS, color: C.accent, fontSize: 12, fontWeight: 500, fontFamily: "'Inter',system-ui,sans-serif", cursor: "pointer", opacity: sprintItems.length === 0 ? 0.5 : 1 }}>
              <span style={{ display: "flex", animation: aiLoading ? "spin 1s linear infinite" : "none" }}>{aiLoading ? <I.Regen /> : <I.Brain />}</span> AI Review
            </button>
            <button onClick={autoOptimize} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 14px", borderRadius: 7, border: "none", background: C.accent, color: "white", fontSize: 12, fontWeight: 500, fontFamily: "'Inter',system-ui,sans-serif", cursor: "pointer", boxShadow: "0 2px 8px rgba(24,119,242,0.25)" }}>
              <I.Target /> Auto-Optimize
            </button>
          </div>
        </header>

        {tab === "planner" ? (
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            {/* LEFT — Backlog */}
            <div style={{ width: "42%", borderRight: `1px solid ${C.borderS}`, display: "flex", flexDirection: "column", background: C.bgCard }}>
              <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C.borderS}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1, background: C.bgEl, border: `1px solid ${C.borderS}`, borderRadius: 6, padding: "5px 8px" }}>
                    <I.Search /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search backlog..." style={{ background: "none", border: "none", outline: "none", color: C.text, fontFamily: "'Inter',system-ui,sans-serif", fontSize: 12, width: "100%" }} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <select value={filterPri} onChange={e => setFilterPri(e.target.value)} style={{ background: C.bgEl, border: `1px solid ${C.borderS}`, borderRadius: 5, padding: "3px 6px", fontSize: 10.5, color: C.textS, fontFamily: "'Inter',system-ui,sans-serif", cursor: "pointer", outline: "none" }}>
                    <option value="all">All Priority</option><option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
                  </select>
                  <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ background: C.bgEl, border: `1px solid ${C.borderS}`, borderRadius: 5, padding: "3px 6px", fontSize: 10.5, color: C.textS, fontFamily: "'Inter',system-ui,sans-serif", cursor: "pointer", outline: "none" }}>
                    <option value="all">All Types</option>{Object.entries(typeLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                  <span style={{ fontSize: 10.5, color: C.muted, display: "flex", alignItems: "center", marginLeft: "auto" }}>{filteredBacklog.length} items</span>
                </div>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: 6 }}>
                {filteredBacklog.map((t, i) => {
                  const sc = Optimizer.scoreTask(t, {});
                  return (
                    <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 10px", margin: "2px 0", borderRadius: 7, border: `1px solid transparent`, cursor: "pointer", transition: "all 0.15s", animation: `fadeIn 0.15s ease ${i * 0.02}s both`, opacity: t.blocked ? 0.5 : 1 }}
                      onMouseEnter={e => { e.currentTarget.style.background = C.bgEl; e.currentTarget.style.borderColor = C.borderS; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}>
                      <div style={{ flex: 1 }} onClick={() => setShowTaskDetail(t)}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                          <span style={{ fontSize: 12.5, fontWeight: 500 }}>{t.name}</span>
                          {t.blocked && <span style={{ fontSize: 8, padding: "1px 4px", borderRadius: 3, background: C.redS, color: C.red, fontWeight: 600 }}>BLOCKED</span>}
                        </div>
                        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                          <span style={{ fontSize: 9.5, padding: "1px 5px", borderRadius: 3, background: priorityColor[t.priority] + "12", color: priorityColor[t.priority], fontWeight: 500 }}>{t.priority}</span>
                          <span style={{ fontSize: 9.5, padding: "1px 5px", borderRadius: 3, background: typeColor[t.type] + "12", color: typeColor[t.type] }}>{typeLabel[t.type]}</span>
                          <span style={{ fontSize: 9.5, color: C.muted }}>{t.assignee}</span>
                          <span style={{ fontSize: 9, fontFamily: "monospace", color: C.accent, marginLeft: "auto" }}>score: {sc.composite}</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ fontSize: 11, fontFamily: "monospace", fontWeight: 600, color: C.accent, background: C.accentS, padding: "1px 6px", borderRadius: 4 }}>{t.points}</span>
                        <button onClick={() => !t.blocked && addToSprint(t)} disabled={t.blocked} style={{ width: 24, height: 24, borderRadius: 5, border: `1px solid ${C.borderS}`, background: C.bgEl, color: C.accent, display: "flex", alignItems: "center", justifyContent: "center", cursor: t.blocked ? "not-allowed" : "pointer" }}><I.ArrowR /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT — Sprint + Analytics */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              {/* Sprint Items */}
              <div style={{ flex: 1, overflowY: "auto", padding: 12, borderBottom: `1px solid ${C.borderS}` }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>Sprint Backlog ({sprintItems.length} items, {sprintSP} SP)</span>
                  {sprintRisks.length > 0 && <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: sevColor[sprintRisks[0].severity] + "12", color: sevColor[sprintRisks[0].severity], fontWeight: 500 }}>{sprintRisks.length} risk(s)</span>}
                </div>
                {sprintItems.length === 0 ? (
                  <div style={{ textAlign: "center", padding: 32, color: C.muted, fontSize: 12 }}>
                    <div style={{ marginBottom: 6 }}>No tasks in sprint yet</div>
                    <div>Add tasks manually or click <strong style={{ color: C.accent }}>Auto-Optimize</strong> to let the scoring engine select.</div>
                  </div>
                ) : (
                  sprintItems.map((t, i) => {
                    const sc = Optimizer.scoreTask(t, {});
                    return (
                      <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 10px", margin: "2px 0", borderRadius: 7, border: `1px solid ${C.borderS}`, background: C.bgEl, transition: "all 0.15s", animation: `slideUp 0.2s ease ${i * 0.03}s both` }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = C.border}
                        onMouseLeave={e => e.currentTarget.style.borderColor = C.borderS}>
                        <button onClick={() => removeFromSprint(t.id)} style={{ width: 22, height: 22, borderRadius: 5, border: `1px solid ${C.borderS}`, background: C.bgCard, color: C.muted, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}><I.ArrowL /></button>
                        <div style={{ flex: 1 }} onClick={() => setShowTaskDetail(t)}>
                          <div style={{ fontSize: 12.5, fontWeight: 500 }}>{t.name}</div>
                          <div style={{ display: "flex", gap: 4, alignItems: "center", marginTop: 1 }}>
                            <span style={{ fontSize: 9.5, padding: "1px 5px", borderRadius: 3, background: priorityColor[t.priority] + "12", color: priorityColor[t.priority], fontWeight: 500 }}>{t.priority}</span>
                            <span style={{ fontSize: 9.5, color: C.muted }}>{t.assignee}</span>
                            <span style={{ fontSize: 9, fontFamily: "monospace", color: C.green, marginLeft: "auto" }}>score: {sc.composite}</span>
                          </div>
                        </div>
                        <span style={{ fontSize: 11, fontFamily: "monospace", fontWeight: 600, color: C.accent, background: C.accentS, padding: "1px 6px", borderRadius: 4, flexShrink: 0 }}>{t.points}</span>
                      </div>
                    );
                  })
                )}

                {/* Risks */}
                {sprintRisks.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 6, display: "flex", alignItems: "center", gap: 4, color: C.textS }}><I.Shield /> Sprint Risks</div>
                    {sprintRisks.map((r, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 8px", borderRadius: 6, background: sevColor[r.severity] + "06", borderLeft: `2px solid ${sevColor[r.severity]}`, marginBottom: 4, fontSize: 11, color: C.textS, animation: `fadeIn 0.2s ease ${i * 0.05}s both` }}>
                        <I.Alert /><span>{r.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* AI Narrative */}
                {aiNarrative && (
                  <div style={{ marginTop: 12, background: C.bgEl, borderRadius: 8, padding: 12, animation: "fadeIn 0.3s" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 6, display: "flex", alignItems: "center", gap: 4, color: C.accent }}><I.Brain /> AI Review</div>
                    <div style={{ fontSize: 12, color: C.textS, lineHeight: 1.7 }}>{aiNarrative}</div>
                    <div style={{ marginTop: 6, fontSize: 10, color: C.muted }}>AI explains pre-computed optimizer and risk results.</div>
                  </div>
                )}
              </div>

              {/* Bottom — Capacity + Burndown */}
              <div style={{ display: "flex", borderTop: `1px solid ${C.borderS}`, height: 200, flexShrink: 0 }}>
                {/* Capacity */}
                <div style={{ flex: 1, padding: 12, borderRight: `1px solid ${C.borderS}`, overflow: "auto" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}><I.Users /> Team Capacity</div>
                  {capacityData.map((m, i) => {
                    const barColor = m.status === "overloaded" ? C.red : m.status === "heavy" ? C.amber : m.pct > 0 ? C.accent : C.muted + "33";
                    return (
                      <div key={m.name} style={{ marginBottom: 6, animation: `fadeIn 0.2s ease ${i * 0.04}s both` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                          <span style={{ fontSize: 11, color: C.textS }}>{m.avatar}</span>
                          <span style={{ fontSize: 10, fontFamily: "monospace", color: barColor }}>{m.used}/{m.capacity}</span>
                        </div>
                        <div style={{ height: 4, background: C.bgEl, borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${Math.min(100, m.pct)}%`, background: barColor, borderRadius: 2, transition: "width 0.5s" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Burndown */}
                <div style={{ flex: 1.3, padding: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 6 }}>Projected Burndown</div>
                  {sprintSP > 0 ? (
                    <ResponsiveContainer width="100%" height={140}>
                      <AreaChart data={burndownData}>
                        <defs><linearGradient id="bgrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.accent} stopOpacity={0.1}/><stop offset="100%" stopColor={C.accent} stopOpacity={0}/></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={C.borderS} vertical={false} />
                        <XAxis dataKey="day" tick={{ fontSize: 9, fill: C.muted }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 9, fill: C.muted }} tickLine={false} axisLine={false} />
                        <Tooltip content={<ChartTooltip />} />
                        <Area type="monotone" dataKey="ideal" stroke={C.muted} strokeWidth={1} strokeDasharray="4 3" fill="none" name="Ideal" />
                        <Area type="monotone" dataKey="projected" stroke={C.accent} strokeWidth={1.5} fill="url(#bgrad)" name="Projected" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, fontSize: 12 }}>Add tasks to see burndown</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* === HISTORY TAB === */
          <div style={{ padding: 20, overflow: "auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20, animation: "fadeIn 0.2s" }}>
              {[{ l: "Avg Velocity", v: avgVelocity + " SP", c: C.accent }, { l: "Forecasted", v: forecastedVelocity + " SP", c: C.green }, { l: "Completion Rate", v: VelocityEngine.completionRate() + "%", c: C.amber }].map(s => (
                <div key={s.l} style={{ background: C.bgCard, border: `1px solid ${C.borderS}`, borderRadius: 10, padding: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>{s.l}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "monospace", color: s.c }}>{s.v}</div>
                </div>
              ))}
            </div>
            {/* Velocity Trend Chart */}
            <div style={{ background: C.bgCard, border: `1px solid ${C.borderS}`, borderRadius: 10, padding: 16, marginBottom: 16, animation: "slideUp 0.2s" }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Velocity Trend</div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={sprintHistory.map(s => ({ sprint: s.id, planned: s.planned, completed: s.completed }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.borderS} vertical={false} />
                  <XAxis dataKey="sprint" tick={{ fontSize: 11, fill: C.textS }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: C.muted }} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <ReferenceLine y={avgVelocity} stroke={C.muted} strokeDasharray="3 3" />
                  <Bar dataKey="planned" fill={C.borderS} radius={[4,4,0,0]} name="Planned" />
                  <Bar dataKey="completed" fill={C.accent} radius={[4,4,0,0]} name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Sprint History Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              {sprintHistory.map((s, i) => (
                <div key={s.id} style={{ background: C.bgCard, border: `1px solid ${C.borderS}`, borderRadius: 10, padding: 14, animation: `slideUp 0.2s ease ${i * 0.05}s both` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{s.id}</span>
                    <span style={{ fontSize: 11, fontFamily: "monospace", color: C.green }}>{Math.round(s.completed / s.planned * 100)}% done</span>
                  </div>
                  <div style={{ display: "flex", gap: 12, fontSize: 11, color: C.textS, marginBottom: 8 }}>
                    <span>Planned: <strong>{s.planned}</strong></span>
                    <span>Done: <strong style={{ color: C.green }}>{s.completed}</strong></span>
                    <span>Velocity: <strong style={{ color: C.accent }}>{s.velocity}</strong></span>
                  </div>
                  <ResponsiveContainer width="100%" height={64}>
                    <AreaChart data={s.burndown.map((v, j) => ({ d: j, v, ideal: Math.round(s.planned * (1 - j / (s.days - 1)) * 10) / 10 }))}>
                      <Area type="monotone" dataKey="ideal" stroke={C.muted} strokeWidth={1} strokeDasharray="3 3" fill="none" />
                      <Area type="monotone" dataKey="v" stroke={C.accent} strokeWidth={1.5} fill={C.accentS} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      <Modal isOpen={!!showTaskDetail} onClose={() => setShowTaskDetail(null)} title={showTaskDetail?.name || ""} width={440}>
        {showTaskDetail && (() => {
          const t = showTaskDetail;
          const sc = Optimizer.scoreTask(t, {});
          return (
            <div>
              <div style={{ display: "flex", gap: 5, marginBottom: 12 }}>
                <span style={{ fontSize: 10.5, padding: "2px 7px", borderRadius: 4, background: priorityColor[t.priority] + "12", color: priorityColor[t.priority], fontWeight: 500 }}>{t.priority}</span>
                <span style={{ fontSize: 10.5, padding: "2px 7px", borderRadius: 4, background: typeColor[t.type] + "12", color: typeColor[t.type] }}>{typeLabel[t.type]}</span>
                <span style={{ fontSize: 10.5, padding: "2px 7px", borderRadius: 4, background: C.accentS, color: C.accent, fontWeight: 600 }}>{t.points} SP</span>
                {t.blocked && <span style={{ fontSize: 10.5, padding: "2px 7px", borderRadius: 4, background: C.redS, color: C.red, fontWeight: 600 }}>BLOCKED by {t.blockedBy}</span>}
              </div>
              <div style={{ fontSize: 12, color: C.textS, marginBottom: 12 }}>
                <div>Assignee: <strong>{t.assignee}</strong></div>
                <div>Age: <strong>{t.age} days</strong> in backlog</div>
                <div>Feedback mentions: <strong>{t.feedbackMentions}</strong></div>
              </div>
              {/* Optimizer Score Breakdown */}
              <div style={{ background: C.bgEl, borderRadius: 8, padding: 12, marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><I.Target /> Optimizer Score</span>
                  <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "monospace", color: C.accent }}>{sc.composite}</span>
                </div>
                <ScoreBar label="Priority" value={sc.breakdown.priority} color={C.red} />
                <ScoreBar label="Feedback" value={sc.breakdown.feedback} color={C.green} />
                <ScoreBar label="Dep Free" value={sc.breakdown.depFree} color={C.cyan} />
                <ScoreBar label="Cap Fit" value={sc.breakdown.capFit} color={C.amber} />
                <ScoreBar label="Age" value={sc.breakdown.age} color={C.purple} />
              </div>
              <div style={{ fontSize: 10, color: C.muted, lineHeight: 1.5, background: C.bgEl, borderRadius: 6, padding: 8 }}>
                Score = (Priority × 0.30) + (Feedback × 0.25) + (DependencyFree × 0.20) + (CapacityFit × 0.15) + (Age × 0.10)
              </div>
            </div>
          );
        })()}
      </Modal>
    </>
  );
}

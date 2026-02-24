import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// PRISM AI — Roadmap Builder v2
// Dependency Engine · Resource Balance · Risk Score · Optimizer
// Timeline · Kanban · List · Meta Light Theme
// ============================================================

const C = {
  bg: "#F0F2F5", bgCard: "#FFFFFF", bgEl: "#F7F8FA", bgHov: "#EFF1F3",
  border: "#D4D7DC", borderS: "#E4E6EB", text: "#1C2028", textS: "#606770",
  muted: "#8A8D91", accent: "#1877F2", accentS: "rgba(24,119,242,0.08)",
  accentG: "rgba(24,119,242,0.2)", green: "#31A24C", greenS: "rgba(49,162,76,0.08)",
  amber: "#F7B928", amberS: "rgba(247,185,40,0.08)", red: "#E4405F", redS: "rgba(228,64,95,0.08)",
  cyan: "#1DA1F2", cyanS: "rgba(29,161,242,0.08)", purple: "#833AB4", purpleS: "rgba(131,58,180,0.08)",
};

const statusCfg = {
  planned: { label: "Planned", color: C.muted, bg: "rgba(138,141,145,0.08)" },
  "in-progress": { label: "In Progress", color: C.accent, bg: C.accentS },
  review: { label: "Review", color: C.amber, bg: C.amberS },
  shipped: { label: "Shipped", color: C.green, bg: C.greenS },
};
const priorityCfg = {
  critical: { label: "Critical", color: C.red, bg: C.redS },
  high: { label: "High", color: C.amber, bg: C.amberS },
  medium: { label: "Medium", color: C.cyan, bg: C.cyanS },
  low: { label: "Low", color: C.muted, bg: "rgba(138,141,145,0.08)" },
};
const categoryCfg = {
  frontend: { label: "Frontend", color: "#4F87F7" },
  backend: { label: "Backend", color: "#E4405F" },
  mobile: { label: "Mobile", color: C.cyan },
  infra: { label: "Infrastructure", color: C.amber },
  design: { label: "Design", color: C.purple },
  ai: { label: "AI/ML", color: C.green },
};
const teamMembers = ["Zakhar K.", "Cole H.", "Sarah M.", "Alex D.", "Nina P.", "Unassigned"];
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// --- ICONS ---
const I = {
  Plus: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Close: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Edit: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Filter: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  Sparkle: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>,
  Timeline: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="15" y2="6"/><line x1="9" y1="18" x2="21" y2="18"/></svg>,
  Board: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="12" rx="1"/><rect x="17" y="3" width="5" height="15" rx="1"/></svg>,
  ListIcon: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor"/><circle cx="4" cy="12" r="1.5" fill="currentColor"/><circle cx="4" cy="18" r="1.5" fill="currentColor"/></svg>,
  Grip: () => <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" opacity="0.25"><circle cx="9" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/></svg>,
  Check: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  Arrow: () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
  Alert: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Brain: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a7 7 0 0 1 7 7c0 2.4-1.2 4.5-3 5.7V17H8v-2.3C6.2 13.5 5 11.4 5 9a7 7 0 0 1 7-7z"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="9" y1="17" x2="9" y2="21"/><line x1="15" y1="17" x2="15" y2="21"/></svg>,
  Regen: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  Link: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  Calendar: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Shield: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
};

// --- DEMO DATA ---
const demoFeatures = [
  { id: 1, name: "Onboarding Simplification", desc: "One-click OAuth, progressive setup wizard", status: "in-progress", priority: "critical", category: "frontend", assignee: "Sarah M.", progress: 65, startMonth: 1, endMonth: 2, dependencies: [], effort: 8 },
  { id: 2, name: "Mobile Performance", desc: "Lazy loading, bundle splitting, offline cache", status: "in-progress", priority: "high", category: "mobile", assignee: "Alex D.", progress: 40, startMonth: 1, endMonth: 3, dependencies: [], effort: 13 },
  { id: 3, name: "Real-time Collaboration", desc: "WebSocket, CRDT, live cursors, presence", status: "planned", priority: "high", category: "backend", assignee: "Cole H.", progress: 10, startMonth: 3, endMonth: 5, dependencies: [5], effort: 21 },
  { id: 4, name: "Bulk Operations", desc: "Batch editing, mass actions, CSV export", status: "review", priority: "medium", category: "frontend", assignee: "Sarah M.", progress: 85, startMonth: 0, endMonth: 1, dependencies: [], effort: 5 },
  { id: 5, name: "WebSocket Infrastructure", desc: "Core real-time messaging layer", status: "planned", priority: "high", category: "infra", assignee: "Cole H.", progress: 0, startMonth: 2, endMonth: 4, dependencies: [], effort: 13 },
  { id: 6, name: "Custom Dashboards", desc: "Drag-and-drop widgets, saved views", status: "planned", priority: "medium", category: "design", assignee: "Nina P.", progress: 0, startMonth: 4, endMonth: 6, dependencies: [], effort: 8 },
  { id: 7, name: "API v2 & Webhooks", desc: "REST API redesign, webhook support, rate limiting", status: "planned", priority: "medium", category: "backend", assignee: "Cole H.", progress: 0, startMonth: 6, endMonth: 8, dependencies: [3, 5], effort: 13 },
  { id: 8, name: "Enterprise SSO", desc: "SAML, OIDC, directory sync, audit logs", status: "planned", priority: "high", category: "infra", assignee: "Alex D.", progress: 0, startMonth: 5, endMonth: 7, dependencies: [], effort: 13 },
  { id: 9, name: "Dark Mode Redesign", desc: "Full theme system, user preferences", status: "shipped", priority: "low", category: "design", assignee: "Nina P.", progress: 100, startMonth: 0, endMonth: 1, dependencies: [], effort: 3 },
  { id: 10, name: "Notification Center", desc: "In-app notifications, email digests, preferences", status: "shipped", priority: "medium", category: "frontend", assignee: "Sarah M.", progress: 100, startMonth: 0, endMonth: 0, dependencies: [], effort: 5 },
  { id: 11, name: "AI Sprint Planner", desc: "Auto sprint suggestions based on velocity", status: "planned", priority: "high", category: "ai", assignee: "Zakhar K.", progress: 0, startMonth: 7, endMonth: 9, dependencies: [3], effort: 13 },
  { id: 12, name: "Competitor Tracking", desc: "Auto-monitor competitor changelogs", status: "planned", priority: "medium", category: "ai", assignee: "Unassigned", progress: 0, startMonth: 8, endMonth: 10, dependencies: [], effort: 8 },
];

// ============================================================
// ALGORITHM 1: Dependency Resolution Engine
// Topological sort + cycle detection + critical path
// ============================================================
const DepEngine = {
  buildGraph(features) {
    const graph = {}; const inDeg = {};
    features.forEach(f => { graph[f.id] = []; inDeg[f.id] = 0; });
    features.forEach(f => { f.dependencies.forEach(d => { if (graph[d]) { graph[d].push(f.id); inDeg[f.id]++; } }); });
    return { graph, inDeg };
  },
  detectCycles(features) {
    const { graph, inDeg } = this.buildGraph(features);
    const q = Object.keys(inDeg).filter(k => inDeg[k] === 0).map(Number);
    let visited = 0;
    while (q.length) { const n = q.shift(); visited++; (graph[n] || []).forEach(nb => { inDeg[nb]--; if (inDeg[nb] === 0) q.push(nb); }); }
    return visited < features.length;
  },
  criticalPath(features) {
    const byId = Object.fromEntries(features.map(f => [f.id, f]));
    const earliest = {};
    const calc = (id) => {
      if (earliest[id] !== undefined) return earliest[id];
      const f = byId[id]; if (!f) return 0;
      const depEnds = f.dependencies.map(d => byId[d] ? calc(d) + (byId[d].endMonth - byId[d].startMonth + 1) : 0);
      earliest[id] = depEnds.length > 0 ? Math.max(...depEnds) : 0;
      return earliest[id];
    };
    features.forEach(f => calc(f.id));
    let maxPath = 0; let criticalFeatureId = null;
    features.forEach(f => { const total = earliest[f.id] + (f.endMonth - f.startMonth + 1); if (total > maxPath) { maxPath = total; criticalFeatureId = f.id; } });
    // Trace back critical path
    const path = [];
    const trace = (id) => { path.unshift(id); const f = byId[id]; if (!f) return; const deps = f.dependencies.filter(d => byId[d]); if (deps.length > 0) { const longestDep = deps.reduce((best, d) => earliest[d] + (byId[d].endMonth - byId[d].startMonth + 1) > earliest[best] + (byId[best].endMonth - byId[best].startMonth + 1) ? d : best, deps[0]); trace(longestDep); } };
    if (criticalFeatureId) trace(criticalFeatureId);
    return { path: path.map(id => byId[id]?.name || id), length: maxPath, earliest };
  },
  getBlockedBy(featureId, features) {
    const byId = Object.fromEntries(features.map(f => [f.id, f]));
    const f = byId[featureId]; if (!f) return [];
    return f.dependencies.map(d => byId[d]).filter(Boolean).filter(dep => dep.status !== "shipped");
  },
};

// ============================================================
// ALGORITHM 2: Resource Balancing
// Load per person per month
// ============================================================
function calculateResourceLoad(features) {
  const load = {};
  teamMembers.forEach(m => { load[m] = Array(12).fill(0); });
  features.forEach(f => {
    if (f.status === "shipped" || f.assignee === "Unassigned") return;
    const span = Math.max(1, f.endMonth - f.startMonth + 1);
    const effortPerMonth = f.effort / span;
    for (let m = f.startMonth; m <= f.endMonth && m < 12; m++) {
      if (load[f.assignee]) load[f.assignee][m] += effortPerMonth;
    }
  });
  // Find overloaded months
  const overloads = [];
  Object.entries(load).forEach(([person, months]) => {
    months.forEach((val, mi) => {
      if (val > 15) overloads.push({ person, month: mi, load: Math.round(val * 10) / 10, severity: val > 20 ? "critical" : "high" });
    });
  });
  return { load, overloads: overloads.sort((a, b) => b.load - a.load) };
}

// ============================================================
// ALGORITHM 3: Feature Risk Assessment
// Risk = (DependencyDepth × 0.30) + (Complexity × 0.25) + (ResourceContention × 0.25) + (TimelinePressure × 0.20)
// ============================================================
function assessRisks(features) {
  const resourceData = calculateResourceLoad(features);
  const byId = Object.fromEntries(features.map(f => [f.id, f]));
  
  return features.filter(f => f.status !== "shipped").map(f => {
    // Dependency depth
    let depDepth = 0;
    const countDeps = (id, depth) => {
      const feat = byId[id]; if (!feat) return;
      depDepth = Math.max(depDepth, depth);
      feat.dependencies.forEach(d => countDeps(d, depth + 1));
    };
    countDeps(f.id, 0);
    const depScore = Math.min(10, depDepth * 3 + f.dependencies.length * 1.5);

    // Complexity (effort-based)
    const complexity = Math.min(10, f.effort / 2.5);

    // Resource contention
    let contention = 0;
    if (f.assignee !== "Unassigned" && resourceData.load[f.assignee]) {
      for (let m = f.startMonth; m <= f.endMonth && m < 12; m++) {
        if (resourceData.load[f.assignee][m] > 13) contention += 2;
        else if (resourceData.load[f.assignee][m] > 8) contention += 1;
      }
    }
    contention = Math.min(10, contention);

    // Timeline pressure (how close to now + how tight)
    const span = f.endMonth - f.startMonth + 1;
    const timelinePressure = Math.min(10, Math.max(0, (10 - span) + (f.startMonth < 3 ? 3 : 0)));

    const composite = (depScore * 0.30) + (complexity * 0.25) + (contention * 0.25) + (timelinePressure * 0.20);
    const severity = composite >= 7 ? "critical" : composite >= 5 ? "high" : composite >= 3 ? "medium" : "low";

    return { featureId: f.id, name: f.name, composite: Math.round(composite * 10) / 10, severity, breakdown: { depScore: Math.round(depScore * 10) / 10, complexity: Math.round(complexity * 10) / 10, contention: Math.round(contention * 10) / 10, timelinePressure: Math.round(timelinePressure * 10) / 10 } };
  }).sort((a, b) => b.composite - a.composite);
}

// ============================================================
// ALGORITHM 4: Timeline Optimizer (bottleneck detection)
// ============================================================
function findBottlenecks(features) {
  const monthLoad = Array(12).fill(0);
  features.filter(f => f.status !== "shipped").forEach(f => {
    for (let m = f.startMonth; m <= f.endMonth && m < 12; m++) monthLoad[m] += f.effort / Math.max(1, f.endMonth - f.startMonth + 1);
  });
  const avg = monthLoad.reduce((s, v) => s + v, 0) / 12;
  const bottlenecks = monthLoad.map((load, i) => ({ month: i, label: months[i], load: Math.round(load * 10) / 10, isBottleneck: load > avg * 1.4 })).filter(b => b.isBottleneck);
  return { monthLoad: monthLoad.map((v, i) => ({ month: months[i], load: Math.round(v * 10) / 10 })), bottlenecks, avgLoad: Math.round(avg * 10) / 10 };
}

// ============================================================
// UI HELPERS
// ============================================================
const ScoreBar = ({ label, value, max = 10, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
    <span style={{ fontSize: 10.5, color: C.textS, width: 75, flexShrink: 0 }}>{label}</span>
    <div style={{ flex: 1, height: 4, background: C.bgEl, borderRadius: 2, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${(value / max) * 100}%`, background: color, borderRadius: 2, transition: "width 0.6s ease" }} />
    </div>
    <span style={{ fontSize: 10, fontFamily: "'SF Mono','Roboto Mono',monospace", color, width: 22, textAlign: "right" }}>{value}</span>
  </div>
);

const Modal = ({ isOpen, onClose, title, children, width = 540 }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.2)", backdropFilter: "blur(3px)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, width: "92%", maxWidth: width, maxHeight: "85vh", overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,0.1)", animation: "scaleIn 0.2s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: `1px solid ${C.borderS}` }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", display: "flex" }}><I.Close /></button>
        </div>
        <div style={{ padding: 18, overflowY: "auto", maxHeight: "calc(85vh - 50px)" }}>{children}</div>
      </div>
    </div>
  );
};

const fieldStyle = { width: "100%", background: C.bgEl, border: `1px solid ${C.borderS}`, borderRadius: 7, padding: "7px 11px", color: C.text, fontFamily: "'Inter',system-ui,sans-serif", fontSize: 12.5, outline: "none" };

// ============================================================
// FEATURE FORM
// ============================================================
const FeatureForm = ({ feature, features, onSave, onDelete }) => {
  const isNew = !feature?.id;
  const [f, setF] = useState(feature || { name: "", desc: "", status: "planned", priority: "medium", category: "frontend", assignee: "Unassigned", progress: 0, startMonth: new Date().getMonth(), endMonth: Math.min(11, new Date().getMonth() + 2), dependencies: [], effort: 5 });
  const upd = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div><label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: C.textS, marginBottom: 3 }}>Feature Name *</label><input value={f.name} onChange={e => upd("name", e.target.value)} style={fieldStyle} /></div>
      <div><label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: C.textS, marginBottom: 3 }}>Description</label><textarea value={f.desc} onChange={e => upd("desc", e.target.value)} rows={2} style={{ ...fieldStyle, resize: "vertical" }} /></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <div><label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: C.textS, marginBottom: 3 }}>Status</label><select value={f.status} onChange={e => upd("status", e.target.value)} style={{ ...fieldStyle, cursor: "pointer" }}>{Object.entries(statusCfg).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
        <div><label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: C.textS, marginBottom: 3 }}>Priority</label><select value={f.priority} onChange={e => upd("priority", e.target.value)} style={{ ...fieldStyle, cursor: "pointer" }}>{Object.entries(priorityCfg).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
        <div><label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: C.textS, marginBottom: 3 }}>Category</label><select value={f.category} onChange={e => upd("category", e.target.value)} style={{ ...fieldStyle, cursor: "pointer" }}>{Object.entries(categoryCfg).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
        <div><label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: C.textS, marginBottom: 3 }}>Assignee</label><select value={f.assignee} onChange={e => upd("assignee", e.target.value)} style={{ ...fieldStyle, cursor: "pointer" }}>{teamMembers.map(m => <option key={m}>{m}</option>)}</select></div>
        <div><label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: C.textS, marginBottom: 3 }}>Start</label><select value={f.startMonth} onChange={e => upd("startMonth", +e.target.value)} style={{ ...fieldStyle, cursor: "pointer" }}>{months.map((m, i) => <option key={i} value={i}>{m}</option>)}</select></div>
        <div><label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: C.textS, marginBottom: 3 }}>End</label><select value={f.endMonth} onChange={e => upd("endMonth", +e.target.value)} style={{ ...fieldStyle, cursor: "pointer" }}>{months.map((m, i) => <option key={i} value={i}>{m}</option>)}</select></div>
        <div><label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: C.textS, marginBottom: 3 }}>Effort (SP)</label><input type="number" min={1} max={40} value={f.effort} onChange={e => upd("effort", +e.target.value)} style={fieldStyle} /></div>
      </div>
      <div><label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: C.textS, marginBottom: 3 }}>Progress (%)</label><input type="number" min={0} max={100} value={f.progress} onChange={e => upd("progress", Math.min(100, Math.max(0, +e.target.value)))} style={{ ...fieldStyle, width: 100 }} /></div>
      <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
        <button onClick={() => f.name.trim() && onSave(f)} style={{ flex: 1, padding: "9px", borderRadius: 7, border: "none", fontSize: 13, fontWeight: 500, cursor: "pointer", background: f.name.trim() ? C.accent : C.bgEl, color: f.name.trim() ? "white" : C.muted, fontFamily: "'Inter',system-ui,sans-serif" }}>{isNew ? "Create" : "Save"}</button>
        {!isNew && <button onClick={() => onDelete(feature.id)} style={{ padding: "9px 14px", borderRadius: 7, border: `1px solid ${C.red}22`, background: C.redS, color: C.red, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'Inter',system-ui,sans-serif", display: "flex", alignItems: "center", gap: 4 }}><I.Trash /> Delete</button>}
      </div>
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function RoadmapBuilderV2() {
  const [features, setFeatures] = useState(demoFeatures);
  const [view, setView] = useState("timeline");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCat, setFilterCat] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [editFeature, setEditFeature] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [aiNarrative, setAiNarrative] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [sortBy, setSortBy] = useState("startMonth");
  const [sortDir, setSortDir] = useState(1);

  // Run algorithms
  const risks = assessRisks(features);
  const resourceData = calculateResourceLoad(features);
  const criticalPath = DepEngine.criticalPath(features);
  const hasCycles = DepEngine.detectCycles(features);
  const bottleneckData = findBottlenecks(features);

  const stats = { total: features.length, shipped: features.filter(f => f.status === "shipped").length, inProgress: features.filter(f => f.status === "in-progress").length, atRisk: risks.filter(r => r.severity === "critical" || r.severity === "high").length };

  // Filter
  const filtered = features.filter(f => {
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus !== "all" && f.status !== filterStatus) return false;
    if (filterCat !== "all" && f.category !== filterCat) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name) * sortDir;
    if (sortBy === "priority") { const o = { critical: 0, high: 1, medium: 2, low: 3 }; return (o[a.priority] - o[b.priority]) * sortDir; }
    return ((a[sortBy] || 0) > (b[sortBy] || 0) ? 1 : -1) * sortDir;
  });

  // CRUD
  const saveFeature = (f) => { if (f.id) setFeatures(p => p.map(x => x.id === f.id ? f : x)); else setFeatures(p => [...p, { ...f, id: Date.now() }]); setEditFeature(null); setShowCreate(false); };
  const deleteFeature = (id) => { setFeatures(p => p.filter(x => x.id !== id)); setEditFeature(null); };
  const changeStatus = (id, status) => setFeatures(p => p.map(f => f.id === id ? { ...f, status, progress: status === "shipped" ? 100 : f.progress } : f));

  // AI Narrative
  const generateInsights = async () => {
    setAiLoading(true);
    try {
      const riskStr = risks.slice(0, 5).map(r => `${r.name}: risk=${r.composite}/10 (deps:${r.breakdown.depScore}, complexity:${r.breakdown.complexity}, contention:${r.breakdown.contention}, timeline:${r.breakdown.timelinePressure})`).join("\n");
      const cpStr = `Critical path: ${criticalPath.path.join(" → ")} (${criticalPath.length} months)`;
      const blStr = bottleneckData.bottlenecks.map(b => `${b.label}: ${b.load} effort (avg: ${bottleneckData.avgLoad})`).join(", ") || "None";
      const olStr = resourceData.overloads.slice(0, 3).map(o => `${o.person} in ${months[o.month]}: ${o.load} SP`).join(", ") || "None";

      const r = await fetch("/api/claude", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 700, system: "You explain PRE-COMPUTED roadmap analysis results. Be concise: 4-5 sentences. Focus on the biggest risks and recommended schedule changes.", messages: [{ role: "user", content: `RISK ASSESSMENT:\n${riskStr}\n\nCRITICAL PATH:\n${cpStr}\n\nBOTTLENECKS:\n${blStr}\n\nRESOURCE OVERLOADS:\n${olStr}\n\nCycles detected: ${hasCycles}\n\nExplain findings and recommend top 2 actions.` }] }) });
      const d = await r.json();
      setAiNarrative(d.content?.map(b => b.text || "").join("") || "");
    } catch (e) { setAiNarrative(`Failed: ${e.message}`); }
    finally { setAiLoading(false); }
  };

  const sevColor = { critical: C.red, high: C.amber, medium: C.cyan, low: C.muted };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes scaleIn{from{opacity:0;transform:scale(0.97)}to{opacity:1;transform:scale(1)}}
    @keyframes slideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Inter',system-ui,sans-serif;background:${C.bg};color:${C.text}}
    ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}
  `;

  const viewBtns = [{ id: "timeline", icon: <I.Timeline />, l: "Timeline" }, { id: "board", icon: <I.Board />, l: "Board" }, { id: "list", icon: <I.ListIcon />, l: "List" }];

  return (
    <>
      <style>{css}</style>
      <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: C.bg, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* HEADER */}
        <header style={{ padding: "12px 24px", borderBottom: `1px solid ${C.borderS}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <I.Calendar /><h1 style={{ fontSize: 17, fontWeight: 600 }}>Roadmap</h1>
            {[{ l: `${stats.total} Total`, c: C.muted }, { l: `${stats.inProgress} Active`, c: C.accent }, { l: `${stats.shipped} Shipped`, c: C.green }, { l: `${stats.atRisk} At Risk`, c: stats.atRisk > 0 ? C.red : C.muted }].map(s => (
              <span key={s.l} style={{ fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 5, color: s.c, background: s.c + "10" }}>{s.l}</span>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, background: C.bgEl, border: `1px solid ${C.borderS}`, borderRadius: 7, padding: "5px 10px", width: 180 }}>
              <I.Search /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ background: "none", border: "none", outline: "none", color: C.text, fontFamily: "'Inter',system-ui,sans-serif", fontSize: 12, width: "100%" }} />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 7, border: `1px solid ${showFilters ? C.accent + "44" : C.borderS}`, background: showFilters ? C.accentS : C.bgEl, color: showFilters ? C.accent : C.textS, fontSize: 12, fontFamily: "'Inter',system-ui,sans-serif", cursor: "pointer" }}><I.Filter /> Filters</button>
            <div style={{ display: "flex", gap: 2, background: C.bgEl, padding: 2, borderRadius: 7, border: `1px solid ${C.borderS}` }}>
              {viewBtns.map(v => (<button key={v.id} onClick={() => setView(v.id)} style={{ display: "flex", alignItems: "center", gap: 3, padding: "4px 9px", borderRadius: 5, border: "none", background: view === v.id ? C.accent : "transparent", color: view === v.id ? "white" : C.muted, fontSize: 11, fontFamily: "'Inter',system-ui,sans-serif", fontWeight: 500, cursor: "pointer" }}>{v.icon} {v.l}</button>))}
            </div>
            <button onClick={() => { setShowInsights(true); if (!aiNarrative) generateInsights(); }} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 7, border: "none", background: C.accentS, color: C.accent, fontSize: 12, fontWeight: 500, fontFamily: "'Inter',system-ui,sans-serif", cursor: "pointer" }}><I.Brain /> Insights</button>
            <button onClick={() => setShowCreate(true)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 7, border: "none", background: C.accent, color: "white", fontSize: 12, fontWeight: 500, fontFamily: "'Inter',system-ui,sans-serif", cursor: "pointer", boxShadow: "0 2px 8px rgba(24,119,242,0.25)" }}><I.Plus /> Add</button>
          </div>
        </header>

        {showFilters && (
          <div style={{ padding: "8px 24px", borderBottom: `1px solid ${C.borderS}`, display: "flex", gap: 10, background: C.bgCard, animation: "slideUp 0.15s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ fontSize: 11, color: C.muted }}>Status:</span><select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...fieldStyle, width: "auto", padding: "3px 8px", fontSize: 11 }}><option value="all">All</option>{Object.entries(statusCfg).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ fontSize: 11, color: C.muted }}>Category:</span><select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ ...fieldStyle, width: "auto", padding: "3px 8px", fontSize: 11 }}><option value="all">All</option>{Object.entries(categoryCfg).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
            <button onClick={() => { setFilterStatus("all"); setFilterCat("all"); setSearch(""); }} style={{ fontSize: 11, color: C.accent, background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter',system-ui,sans-serif", marginLeft: "auto" }}>Clear</button>
          </div>
        )}

        {/* MAIN */}
        <div style={{ flex: 1, overflow: "auto" }}>
          {/* === TIMELINE === */}
          {view === "timeline" && (
            <div style={{ background: C.bgCard, border: `1px solid ${C.borderS}`, borderRadius: 10, margin: 16, overflow: "hidden", animation: "fadeIn 0.2s" }}>
              <div style={{ display: "flex", borderBottom: `1px solid ${C.borderS}`, position: "sticky", top: 0, background: C.bgCard, zIndex: 5 }}>
                <div style={{ width: 210, flexShrink: 0, padding: "9px 14px", fontSize: 10.5, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: 0.6, borderRight: `1px solid ${C.borderS}` }}>Feature</div>
                <div style={{ flex: 1, display: "flex", minWidth: 960 }}>
                  {months.map((m, i) => (<div key={i} style={{ width: 80, flexShrink: 0, padding: "9px 0", textAlign: "center", fontSize: 10.5, fontWeight: 500, borderRight: `1px solid ${C.borderS}`, color: i === new Date().getMonth() ? C.accent : C.muted, background: i === new Date().getMonth() ? C.accentS : "transparent" }}>{m}</div>))}
                </div>
              </div>
              {filtered.map((f, idx) => {
                const cat = categoryCfg[f.category];
                const risk = risks.find(r => r.featureId === f.id);
                const blocked = DepEngine.getBlockedBy(f.id, features);
                const barL = f.startMonth * 80;
                const barW = Math.max((f.endMonth - f.startMonth + 1) * 80 - 8, 36);
                return (
                  <div key={f.id} onClick={() => setEditFeature(f)} style={{ display: "flex", borderBottom: `1px solid ${C.borderS}`, cursor: "pointer", transition: "background 0.1s", animation: `fadeIn 0.2s ease ${idx * 0.02}s both` }}
                    onMouseEnter={e => e.currentTarget.style.background = C.bgHov} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <div style={{ width: 210, flexShrink: 0, padding: "8px 14px", borderRight: `1px solid ${C.borderS}`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
                        {risk && risk.severity !== "low" && <span style={{ width: 6, height: 6, borderRadius: "50%", background: sevColor[risk.severity], flexShrink: 0 }} />}
                      </div>
                      <div style={{ fontSize: 10, color: C.muted, display: "flex", alignItems: "center", gap: 3, marginTop: 1 }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: cat?.color }} />{f.assignee}
                        {blocked.length > 0 && <span style={{ fontSize: 8.5, padding: "0 4px", borderRadius: 3, background: C.redS, color: C.red, fontWeight: 600, marginLeft: 2 }}>BLOCKED</span>}
                      </div>
                    </div>
                    <div style={{ flex: 1, position: "relative", minWidth: 960, height: 44, display: "flex", alignItems: "center" }}>
                      <div style={{ position: "absolute", left: new Date().getMonth() * 80 + 40, top: 0, bottom: 0, width: 1, background: C.accent + "30", zIndex: 1 }} />
                      <div style={{ position: "absolute", left: barL + 4, width: barW, height: 24, borderRadius: 5, background: `linear-gradient(90deg, ${cat?.color}20, ${cat?.color}0c)`, border: `1px solid ${cat?.color}33`, display: "flex", alignItems: "center", paddingLeft: 7, gap: 4, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${f.progress}%`, position: "absolute", left: 0, top: 0, background: cat?.color + "15", borderRadius: "5px 0 0 5px" }} />
                        <span style={{ fontSize: 10, fontWeight: 500, color: cat?.color, position: "relative", zIndex: 1, whiteSpace: "nowrap" }}>{f.name}</span>
                        {f.progress > 0 && f.progress < 100 && <span style={{ fontSize: 8.5, fontFamily: "'SF Mono','Roboto Mono',monospace", color: cat?.color, opacity: 0.7, position: "relative", zIndex: 1 }}>{f.progress}%</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* === KANBAN === */}
          {view === "board" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, padding: 16, height: "calc(100vh - 120px)", overflow: "hidden", animation: "fadeIn 0.2s" }}>
              {Object.entries(statusCfg).map(([status, cfg]) => {
                const items = filtered.filter(f => f.status === status);
                return (
                  <div key={status} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); const id = +e.dataTransfer.getData("fid"); if (id) changeStatus(id, status); }}
                    style={{ background: C.bgCard, border: `1px solid ${C.borderS}`, borderRadius: 10, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    <div style={{ padding: "10px 12px", borderBottom: `1px solid ${C.borderS}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.color }} /><span style={{ fontSize: 12, fontWeight: 600 }}>{cfg.label}</span></div>
                      <span style={{ fontSize: 10.5, fontFamily: "'SF Mono','Roboto Mono',monospace", color: C.muted, background: C.bgEl, padding: "1px 6px", borderRadius: 4 }}>{items.length}</span>
                    </div>
                    <div style={{ flex: 1, overflowY: "auto", padding: 6, display: "flex", flexDirection: "column", gap: 5 }}>
                      {items.map((f, i) => {
                        const p = priorityCfg[f.priority]; const cat = categoryCfg[f.category]; const risk = risks.find(r => r.featureId === f.id);
                        return (
                          <div key={f.id} draggable onDragStart={e => e.dataTransfer.setData("fid", f.id)} onClick={() => setEditFeature(f)}
                            style={{ background: C.bgEl, border: `1px solid ${C.borderS}`, borderRadius: 7, padding: "8px 10px", cursor: "pointer", transition: "all 0.15s", animation: `fadeIn 0.2s ease ${i * 0.03}s both` }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(-1px)"; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderS; e.currentTarget.style.transform = "none"; }}>
                            <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 3 }}>{f.name}</div>
                            <div style={{ fontSize: 10, color: C.muted, marginBottom: 5 }}>{f.assignee}</div>
                            <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
                              <span style={{ fontSize: 8.5, fontWeight: 600, padding: "1px 5px", borderRadius: 3, background: p.bg, color: p.color }}>{p.label}</span>
                              <span style={{ fontSize: 8.5, padding: "1px 5px", borderRadius: 3, background: cat?.color + "12", color: cat?.color }}>{cat?.label}</span>
                              {risk && risk.severity !== "low" && <span style={{ fontSize: 8.5, fontWeight: 600, padding: "1px 5px", borderRadius: 3, background: sevColor[risk.severity] + "12", color: sevColor[risk.severity] }}>Risk {risk.composite}</span>}
                              {f.progress > 0 && f.progress < 100 && <span style={{ fontSize: 9, fontFamily: "'SF Mono','Roboto Mono',monospace", color: C.accent, marginLeft: "auto" }}>{f.progress}%</span>}
                            </div>
                          </div>
                        );
                      })}
                      {items.length === 0 && <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, fontSize: 11 }}>Drop here</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* === LIST === */}
          {view === "list" && (
            <div style={{ background: C.bgCard, border: `1px solid ${C.borderS}`, borderRadius: 10, margin: 16, overflow: "hidden", animation: "fadeIn 0.2s" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 80px 90px 100px 70px 80px 60px", borderBottom: `1px solid ${C.borderS}` }}>
                {[{ k: "name", l: "Feature" },{ k: "status", l: "Status" },{ k: "priority", l: "Priority" },{ k: "category", l: "Category" },{ k: "assignee", l: "Owner" },{ k: "progress", l: "Progress" },{ k: "startMonth", l: "Timeline" },{ k: "effort", l: "Risk" }].map(col => (
                  <div key={col.k} onClick={() => { if (sortBy === col.k) setSortDir(d => d * -1); else { setSortBy(col.k); setSortDir(1); } }} style={{ padding: "9px 10px", fontSize: 10, fontWeight: 600, color: sortBy === col.k ? C.accent : C.muted, textTransform: "uppercase", letterSpacing: 0.6, cursor: "pointer", borderRight: `1px solid ${C.borderS}` }}>{col.l}</div>
                ))}
              </div>
              {filtered.map((f, idx) => {
                const s = statusCfg[f.status]; const p = priorityCfg[f.priority]; const cat = categoryCfg[f.category]; const risk = risks.find(r => r.featureId === f.id);
                return (
                  <div key={f.id} onClick={() => setEditFeature(f)} style={{ display: "grid", gridTemplateColumns: "1fr 90px 80px 90px 100px 70px 80px 60px", borderBottom: `1px solid ${C.borderS}`, cursor: "pointer", transition: "background 0.1s", animation: `fadeIn 0.15s ease ${idx * 0.02}s both` }}
                    onMouseEnter={e => e.currentTarget.style.background = C.bgHov} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <div style={{ padding: "8px 10px", borderRight: `1px solid ${C.borderS}` }}><div style={{ fontSize: 12.5, fontWeight: 500 }}>{f.name}</div><div style={{ fontSize: 10.5, color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.desc}</div></div>
                    <div style={{ padding: "8px 10px", display: "flex", alignItems: "center", borderRight: `1px solid ${C.borderS}` }}><span style={{ fontSize: 10, fontWeight: 500, padding: "1px 6px", borderRadius: 4, background: s.bg, color: s.color }}>{s.label}</span></div>
                    <div style={{ padding: "8px 10px", display: "flex", alignItems: "center", borderRight: `1px solid ${C.borderS}` }}><span style={{ fontSize: 10, fontWeight: 500, padding: "1px 6px", borderRadius: 4, background: p.bg, color: p.color }}>{p.label}</span></div>
                    <div style={{ padding: "8px 10px", display: "flex", alignItems: "center", borderRight: `1px solid ${C.borderS}` }}><span style={{ fontSize: 10, padding: "1px 5px", borderRadius: 4, background: cat?.color + "12", color: cat?.color }}>{cat?.label}</span></div>
                    <div style={{ padding: "8px 10px", fontSize: 11.5, color: C.textS, display: "flex", alignItems: "center", borderRight: `1px solid ${C.borderS}` }}>{f.assignee}</div>
                    <div style={{ padding: "8px 10px", display: "flex", alignItems: "center", gap: 4, borderRight: `1px solid ${C.borderS}` }}>
                      <div style={{ width: 36, height: 3, background: C.bgEl, borderRadius: 2, overflow: "hidden" }}><div style={{ height: "100%", width: `${f.progress}%`, background: f.progress === 100 ? C.green : C.accent, borderRadius: 2 }} /></div>
                      <span style={{ fontSize: 10, fontFamily: "'SF Mono','Roboto Mono',monospace", color: C.muted }}>{f.progress}%</span>
                    </div>
                    <div style={{ padding: "8px 10px", fontSize: 10.5, color: C.textS, display: "flex", alignItems: "center", borderRight: `1px solid ${C.borderS}` }}>{months[f.startMonth]}–{months[f.endMonth]}</div>
                    <div style={{ padding: "8px 10px", display: "flex", alignItems: "center" }}>
                      {risk && <span style={{ fontSize: 10, fontWeight: 600, fontFamily: "'SF Mono','Roboto Mono',monospace", color: sevColor[risk.severity] }}>{risk.composite}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={!!editFeature} onClose={() => setEditFeature(null)} title={editFeature?.name || ""}>
        {editFeature && (
          <div>
            {(() => { const risk = risks.find(r => r.featureId === editFeature.id); const blocked = DepEngine.getBlockedBy(editFeature.id, features);
              return (risk || blocked.length > 0) ? (
                <div style={{ marginBottom: 14 }}>
                  {risk && risk.severity !== "low" && (
                    <div style={{ background: sevColor[risk.severity] + "08", border: `1px solid ${sevColor[risk.severity]}18`, borderRadius: 8, padding: 10, marginBottom: 8 }}>
                      <div style={{ fontSize: 11.5, fontWeight: 600, color: sevColor[risk.severity], marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}><I.Shield /> Risk Score: {risk.composite}/10 ({risk.severity})</div>
                      <ScoreBar label="Dependencies" value={risk.breakdown.depScore} color={C.accent} />
                      <ScoreBar label="Complexity" value={risk.breakdown.complexity} color={C.amber} />
                      <ScoreBar label="Contention" value={risk.breakdown.contention} color={C.red} />
                      <ScoreBar label="Timeline" value={risk.breakdown.timelinePressure} color={C.purple} />
                    </div>
                  )}
                  {blocked.length > 0 && (
                    <div style={{ fontSize: 11.5, color: C.red, display: "flex", alignItems: "center", gap: 4, padding: "6px 10px", background: C.redS, borderRadius: 6 }}>
                      <I.Alert /> Blocked by: {blocked.map(b => b.name).join(", ")}
                    </div>
                  )}
                </div>
              ) : null;
            })()}
            <FeatureForm feature={editFeature} features={features} onSave={saveFeature} onDelete={deleteFeature} />
          </div>
        )}
      </Modal>
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="New Feature"><FeatureForm features={features} onSave={saveFeature} /></Modal>

      {/* Insights Panel */}
      <Modal isOpen={showInsights} onClose={() => setShowInsights(false)} title="Roadmap Insights" width={620}>
        <div>
          {/* Critical Path */}
          <div style={{ background: C.bgEl, borderRadius: 8, padding: 12, marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}><I.Link /> Critical Path <span style={{ fontSize: 10, color: C.muted, fontWeight: 400 }}>{criticalPath.length} months</span></div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {criticalPath.path.map((name, i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ fontSize: 11.5, padding: "2px 8px", borderRadius: 5, background: C.accentS, color: C.accent, fontWeight: 500 }}>{name}</span>{i < criticalPath.path.length - 1 && <span style={{ color: C.muted }}>→</span>}</div>))}
            </div>
            {hasCycles && <div style={{ fontSize: 11, color: C.red, marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}><I.Alert /> Dependency cycle detected</div>}
          </div>

          {/* Top Risks */}
          <div style={{ background: C.bgEl, borderRadius: 8, padding: 12, marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}><I.Shield /> Top Risks</div>
            {risks.slice(0, 4).map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0", borderBottom: i < 3 ? `1px solid ${C.borderS}` : "none" }}>
                <span style={{ fontSize: 12, fontWeight: 500 }}>{r.name}</span>
                <span style={{ fontSize: 11, fontFamily: "'SF Mono','Roboto Mono',monospace", fontWeight: 600, color: sevColor[r.severity] }}>{r.composite}/10</span>
              </div>
            ))}
          </div>

          {/* Bottlenecks */}
          {bottleneckData.bottlenecks.length > 0 && (
            <div style={{ background: C.amberS, borderRadius: 8, padding: 12, marginBottom: 12, border: `1px solid ${C.amber}18` }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, color: C.amber, display: "flex", alignItems: "center", gap: 5 }}><I.Alert /> Timeline Bottlenecks</div>
              {bottleneckData.bottlenecks.map((b, i) => (
                <div key={i} style={{ fontSize: 12, color: C.textS }}>{b.label}: <strong>{b.load} SP</strong> (avg: {bottleneckData.avgLoad})</div>
              ))}
            </div>
          )}

          {/* Resource Overloads */}
          {resourceData.overloads.length > 0 && (
            <div style={{ background: C.redS, borderRadius: 8, padding: 12, marginBottom: 12, border: `1px solid ${C.red}18` }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, color: C.red, display: "flex", alignItems: "center", gap: 5 }}><I.Alert /> Resource Overloads</div>
              {resourceData.overloads.slice(0, 4).map((o, i) => (
                <div key={i} style={{ fontSize: 12, color: C.textS }}>{o.person} in {months[o.month]}: <strong>{o.load} SP</strong></div>
              ))}
            </div>
          )}

          {/* AI Narrative */}
          <div style={{ background: C.bgEl, borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, display: "flex", alignItems: "center", gap: 5, color: C.accent }}><I.Brain /> AI Analysis</div>
            {aiNarrative ? (
              <div>
                <div style={{ fontSize: 12.5, color: C.textS, lineHeight: 1.7 }}>{aiNarrative}</div>
                <div style={{ marginTop: 8, fontSize: 10, color: C.muted, padding: "6px 8px", background: C.bgCard, borderRadius: 5 }}>AI explains pre-computed algorithm results. Risk scores, critical path, and resource data calculated by Prism engine.</div>
                <button onClick={generateInsights} disabled={aiLoading} style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 6, border: `1px solid ${C.borderS}`, background: C.bgCard, color: C.textS, fontSize: 11, fontFamily: "'Inter',system-ui,sans-serif", cursor: "pointer" }}>
                  <span style={{ display: "flex", animation: aiLoading ? "spin 1s linear infinite" : "none" }}><I.Regen /></span> Re-analyze
                </button>
              </div>
            ) : aiLoading ? (
              <div style={{ fontSize: 12, color: C.muted, animation: "pulse 1.5s infinite" }}>Generating analysis...</div>
            ) : (
              <div style={{ fontSize: 12, color: C.muted }}>Click "Insights" to generate AI analysis.</div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}

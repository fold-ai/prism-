import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PRDGenerator from "./pages/PRDGenerator";
import RoadmapBuilder from "./pages/RoadmapBuilder";
import SprintPlanner from "./pages/SprintPlanner";
import CompetitorIntelligence from "./pages/CompetitorIntelligence";

const C = {
  sidebar: "#FFFFFF",
  sidebarBorder: "#E4E6EB",
  sidebarText: "#606770",
  sidebarActive: "#1877F2",
  sidebarActiveBg: "rgba(24,119,242,0.08)",
  sidebarHover: "#F0F2F5",
  bg: "#F0F2F5",
};

const navItems = [
  { path: "/", label: "Dashboard", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { path: "/prd", label: "PRD Generator", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  { path: "/roadmap", label: "Roadmap", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { path: "/sprint", label: "Sprint Planner", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
  { path: "/competitors", label: "Competitors", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> },
];

const bottomItems = [
  { label: "Settings", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
];

function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{
      width: collapsed ? 56 : 220, flexShrink: 0, background: C.sidebar,
      borderRight: `1px solid ${C.sidebarBorder}`, display: "flex", flexDirection: "column",
      transition: "width 0.2s ease", overflow: "hidden", position: "relative", zIndex: 40,
    }}>
      {/* Logo */}
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{ padding: collapsed ? "16px 12px" : "16px 18px", borderBottom: `1px solid ${C.sidebarBorder}`, display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}
      >
        <div style={{ width: 30, height: 30, borderRadius: 8, background: "#1877F2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ color: "white", fontWeight: 700, fontSize: 15, fontFamily: "'Inter',system-ui,sans-serif" }}>P</span>
        </div>
        {!collapsed && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1C2028", letterSpacing: -0.3 }}>Prism AI</div>
            <div style={{ fontSize: 9.5, color: "#8A8D91", fontWeight: 500, letterSpacing: 0.3 }}>PRODUCT MANAGEMENT</div>
          </div>
        )}
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, padding: "8px 6px", display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: collapsed ? "9px 12px" : "9px 14px",
                borderRadius: 8, cursor: "pointer", transition: "all 0.15s",
                background: active ? C.sidebarActiveBg : "transparent",
                color: active ? C.sidebarActive : C.sidebarText,
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = C.sidebarHover; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ display: "flex", flexShrink: 0, opacity: active ? 1 : 0.65 }}>{item.icon}</span>
              {!collapsed && <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, whiteSpace: "nowrap" }}>{item.label}</span>}
            </div>
          );
        })}
      </div>

      {/* Bottom items */}
      <div style={{ padding: "8px 6px", borderTop: `1px solid ${C.sidebarBorder}` }}>
        {bottomItems.map(item => (
          <div
            key={item.label}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: collapsed ? "9px 12px" : "9px 14px",
              borderRadius: 8, cursor: "pointer", color: C.sidebarText, transition: "all 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = C.sidebarHover}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <span style={{ display: "flex", flexShrink: 0, opacity: 0.65 }}>{item.icon}</span>
            {!collapsed && <span style={{ fontSize: 13, whiteSpace: "nowrap" }}>{item.label}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter',system-ui,sans-serif", background: C.bg, overflow: "hidden" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/prd" element={<PRDGenerator />} />
          <Route path="/roadmap" element={<RoadmapBuilder />} />
          <Route path="/sprint" element={<SprintPlanner />} />
          <Route path="/competitors" element={<CompetitorIntelligence />} />
        </Routes>
      </div>
    </div>
  );
}

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', system-ui, sans-serif; background: #F0F2F5; color: #1C2028; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #D4D7DC; border-radius: 3px; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes scaleIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
`;

export default function App() {
  return (
    <>
      <style>{globalCSS}</style>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </>
  );
}

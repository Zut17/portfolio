import { lazy, Suspense, useEffect, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import RequireAdmin from "./RequireAdmin";
import AdminLayout from "./AdminLayout";
import Login from "./Login";
import { ADMIN } from "../lib/adminPath";
 
const Dashboard = lazy(() => import("./Dashboard"));
const ProfileAdmin = lazy(() => import("./ProfileAdmin"));
const ProjectsAdmin = lazy(() => import("./ProjectsAdmin"));
const SkillsAdmin = lazy(() => import("./SkillsAdmin"));
const TimelineAdmin = lazy(() => import("./TimelineAdmin"));
const ServicesAdmin = lazy(() => import("./ServicesAdmin"));
const MessagesAdmin = lazy(() => import("./MessagesAdmin"));
 
function AdminLoading() {
  return <div className="py-10 text-muted">Chargement de l’administration…</div>;
}
 
function Lazy({ children }: { children: ReactNode }) {
  return <Suspense fallback={<AdminLoading />}>{children}</Suspense>;
}
 
export default function AdminRoutes() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Administration";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.title = previousTitle;
      meta.remove();
    };
  }, []);
 
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<RequireAdmin />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Lazy><Dashboard /></Lazy>} />
            <Route path="profil" element={<Lazy><ProfileAdmin /></Lazy>} />
            <Route path="projets" element={<Lazy><ProjectsAdmin /></Lazy>} />
            <Route path="competences" element={<Lazy><SkillsAdmin /></Lazy>} />
            <Route path="parcours" element={<Lazy><TimelineAdmin /></Lazy>} />
            <Route path="services" element={<Lazy><ServicesAdmin /></Lazy>} />
            <Route path="messages" element={<Lazy><MessagesAdmin /></Lazy>} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to={ADMIN} replace />} />
      </Routes>
    </AuthProvider>
  );
}

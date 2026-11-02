import { lazy, Suspense, useEffect, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import RequireAdmin from "./RequireAdmin";
import AdminLayout from "./AdminLayout";
import Login from "./Login";
import { ADMIN_HOME } from "../lib/adminPath";
 
const Dashboard = lazy(() => import("./Dashboard"));
const ProfileAdmin = lazy(() => import("./ProfileAdmin"));
const ProjectsAdmin = lazy(() => import("./ProjectsAdmin"));
const SkillsAdmin = lazy(() => import("./SkillsAdmin"));
const TimelineAdmin = lazy(() => import("./TimelineAdmin"));
const ServicesAdmin = lazy(() => import("./ServicesAdmin"));
const MessagesAdmin = lazy(() => import("./MessagesAdmin"));
const CertificationsAdmin = lazy(() => import("./CertificationsAdmin"));
const GoalsAdmin = lazy(() => import("./GoalsAdmin"));
 
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
    let meta = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const created = !meta;
    const previousRobots = meta?.content ?? "";
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      document.head.appendChild(meta);
    }
    meta.content = "noindex, nofollow";
    return () => {
      document.title = previousTitle;
      if (created) meta.remove();
      else meta.content = previousRobots;
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
            <Route path="certifications" element={<Lazy><CertificationsAdmin /></Lazy>} />
            <Route path="objectifs" element={<Lazy><GoalsAdmin /></Lazy>} />
            <Route path="messages" element={<Lazy><MessagesAdmin /></Lazy>} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to={ADMIN_HOME} replace />} />
      </Routes>
    </AuthProvider>
  );
}

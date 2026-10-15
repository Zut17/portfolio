import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import RequireAdmin from "./RequireAdmin";
import AdminLayout from "./AdminLayout";
import Login from "./Login";
import Dashboard from "./Dashboard";
import ProfileAdmin from "./ProfileAdmin";
import ProjectsAdmin from "./ProjectsAdmin";
import SkillsAdmin from "./SkillsAdmin";
import TimelineAdmin from "./TimelineAdmin";
import ServicesAdmin from "./ServicesAdmin";
import MessagesAdmin from "./MessagesAdmin";

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
            <Route index element={<Dashboard />} />
            <Route path="profil" element={<ProfileAdmin />} />
            <Route path="projets" element={<ProjectsAdmin />} />
            <Route path="competences" element={<SkillsAdmin />} />
            <Route path="parcours" element={<TimelineAdmin />} />
            <Route path="services" element={<ServicesAdmin />} />
            <Route path="messages" element={<MessagesAdmin />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AuthProvider>
  );
}

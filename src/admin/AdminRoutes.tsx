import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import RequireAdmin from "./RequireAdmin";
import AdminLayout from "./AdminLayout";
import Login from "./Login";
import Dashboard from "./Dashboard";
import ComingSoon from "./ComingSoon";

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
            <Route path="profil" element={<ComingSoon title="Profil" />} />
            <Route path="projets" element={<ComingSoon title="Projets" />} />
            <Route path="competences" element={<ComingSoon title="Compétences" />} />
            <Route path="parcours" element={<ComingSoon title="Parcours" />} />
            <Route path="services" element={<ComingSoon title="Services" />} />
            <Route path="messages" element={<ComingSoon title="Messages" />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AuthProvider>
  );
}

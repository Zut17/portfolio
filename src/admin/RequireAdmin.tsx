import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireAdmin() {
  const { session, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted">
        Chargement…
      </div>
    );
  }
  if (!session || !isAdmin) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}

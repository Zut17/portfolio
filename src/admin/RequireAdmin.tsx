import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { ADMIN } from "../lib/adminPath";

export default function RequireAdmin() {
  const { session, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted">
        Chargement…
      </div>
    );
  }
  if (!session || !isAdmin) return <Navigate to={`${ADMIN}/login`} replace />;
  return <Outlet />;
}

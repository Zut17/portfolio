import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { ADMIN } from "../lib/adminPath";

export default function RequireAdmin() {
  const { session, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted">
        Chargement…
      </div>
    );
  }
  if (!session || !isAdmin) return <Navigate to={`${ADMIN}/login`} replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

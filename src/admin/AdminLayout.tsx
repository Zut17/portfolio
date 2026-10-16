import { NavLink, Outlet } from "react-router-dom";
import {
  ExternalLink,
  FolderOpen,
  GraduationCap,
  Layers,
  LayoutDashboard,
  LogOut,
  Mail,
  Moon,
  Sun,
  User,
  Wrench,
} from "lucide-react";
import { useAuth } from "./AuthContext";
import { useTheme } from "../hooks/useTheme";
import { ADMIN } from "../lib/adminPath";

const links = [
  { to: ADMIN, label: "Tableau de bord", icon: LayoutDashboard, end: true },
  { to: `${ADMIN}/profil`, label: "Profil", icon: User, end: false },
  { to: `${ADMIN}/projets`, label: "Projets", icon: FolderOpen, end: false },
  { to: `${ADMIN}/competences`, label: "Compétences", icon: Wrench, end: false },
  { to: `${ADMIN}/parcours`, label: "Parcours", icon: GraduationCap, end: false },
  { to: `${ADMIN}/services`, label: "Services", icon: Layers, end: false },
  { to: `${ADMIN}/messages`, label: "Messages", icon: Mail, end: false },
];

export default function AdminLayout() {
  const { session, signOut } = useAuth();
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-screen md:flex">
      <aside className="border-b border-border bg-card md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r">
        <div className="flex h-full flex-col p-4">
          <div className="mb-4 flex items-center justify-between md:mb-8">
            <span className="font-display text-lg font-bold">
              HWZ<span className="text-accent">.</span>{" "}
              <span className="text-sm font-normal text-muted">admin</span>
            </span>
            <button
              onClick={toggle}
              aria-label="Changer de thème"
              className="rounded-full border border-border p-2 transition hover:border-accent hover:text-accent"
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>

          <nav className="flex gap-1 overflow-x-auto md:flex-1 md:flex-col md:overflow-visible">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "text-muted hover:bg-primary/5 hover:text-foreground"
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-muted transition hover:text-primary"
            >
              <ExternalLink size={14} /> Voir le site
            </a>
            <p className="truncate text-xs text-muted">{session?.user.email}</p>
            <button
              onClick={signOut}
              className="flex items-center gap-2 text-muted transition hover:text-accent"
            >
              <LogOut size={14} /> Déconnexion
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}

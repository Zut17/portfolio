import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LocaleLayout from "./layouts/LocaleLayout";
import Landing from "./pages/Landing";
import { ContentProvider } from "./content/ContentContext";

const AdminRoutes = lazy(() => import("./admin/AdminRoutes"));

function detectLang() {
  return navigator.language.toLowerCase().startsWith("en") ? "en" : "fr";
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/${detectLang()}`} replace />} />
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={null}>
            <AdminRoutes />
          </Suspense>
        }
      />
      <Route
        path="/:lang"
        element={
          <ContentProvider>
            <LocaleLayout />
          </ContentProvider>
        }
      >
        <Route index element={<Landing />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

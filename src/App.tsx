import { Navigate, Route, Routes } from "react-router-dom";
import LocaleLayout from "./layouts/LocaleLayout";
import Landing from "./pages/Landing";
import { ContentProvider } from "./content/ContentContext";

function detectLang() {
  return navigator.language.toLowerCase().startsWith("en") ? "en" : "fr";
}

/** Site public uniquement : l'administration est une application séparée. */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/${detectLang()}`} replace />} />
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

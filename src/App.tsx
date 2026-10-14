import { Navigate, Route, Routes } from "react-router-dom";
import LocaleLayout from "./layouts/LocaleLayout";
import Landing from "./pages/Landing";

function detectLang() {
  return navigator.language.toLowerCase().startsWith("en") ? "en" : "fr";
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/${detectLang()}`} replace />} />
      <Route path="/:lang" element={<LocaleLayout />}>
        <Route index element={<Landing />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

import { Navigate, Route, Routes } from "react-router-dom";
import LocaleLayout from "./layouts/LocaleLayout";
import Home from "./pages/Home";

function detectLang() {
  return navigator.language.toLowerCase().startsWith("en") ? "en" : "fr";
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/${detectLang()}`} replace />} />
      <Route path="/:lang" element={<LocaleLayout />}>
        <Route index element={<Home />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

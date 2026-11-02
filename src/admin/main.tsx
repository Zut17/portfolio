import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@fontsource-variable/manrope";
import "@fontsource-variable/space-grotesk";
import "../index.css";
import AdminRoutes from "./AdminRoutes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AdminRoutes />
    </BrowserRouter>
  </StrictMode>,
);

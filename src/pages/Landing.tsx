import { useTranslation } from "react-i18next";
import Home from "./Home";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Services from "../components/Services";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Marquee from "../components/Marquee";
import BackToTop from "../components/BackToTop";

export default function Landing() {
  const { i18n } = useTranslation();

  return (
    <>
      <a href="#main" className="skip-link">
        {i18n.language.startsWith("fr") ? "Aller au contenu" : "Skip to content"}
      </a>
      <main id="main">
        <Home />
        <About />
        <Skills />
        <Marquee />
        <Projects />
        <Services />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

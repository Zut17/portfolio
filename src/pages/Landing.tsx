import Home from "./Home";
import About from "../components/About";
import Projects from "../components/Projects";
import Journey from "../components/Journey";
import Certifications from "../components/Certifications";
import Skills from "../components/Skills";
import Services from "../components/Services";
import Goals from "../components/Goals";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";

/**
 * Ordre : identité et repères → qui je suis → preuves (projets) →
 * parcours et certifications → savoir-faire → cap → contact.
 * Une section sans contenu (ex. aucune certification) ne s'affiche pas.
 */
export default function Landing() {
  return (
    <>
      <main id="main" tabIndex={-1}>
        <Home />
        <About />
        <Projects />
        <Journey />
        <Certifications />
        <Skills />
        <Services />
        <Goals />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

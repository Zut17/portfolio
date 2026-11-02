import Home from "./Home";
import Projects from "../components/Projects";
import Journey from "../components/Journey";
import Skills from "../components/Skills";
import Services from "../components/Services";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";

/** Ordre des sections : les preuves (projets) d'abord, puis le parcours. */
export default function Landing() {
  return (
    <>
      <main id="main" tabIndex={-1}>
        <Home />
        <Projects />
        <Journey />
        <Skills />
        <Services />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

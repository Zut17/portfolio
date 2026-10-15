import Home from "./Home";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Services from "../components/Services";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Marquee from "../components/Marquee";

export default function Landing() {
  return (
    <>
      <main>
        <Home />
        <About />
        <Skills />
        <Marquee />
        <Projects />
        <Services />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

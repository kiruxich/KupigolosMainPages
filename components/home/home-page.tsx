import { About } from "./about";
import { AiServices } from "./ai-services";
import { Calculator } from "./calculator";
import { Contact } from "./contact";
import { Header } from "./header";
import { Hero } from "./hero";
import { homeMarkup } from "./home-markup.generated";
import { Portfolio } from "./portfolio";
import { ProofSections } from "./proof-sections";
import { RenderHomeMarkup } from "./render-home-markup";
import { Services } from "./services";
import { Voices } from "./voices";

export function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <Voices />
        <AiServices />
        <About />
        <Services />
        <Portfolio />
        <Calculator />
        <ProofSections />
        <Contact />
      </main>
      <RenderHomeMarkup markup={homeMarkup.footer} />
    </>
  );
}


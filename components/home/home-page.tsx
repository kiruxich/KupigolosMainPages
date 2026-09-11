import { About } from "./about";
import { AiServices } from "./ai-services";
import { Calculator } from "./calculator";
import { Contact } from "./contact";
import { Clients } from "./clients";
import { Guarantees } from "./guarantees";
import { Header } from "./header";
import { Hero } from "./hero";
import { homeMarkup } from "./home-markup.generated";
import { Portfolio } from "./portfolio";
import { Process } from "./process";
import { Advantages, VoiceCategories } from "./proof-sections";
import { RenderHomeMarkup } from "./render-home-markup";
import { Reviews } from "./reviews";
import { Services } from "./services";
import { StudioDirections } from "./studio-directions";
import { StudioFaq } from "./studio-faq";
import { StudioIntro } from "./studio-intro";
import { Voices } from "./voices";

export function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <Voices />
        <StudioIntro />
        <Services />
        <AiServices />
        <Portfolio />
        <Calculator />
        <Process />
        <VoiceCategories />
        <StudioDirections />
        <StudioFaq />
        <Advantages />
        <Guarantees />
        <About />
        <Reviews />
        <Clients />
        <Contact />
      </main>
      <RenderHomeMarkup markup={homeMarkup.footer} />
    </>
  );
}

import parse, { Element } from "html-react-parser";
import { homeMarkup } from "./home-markup.generated";
import { Clients } from "./clients";
import { Guarantees } from "./guarantees";
import { Process } from "./process";
import { Reviews } from "./reviews";

export function ProofSections() {
  return <>{parse(homeMarkup.proofSections, {
    replace(node) {
      if (node instanceof Element && node.name === "section" && node.attribs.id === "reviews") {
        return <Reviews />;
      }
      if (node instanceof Element && node.name === "section" && node.attribs.id === "clients") {
        return <Clients />;
      }
      if (node instanceof Element && node.name === "section" && node.attribs.id === "guarantees") {
        return <Guarantees />;
      }
      if (
        node instanceof Element && node.name === "svg" &&
        node.parent instanceof Element &&
        node.parent.attribs.class?.split(/\s+/).includes("talent-card-children")
      ) {
        return <img
          src="/assets/voice-categories/children-studio.webp"
          alt="Ребёнок в наушниках записывает голос у студийного микрофона"
          width={1254}
          height={1254}
          loading="lazy"
          style={{ right: "-5%", width: "70%", height: "86%" }}
        />;
      }
      if (node instanceof Element && node.name === "section" && node.attribs.id === "process") {
        return <Process />;
      }
    },
  })}</>;
}

import parse, { Element } from "html-react-parser";
import { homeMarkup } from "./home-markup.generated";
import { Clients } from "./clients";
import { Guarantees } from "./guarantees";
import { Process } from "./process";
import { Reviews } from "./reviews";

const advantagesStart = homeMarkup.proofSections.indexOf('<section class="advantages-stage');
const guaranteesStart = homeMarkup.proofSections.indexOf('<section class="guarantees-stage');
const voiceCategoriesMarkup = homeMarkup.proofSections.slice(0, advantagesStart);
const advantagesMarkup = homeMarkup.proofSections.slice(advantagesStart, guaranteesStart);

function replaceChildrenArtwork(node: unknown) {
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
}

export function VoiceCategories() {
  return <>{parse(voiceCategoriesMarkup, { replace: replaceChildrenArtwork })}</>;
}

export function Advantages() {
  return <>{parse(advantagesMarkup)}</>;
}

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
      const childrenArtwork = replaceChildrenArtwork(node);
      if (childrenArtwork) return childrenArtwork;
      if (
        node instanceof Element && node.name === "section" && node.attribs.id === "voice-categories"
      ) {
        return <></>;
      }
      if (node instanceof Element && node.name === "section" && node.attribs.id === "process") {
        return <Process />;
      }
    },
  })}</>;
}

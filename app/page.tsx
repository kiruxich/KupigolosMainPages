/* eslint-disable @next/next/no-page-custom-font -- route-scoped loading preserves the existing font metrics */
import type { Metadata, Viewport } from "next";
import { HomePage } from "@/components/home/home-page";
import { HomeRuntime } from "@/components/home/home-runtime";
import { homeMetadata, homeViewport, organizationJsonLd } from "./home/home-metadata";

export const metadata: Metadata = homeMetadata;
export const viewport: Viewport = homeViewport;

export default function HomeRoute() {
  return (
    <>
      <link rel="preload" href="/assets/hero-studio-session-v1.png" as="image" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Manrope:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <HomePage />
      <HomeRuntime />
    </>
  );
}

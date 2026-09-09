import { HomePage } from "@/components/home/home-page";
import { HomeRuntime } from "@/components/home/home-runtime";
import { homeMetadata, homeViewport, organizationJsonLd } from "./home-metadata";

export const metadata = homeMetadata;
export const viewport = homeViewport;

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <HomePage />
      <HomeRuntime />
    </>
  );
}

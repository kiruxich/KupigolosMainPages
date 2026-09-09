import { HomePage } from "@/components/home/home-page";
import { homeMetadata, homeViewport, organizationJsonLd } from "./home-metadata";

export const metadata = homeMetadata;
export const viewport = homeViewport;

export default function HomeRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <HomePage />
    </>
  );
}


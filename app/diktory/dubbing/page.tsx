import type { Metadata } from "next";
import { SeoPage } from "@/components/seo/seo-page";
import { seoPageConfig } from "@/lib/seo-page-config";

const config = seoPageConfig.dubbing;
export const metadata: Metadata = { title: config.title, description: config.description, alternates: { canonical: config.canonical } };

export default function DubbingPage() {
  return <SeoPage documentKey={config.document} />;
}


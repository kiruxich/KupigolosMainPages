import type { Metadata } from "next";
import { SeoPage } from "@/components/seo/seo-page";
import { seoPageConfig } from "@/lib/seo-page-config";

const config = seoPageConfig.localization;
export const metadata: Metadata = { title: config.title, description: config.description, alternates: { canonical: config.canonical } };

export default function LocalizationPage() {
  return <SeoPage documentKey={config.document} />;
}


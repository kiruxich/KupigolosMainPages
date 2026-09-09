import type { Metadata } from "next";
import { SeoPage } from "@/components/seo/seo-page";
import { seoPageConfig } from "@/lib/seo-page-config";

const config = seoPageConfig.women;
export const metadata: Metadata = { title: config.title, description: config.description, alternates: { canonical: config.canonical } };

export default function WomenVoicesPage() {
  return <SeoPage documentKey={config.document} />;
}


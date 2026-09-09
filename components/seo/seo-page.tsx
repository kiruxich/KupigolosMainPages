import { seoDocuments } from "@/lib/seo-documents";
import type { SeoDocumentKey } from "@/lib/seo-page-config";
import { CatalogRuntime } from "./catalog-runtime";
import { ContactSection, SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function SeoPage({ documentKey }: { documentKey: SeoDocumentKey }) {
  const document = seoDocuments[documentKey];
  return (
    <>
      <SiteHeader />
      <main>
        {document.jsonLd.map((value, index) => (
          <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(value) }} />
        ))}
        <CatalogRuntime html={document.html} documentKey={documentKey} />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}

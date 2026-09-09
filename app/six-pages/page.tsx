import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./six-pages.css";

export const metadata: Metadata = { title: "6 страниц" };
export const viewport: Viewport = { themeColor: "#f54622" };

export default function SixPagesPage() {
  return (
    <main className="six-pages-page">
      <Link href="/">← К проектам</Link>
      <h1>6 страниц</h1>
      <p>Пока здесь пусто.</p>
    </main>
  );
}


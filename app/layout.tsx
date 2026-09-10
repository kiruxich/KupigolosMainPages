import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = { title: "КупиГолос" };

const roboto = Roboto({
  subsets: ["cyrillic", "latin"],
  variable: "--font-roboto",
  display: "swap",
});

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ru" data-theme="brand" className={roboto.variable}>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";

export const homeMetadata: Metadata = {
  title: "КупиГолос - Студия озвучивания и дубляжа в Москве",
  description: "Студия дубляжа в Москве - топ звук, лучшие голоса, уют! Озвучивание любого контента. У нас работают топовые актеры дубляжа и озвучки. Приезжайте в гости!",
  keywords: ["купиголос", "студия дубляжа", "студия озвучивания", "продакшн студия"],
  alternates: { canonical: "https://kupigolos.ru/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "КупиГолос",
    title: "КупиГолос - Студия озвучивания и дубляжа в Москве",
    description: "Профессиональная озвучка, дубляж, аудиореклама и локализация. Более 800 голосов на 60 языках.",
    url: "https://kupigolos.ru/",
    images: ["https://kupigolos.ru/assets/hero-script.jpg"],
  },
  twitter: { card: "summary_large_image" },
};

export const homeViewport: Viewport = { themeColor: "#f54622" };

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://kupigolos.ru/#organization",
  name: "КупиГолос",
  url: "https://kupigolos.ru/",
  description: "Студия озвучивания и дубляжа в Москве",
  image: "https://kupigolos.ru/assets/hero-script.jpg",
  telephone: "8 800 200-45-51",
  email: "info@kupigolos.ru",
  priceRange: "₽₽",
  areaServed: ["Россия", "Москва", "Нижний Новгород"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Большой Саввинский переулок, 9 стр. 3",
    addressLocality: "Москва",
    addressCountry: "RU",
  },
} as const;


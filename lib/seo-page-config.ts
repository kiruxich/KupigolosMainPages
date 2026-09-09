import { seoDocuments } from "./seo-documents";

export type SeoDocumentKey = keyof typeof seoDocuments;

export const seoPageConfig = {
  diktory: {
    document: "diktory",
    title: "Дикторы для озвучки и голоса онлайн — база дикторов | КупиГолос",
    description:
      "Голоса для озвучки: выберите диктора онлайн по полу, возрасту, тембру, цене и сроку записи. Слушайте демо известных, иностранных, мужских и женских дикторов.",
    canonical: "https://kupigolos.ru/diktory",
  },
  dubbing: {
    document: "dubbing",
    title: "Актеры дубляжа и озвучки — голоса фильмов и сериалов | КупиГолос",
    description:
      "Актеры дубляжа и озвучки для фильмов, сериалов, мультфильмов и игр. Слушайте демо, выбирайте голос персонажа и заказывайте профессиональную запись в студии.",
    canonical: "https://kupigolos.ru/diktory/dubbing",
  },
  famous: {
    document: "famous",
    title: "Известные дикторы — федеральные голоса ТВ и радио | КупиГолос",
    description:
      "Известные дикторы и федеральные голоса ТВ и радио: слушайте демо, сравнивайте цены, выбирайте актёров дубляжа и заказывайте профессиональную запись онлайн.",
    canonical: "https://kupigolos.ru/diktory/izvestnye_golosa",
  },
  women: {
    document: "women",
    title: "Озвучка женским голосом — голос девушки по тексту | КупиГолос",
    description:
      "Озвучка женским голосом для текста, видео и рекламы: выберите профессиональный женский голос, послушайте демо и закажите запись. Есть ИИ-голоса онлайн.",
    canonical: "https://kupigolos.ru/diktory/zhenskie_golosa",
  },
  localization: {
    document: "localization",
    title: "Локализация контента, перевод и озвучка под ключ | КупиГолос",
    description:
      "Перевод и локализация контента для бизнеса: тексты, аудио, видео, игры, фильмы и курсы. Культурная адаптация, озвучка носителями языка и LQA под ключ.",
    canonical: "https://kupigolos.ru/perevod",
  },
} as const;

export type SeoPageName = keyof typeof seoPageConfig;


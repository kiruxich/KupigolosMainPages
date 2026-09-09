import parse from "html-react-parser";

export function RenderHomeMarkup({ markup }: Readonly<{ markup: string }>) {
  return <>{parse(markup)}</>;
}


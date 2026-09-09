import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProjectIndexPage from "../../app/page";

describe("project index", () => {
  it("renders the three remaining projects in order with stable destinations", () => {
    render(<ProjectIndexPage />);

    expect(screen.getAllByRole("heading", { level: 2 }).map(({ textContent }) => textContent)).toEqual([
      "Поставщики Афиши",
      "Озвучка",
      "Главная страница",
    ]);
    expect(screen.getByLabelText("Открыть файл Поставщики Афиши")).toHaveAttribute(
      "href",
      "/files/afisha-suppliers.docx",
    );
    expect(screen.getByLabelText("Открыть главную страницу")).toHaveAttribute("href", "/home");
  });
});

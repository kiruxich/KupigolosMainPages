import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProjectIndexPage from "../../app/page";

describe("project index", () => {
  it("renders the four projects in order with stable destinations", () => {
    render(<ProjectIndexPage />);

    expect(screen.getAllByRole("heading", { level: 2 }).map(({ textContent }) => textContent)).toEqual([
      "Поставщики Афиши",
      "Озвучка",
      "Главная страница",
      "6 страниц",
    ]);
    expect(screen.getByLabelText("Открыть файл Поставщики Афиши")).toHaveAttribute(
      "href",
      "/files/afisha-suppliers.docx",
    );
    expect(screen.getByLabelText("Открыть главную страницу")).toHaveAttribute("href", "/home");
    expect(screen.getByLabelText("Открыть проект 6 страниц")).toHaveAttribute("href", "/six-pages");
  });
});


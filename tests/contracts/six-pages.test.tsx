import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SixPagesPage from "../../app/six-pages/page";

describe("six pages route", () => {
  it("renders the placeholder and back navigation", () => {
    render(<SixPagesPage />);
    expect(screen.getByRole("heading", { name: "6 страниц" })).toBeVisible();
    expect(screen.getByRole("link", { name: /К проектам/ })).toHaveAttribute("href", "/");
    expect(screen.getByText("Пока здесь пусто.")).toBeVisible();
  });
});


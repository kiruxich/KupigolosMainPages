import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { StatusSelect } from "./status-select";

describe("StatusSelect", () => {
  beforeEach(() => localStorage.clear());

  it("restores and saves a project status", async () => {
    localStorage.setItem("kupigolos-project-status:homepage", "deferred");
    render(<StatusSelect projectId="homepage" defaultStatus="completed" />);

    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("deferred");

    await userEvent.selectOptions(select, "in-progress");
    expect(localStorage.getItem("kupigolos-project-status:homepage")).toBe("in-progress");
  });
});


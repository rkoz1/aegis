import { test, expect } from "@playwright/test";

test("shell renders with brand and a Persona-scoped Function in nav", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Aegis/);
  await expect(page.getByRole("link", { name: "Portfolio Snapshot" })).toBeVisible();
});

test("selecting a portfolio updates the global context chip", async ({ page }) => {
  await page.goto("/portfolio-snapshot");
  await page
    .getByRole("button", { name: /Smith Family Trust — Balanced/ })
    .click();
  await expect(page.getByText(/Context:/)).toBeVisible();
});

test("switching persona changes nav visibility", async ({ page }) => {
  await page.goto("/");
  // Persona is a shadcn Select (Radix combobox), not a native <select>.
  await page.getByRole("combobox", { name: "Persona" }).click();
  await page.getByRole("option", { name: "Compliance Officer" }).click();
  await expect(page.getByRole("link", { name: "Compliance Checks" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Portfolio Snapshot" }),
  ).toHaveCount(0);
});

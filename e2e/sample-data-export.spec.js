import { test, expect } from "@playwright/test";

test.describe("Generate Sample Data", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/editor/templates/blank");
    await page.waitForLoadState("networkidle");
  });

  test("Sample data option appears in File Export as menu", async ({
    page,
  }) => {
    await page.getByText("File").first().click();
    await page.getByText("Export as").hover();
    await expect(page.getByText("Sample data")).toBeVisible();
  });

  test("Sample data export generates SQL INSERT statements", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /add table/i }).click();
    await page.waitForTimeout(500);

    await page.getByText("File").first().click();
    await page.getByText("Sample data").click();
    await page.waitForTimeout(500);

    const codeEditor = page.locator(".monaco-editor, [class*='code'], textarea");
    const content = await page.locator("textarea, [contenteditable=true]").first().inputValue().catch(() => "");
    const pageContent = await page.content();

    expect(
      pageContent.includes("INSERT INTO") || content.includes("INSERT INTO"),
    ).toBeTruthy();
  });

  test("Empty diagram shows no tables message when exporting sample data", async ({
    page,
  }) => {
    await page.getByText("File").first().click();
    await page.getByText("Sample data").click();
    await page.waitForTimeout(500);

    const pageContent = await page.content();
    const hasNoTablesMessage =
      pageContent.includes("No tables") ||
      pageContent.includes("no tables") ||
      pageContent.includes("generate sample");

    expect(hasNoTablesMessage || pageContent.trim().length < 100).toBeTruthy();
  });
});

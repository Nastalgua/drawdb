import { test, expect } from "@playwright/test";

test.describe("Delete All Fields", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/editor/templates/blank");
    await page.waitForLoadState("networkidle");
  });

  test("Delete all fields button appears in table more options menu", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /add table/i }).click();
    await page.waitForTimeout(500);

    const table = page.locator('[class*="group"]').filter({ hasText: /table_/ }).first();
    await table.hover();

    const moreButton = page.getByRole("button").filter({ has: page.locator("svg") }).nth(2);
    await moreButton.click();

    await expect(page.getByText("Delete all fields")).toBeVisible();
  });

  test("Delete all fields removes all fields from table", async ({ page }) => {
    await page.getByRole("button", { name: /add table/i }).click();
    await page.waitForTimeout(500);

    const table = page.locator('[class*="group"]').filter({ hasText: /table_/ }).first();
    await table.dblclick();
    await page.waitForTimeout(300);

    const addFieldButton = page.getByRole("button", { name: /add field/i }).first();
    if (await addFieldButton.isVisible()) {
      await addFieldButton.click();
      await page.waitForTimeout(200);
    }

    await page.keyboard.press("Escape");
    await page.waitForTimeout(200);

    await table.hover();
    const moreButton = page.getByRole("button").filter({ has: page.locator("svg") }).nth(2);
    await moreButton.click();

    await page.getByText("Delete all fields").click();
    await page.waitForTimeout(300);

    const fieldRows = page.locator('[class*="border-b"][class*="border-gray"]');
    await expect(fieldRows).toHaveCount(0);
  });

  test("Delete all fields is disabled when table has no fields", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /add table/i }).click();
    await page.waitForTimeout(500);

    const table = page.locator('[class*="group"]').filter({ hasText: /table_/ }).first();
    await table.hover();
    const moreButton = page.getByRole("button").filter({ has: page.locator("svg") }).nth(2);
    await moreButton.click();
    await page.getByText("Delete all fields").click();
    await page.waitForTimeout(300);

    await table.hover();
    await moreButton.click();
    const deleteAllButton = page.getByRole("button", { name: /delete all fields/i });
    await expect(deleteAllButton).toBeDisabled();
  });
});

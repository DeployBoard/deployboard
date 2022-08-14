import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

test("login test", async ({ page }) => {
  // Go to login page
  await page.goto(`${process.env.CHECK_BASE_URL}/login`);
  // Click [placeholder="Email"]
  await page.locator('[placeholder="Email"]').click();
  // Fill [placeholder="Email"]
  await page.locator('[placeholder="Email"]').fill(process.env.CHECK_EMAIL);
  // Press Tab
  await page.locator('[placeholder="Email"]').press("Tab");
  // Fill [placeholder="Password"]
  await page
    .locator('[placeholder="Password"]')
    .fill(process.env.CHECK_PASSWORD);
  // Click text=Submit
  await page.locator("text=Submit").click();
  await expect(page).toHaveURL(`${process.env.CHECK_BASE_URL}/dashboard`);
  // Click #root >> text=ci
  await page.locator("#root >> text=ci").click();
  await expect(page).toHaveURL(`${process.env.CHECK_BASE_URL}/ci`);
  // Click #root >> text=catalog
  await page.locator("#root >> text=catalog").click();
  await expect(page).toHaveURL(`${process.env.CHECK_BASE_URL}/catalog`);
  // Click #root >> text=logs
  await page.locator("#root >> text=logs").click();
  await expect(page).toHaveURL(`${process.env.CHECK_BASE_URL}/logs`);
  // Click #root >> text=analytics
  await page.locator("#root >> text=analytics").click();
  await expect(page).toHaveURL(`${process.env.CHECK_BASE_URL}/analytics`);
  // Click [aria-label="Open settings"]
  await page.locator('[aria-label="Open settings"]').click();
  // Click text=logout
  await page.locator("text=logout").click();
  await expect(page).toHaveURL(
    `${process.env.CHECK_BASE_URL}/login?loggedOut=true`
  );
});

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
  await expect(page.locator('h6:has-text("Dashboard")')).toBeVisible();
  // Click Catalog
  await page.locator('span:has-text("Catalog")').click();
  await expect(page).toHaveURL(`${process.env.CHECK_BASE_URL}/catalog`);
  await expect(page.locator('h6:has-text("Catalog")')).toBeVisible();
  await expect(page.locator("text=Services")).toBeVisible();
  await expect(page.locator("text=Teams")).toBeVisible();
  // Click Logs
  await page.locator('span:has-text("Logs")').click();
  await expect(page).toHaveURL(`${process.env.CHECK_BASE_URL}/logs`);
  await expect(page.locator('h6:has-text("Logs")')).toBeVisible();
  // Click Analytics
  await page.locator('span:has-text("Analytics")').click();
  await expect(page).toHaveURL(`${process.env.CHECK_BASE_URL}/analytics`);
  await expect(page.locator('h6:has-text("Analytics")')).toBeVisible();
  // Click Users
  await page.locator('span:has-text("Users")').click();
  await expect(page).toHaveURL(`${process.env.CHECK_BASE_URL}/account/users`);
  await expect(page.locator('h6:has-text("Users")')).toBeVisible();
  // Click ApiKeys
  await page.locator('span:has-text("ApiKeys")').click();
  await expect(page).toHaveURL(`${process.env.CHECK_BASE_URL}/account/apikeys`);
  await expect(page.locator('h6:has-text("Api Keys")')).toBeVisible();
  // Click SSO
  await page.locator('span:has-text("SSO")').click();
  await expect(page).toHaveURL(`${process.env.CHECK_BASE_URL}/account/sso`);
  await expect(page.locator('h6:has-text("SSO Config")')).toBeVisible();
  // Click text=logout
  await page.locator('span:has-text("Log Out")').click();
  await expect(page).toHaveURL(
    `${process.env.CHECK_BASE_URL}/login?loggedOut=true`
  );
});

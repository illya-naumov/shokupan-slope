// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Order Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/order.html');
    });

    test('starts in locked state', async ({ page }) => {
        await expect(page.locator('#order-locked')).toBeVisible();
        await expect(page.locator('#order-unlocked')).toBeHidden();
    });

    test('incorrect password shows error', async ({ page }) => {
        await page.locator('#password-input').fill('wrongpass');
        await page.getByRole('button', { name: 'Unlock' }).click();
        await expect(page.locator('#password-error')).toBeVisible();
        await expect(page.locator('#order-unlocked')).toBeHidden();
    });

    test('correct password unlocks form', async ({ page }) => {
        await page.locator('#password-input').fill('shokupan2026');
        await page.getByRole('button', { name: 'Unlock' }).click();

        await expect(page.locator('#order-locked')).toBeHidden();
        await expect(page.locator('#order-unlocked')).toBeVisible();

        // Check for product
        await expect(page.getByText('Classic Shokupan')).toBeVisible();
        await expect(page.getByLabel('Name')).toBeVisible();
    });
});

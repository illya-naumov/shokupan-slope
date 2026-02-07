// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('has correct title', async ({ page }) => {
        await expect(page).toHaveTitle(/Shokupan Slope/);
    });

    test('hero section is visible', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'The Softest Bread in South Slope' })).toBeVisible();
        await expect(page.locator('.hero-image')).toBeVisible();
    });

    test('waitlist form validation', async ({ page }) => {
        // Attempt to submit empty
        await page.getByRole('button', { name: 'Join Waitlist' }).click();

        // Check built-in HTML5 validation (browser dependent, but we check if invalid)
        const emailInput = page.locator('#email');
        const validity = await emailInput.evaluate((e) => {
            const input = /** @type {HTMLInputElement} */ (e);
            return input.checkValidity();
        });
        expect(validity).toBeFalsy();
    });

    test('waitlist form success flow', async ({ page }) => {
        await page.locator('#email').fill('test@example.com');
        await page.getByRole('button', { name: 'Join Waitlist' }).click();

        // Expect button to change to success state
        await expect(page.locator('#submit-btn')).toHaveClass(/success/);
        await expect(page.locator('#submit-btn')).toContainText('Joined!');
    });
});

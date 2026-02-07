// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Responsive Layout', () => {

    test('Mobile: Hero description is centered', async ({ page }) => {
        // Set viewport to iPhone 12/13 size
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto('/');

        const description = page.locator('.description');

        // Check if margin is auto (centering)
        const margin = await description.evaluate((el) => {
            return window.getComputedStyle(el).margin;
        });

        // Basic check: we expect "0px auto" or similar. 
        // Easier check: Get bounding box and see if centered relative to viewport
        const box = await description.boundingBox();
        const viewport = page.viewportSize();

        if (!box || !viewport) throw new Error("Viewport or box missing");

        const centerX = box.x + box.width / 2;
        const viewportCenter = viewport.width / 2;

        // Allow 1px tolerance
        expect(Math.abs(centerX - viewportCenter)).toBeLessThan(2);
    });

    test('Mobile: Order page locked container has padding', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto('/order.html');

        const container = page.locator('.locked-container');
        const padding = await container.evaluate((el) => {
            return window.getComputedStyle(el).padding;
        });

        // We set it to 2rem !important; 2rem is usually 32px.
        // Computed style usually returns px values.
        expect(padding).toBe('32px');
    });
});

import { test, expect } from '@playwright/test';

test.describe('Virtuoso-8 Practice Flow', () => {
    test('complete onboarding and start practice session', async ({ page }) => {
        await page.goto('/');

        // Wait for onboarding screen
        await expect(page.getByText('Virtuoso 8')).toBeVisible();
        await expect(page.getByText('Grade 8 Violin Scale Trainer')).toBeVisible();

        // Fill in name and start
        await page.getByPlaceholder('What should we call you?').fill('Test Student');
        await page.getByRole('button', { name: 'Start Practicing' }).click();

        // Should reach dashboard
        await expect(page.getByText('Hi, Test Student')).toBeVisible();
        await expect(page.getByText('Syllabus Coverage')).toBeVisible();
        await expect(page.getByText('0 / 42 items mastered')).toBeVisible();

        // Start a session
        await page.getByRole('button', { name: /Start Session/i }).click();

        // Should see session view with question
        await expect(page.getByText('QUESTION 1 / 4')).toBeVisible();
        await expect(page.getByText('BOWING TECHNIQUE')).toBeVisible();

        // Should see count-in button
        const countInButton = page.getByRole('button', { name: /Start Count-In/i });
        await expect(countInButton).toBeVisible();
    });

    test('complete full practice session', async ({ page }) => {
        await page.goto('/');

        // Quick onboarding
        await page.getByPlaceholder('What should we call you?').fill('Quick Test');
        await page.getByRole('button', { name: 'Start Practicing' }).click();
        await page.getByRole('button', { name: /Start Session/i }).click();

        // Complete 4 questions
        for (let i = 1; i <= 4; i++) {
            await expect(page.getByText(`QUESTION ${i} / 4`)).toBeVisible();

            // Click count-in button
            await page.getByRole('button', { name: /Start Count-In/i }).click();

            // Wait for metronome to complete (should show rating after ~5 seconds)
            await expect(page.getByText('Performance Complete')).toBeVisible({ timeout: 10000 });

            // Rate the performance
            const stars = page.getByRole('button').filter({ has: page.locator('svg') });
            await stars.nth(3).click(); // Click 4th star

            // Click next
            await page.getByRole('button', { name: /Next Question/i }).click();
        }

        // Should see completion screen
        await expect(page.getByText('Session Complete!')).toBeVisible();
        await expect(page.getByText('Excellent work')).toBeVisible();

        // Return to dashboard
        await page.getByRole('button', { name: /Back to Dashboard/i }).click();
        await expect(page.getByText('Hi, Quick Test')).toBeVisible();
    });

    test('navigate to review screen', async ({ page }) => {
        await page.goto('/');

        await page.getByPlaceholder('What should we call you?').fill('Review Test');
        await page.getByRole('button', { name: 'Start Practicing' }).click();

        // Click Review button
        await page.getByRole('button', { name: /Review/i }).click();

        // Should see review screen
        await expect(page.getByText('Progress Review')).toBeVisible();
        await expect(page.getByText('SCALES')).toBeVisible();
        await expect(page.getByText('ARPEGGIOS')).toBeVisible();
    });
});

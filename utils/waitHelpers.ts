import { Page } from '@playwright/test';

export async function waitForNetworkIdle(page: Page, timeout = 2000) {
  await page.waitForLoadState('networkidle', { timeout });
}

export async function waitForUrl(page: Page, urlPattern: string | RegExp, timeout = 5000) {
  await page.waitForURL(urlPattern, { timeout });
}

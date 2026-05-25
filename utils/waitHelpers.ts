import { Page } from '@playwright/test';

export async function waitForNetworkIdle(page: Page, timeout = 2000) {
  await page.waitForLoadState('networkidle', { timeout });
}

export async function waitForUrl(page: Page, urlPattern: string | RegExp, timeout = 5000) {
  await page.waitForURL(urlPattern, { timeout });
}

export async function waitForWooAjax(page: Page, timeout = 15000) {
  await page.waitForResponse(
    r => r.url().includes('wc-ajax=get_refreshed_fragments') && r.status() === 200,
    { timeout }
  );
}

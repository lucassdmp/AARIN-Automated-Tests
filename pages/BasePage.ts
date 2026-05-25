import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  readonly headerCartCount: Locator;
  readonly headerWelcome: Locator;

  constructor(protected page: Page) {
    this.headerCartCount = page.locator('#cart .mini-cart-items');
    this.headerWelcome = page.locator('ul.acount .hidden-xs');
  }

  async navigate(path = '') {
    await this.page.goto(path);
  }

  async getTitle() {
    return this.page.title();
  }
}

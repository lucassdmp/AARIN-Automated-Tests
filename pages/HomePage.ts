import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly productCards: Locator;

  constructor(page: Page) {
    super(page);
    this.productCards = page.locator('.products-grid .product-block');
  }

  async goto() {
    await this.navigate('/');
  }

  async selectProductByIndex(index = 0) {
    await this.productCards.nth(index).locator('h3.name a').click();
  }

  async selectProductByName(name: string) {
    await this.page
      .locator('.products-grid .product-block')
      .filter({ has: this.page.locator('h3.name a', { hasText: name }) })
      .locator('h3.name a')
      .click();
  }
}

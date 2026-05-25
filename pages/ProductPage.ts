import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface ProductVariation {
  size?: string;
  color?: string;
}

export class ProductPage extends BasePage {
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly addToCartButton: Locator;
  readonly quantityInput: Locator;
  readonly viewCartLink: Locator;
  readonly successNotice: Locator;
  readonly variationsForm: Locator;

  constructor(page: Page) {
    super(page);
    this.productTitle = page.locator('.product_title');
    this.productPrice = page.locator('.price').first();
    this.addToCartButton = page.locator('.single_add_to_cart_button');
    this.quantityInput = page.locator('input.qty');
    this.viewCartLink = page.locator('.woocommerce-message a.wc-forward');
    this.successNotice = page.locator('.woocommerce-message');
    this.variationsForm = page.locator('.variations_form');
  }

  async isVariableProduct(): Promise<boolean> {
    return this.variationsForm.isVisible();
  }

  async selectVariation(attributeName: string, value: string) {
    const wrapper = this.page.locator(
      `ul.variable-items-wrapper[data-attribute_name="attribute_${attributeName}"]`
    );
    await wrapper.waitFor({ state: 'visible' });
    const swatch = wrapper.locator(`li[data-value="${value}"]`);
    await swatch.scrollIntoViewIfNeeded();
    await swatch.click();
  }

  async selectVariations(variations: ProductVariation) {
    await this.page.waitForSelector('.variations_form.wvs-loaded');
    if (variations.size) await this.selectVariation('size', variations.size);
    if (variations.color) await this.selectVariation('color', variations.color);
  }

  async setQuantity(qty: number) {
    await this.quantityInput.fill(String(qty));
  }

  async addToCart(variations: ProductVariation) {
    await this.selectVariations(variations);
    
    await this.page.waitForFunction(
      () => !(document.querySelector('.single_add_to_cart_button') as HTMLButtonElement)?.disabled
    );
    await this.addToCartButton.click();
    await this.successNotice.waitFor({ state: 'visible' });
  }

  async goToCart() {
    await this.viewCartLink.click();
  }
}

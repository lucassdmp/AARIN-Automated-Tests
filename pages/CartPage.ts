import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { waitForNetworkIdle, waitForUrl } from '../utils/waitHelpers';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly quantityInput: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly cartTotals: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('.woocommerce-cart-form .cart_item');
    this.quantityInput = page.locator('.woocommerce-cart-form input[type="number"].qty');
    this.proceedToCheckoutButton = page.locator('.checkout-button');
    this.cartTotals = page.locator('.cart_totals');
    this.emptyCartMessage = page.locator('.cart-empty');
  }

  async goto() {
    await this.navigate('/carrinho');
  }

  async updateItemQuantity(qty: number, itemIndex = 0) {
    const input = this.quantityInput.nth(itemIndex);
    await input.fill(String(qty));
    await input.dispatchEvent('change');
    await waitForNetworkIdle(this.page);
  }

  async updateItemQuantityByName(productName: string, qty: number) {
    const input = this.cartItems.filter({ hasText: productName }).locator('input[type="number"].qty');
    await input.fill(String(qty));
    await input.dispatchEvent('change');
    await waitForNetworkIdle(this.page);
  }

  async getItemQuantity(itemIndex = 0): Promise<number> {
    const value = await this.quantityInput.nth(itemIndex).inputValue();
    return parseInt(value, 10);
  }

  async proceedToCheckout() {
    const navigation = waitForUrl(this.page, /checkout/);
    await this.proceedToCheckoutButton.click();
    await navigation;
  }
}

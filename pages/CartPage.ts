import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly quantityInput: Locator;
  readonly plusButton: Locator;
  readonly minusButton: Locator;
  readonly updateCartButton: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly cartTotals: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('.woocommerce-cart-form .cart_item');
    this.quantityInput = page.locator('.woocommerce-cart-form input[type="number"].qty');
    this.plusButton = page.locator('.woocommerce-cart-form .quantity input.plus');
    this.minusButton = page.locator('.woocommerce-cart-form .quantity input.minus');
    this.updateCartButton = page.locator('input[name="update_cart"]');
    this.proceedToCheckoutButton = page.locator('.checkout-button');
    this.cartTotals = page.locator('.cart_totals');
    this.emptyCartMessage = page.locator('.cart-empty');
  }

  async goto() {
    await this.navigate('/carrinho');
  }

  async updateItemQuantity(qty: number, itemIndex = 0) {
    await this.quantityInput.nth(itemIndex).fill(String(qty));
    await this.updateCartButton.click({ force: true });
    await this.page.waitForLoadState('load');
  }

  async updateItemQuantityByName(productName: string, qty: number) {
    const input = this.cartItems.filter({ hasText: productName }).locator('input[type="number"].qty');
    await input.fill(String(qty));
    await this.updateCartButton.click({ force: true });
    await this.page.waitForLoadState('load');
  }

  async incrementQuantity(itemIndex = 0) {
    const before = parseInt(await this.quantityInput.nth(itemIndex).inputValue());
    await this.plusButton.nth(itemIndex).click({ force: true });
    await this.page.locator(`input.qty[value="${before + 1}"]`).waitFor({ state: 'visible' });
  }

  async decrementQuantity(itemIndex = 0) {
    const before = parseInt(await this.quantityInput.nth(itemIndex).inputValue());
    await this.minusButton.nth(itemIndex).click({ force: true });
    await this.page.locator(`input.qty[value="${before - 1}"]`).waitFor({ state: 'visible' });
  }

  async getItemQuantity(itemIndex = 0): Promise<number> {
    const value = await this.quantityInput.nth(itemIndex).inputValue();
    return parseInt(value, 10);
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutButton.click();
    await this.page.waitForLoadState('load');
  }
}

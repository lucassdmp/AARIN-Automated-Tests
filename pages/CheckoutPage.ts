import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export enum PaymentMethod {
  BankTransfer = 'bacs',
  Cheque = 'cheque',
  CashOnDelivery = 'cod',
}

export interface BillingDetails {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  email: string;
  paymentMethod?: PaymentMethod;
}

export class CheckoutPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateSelect: Locator;
  readonly postcodeInput: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;
  readonly placeOrderButton: Locator;
  readonly paymentMethods: Locator;
  readonly termsCheckbox: Locator;
  readonly createAccountCheckbox: Locator;
  readonly accountPasswordInput: Locator;
  readonly orderSuccessNotice: Locator;
  readonly orderNumber: Locator;
  readonly orderPaymentMethod: Locator;
  readonly checkoutError: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('#billing_first_name');
    this.lastNameInput = page.locator('#billing_last_name');
    this.addressInput = page.locator('#billing_address_1');
    this.cityInput = page.locator('#billing_city');
    this.stateSelect = page.locator('#billing_state');
    this.postcodeInput = page.locator('#billing_postcode');
    this.phoneInput = page.locator('#billing_phone');
    this.emailInput = page.locator('#billing_email');
    this.placeOrderButton = page.locator('#place_order');
    this.paymentMethods = page.locator('.wc_payment_methods');
    this.termsCheckbox = page.locator('#terms');
    this.createAccountCheckbox = page.locator('#createaccount');
    this.accountPasswordInput = page.locator('#account_password');
    this.orderSuccessNotice = page.locator('.woocommerce-notice--success');
    this.orderNumber = page.locator('.woocommerce-order-overview__order strong');
    this.orderPaymentMethod = page.locator('.woocommerce-order-overview__payment-method strong');
    this.checkoutError = page.locator('.woocommerce-error');
  }

  async fillBillingDetails(details: BillingDetails) {
    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    await this.addressInput.fill(details.address);
    await this.cityInput.fill(details.city);
    await this.stateSelect.selectOption({ value: details.state }, { force: true });
    await this.postcodeInput.fill(details.postcode);
    await this.phoneInput.fill(details.phone);
    await this.emailInput.fill(details.email);
    if (details.paymentMethod) await this.selectPaymentMethod(details.paymentMethod);
  }

  async selectPaymentMethod(method: string) {
    await this.page.locator(`#payment_method_${method}`).check();
  }

  async acceptTerms() {
    await this.termsCheckbox.check();
  }

  async enableCreateAccount(password: string) {
    await this.createAccountCheckbox.check();
    await this.accountPasswordInput.waitFor({ state: 'visible' });
    await this.accountPasswordInput.fill(password);
  }

  async placeOrder() {
    await this.placeOrderButton.click();
    await this.orderSuccessNotice.waitFor({ state: 'visible' });
  }

  async getOrderNumber(): Promise<string> {
    return this.orderNumber.innerText();
  }

  async isOnCheckoutPage(): Promise<boolean> {
    return this.page.url().includes('checkout');
  }

  async isOrderConfirmed(): Promise<boolean> {
    return this.orderSuccessNotice.isVisible();
  }
}

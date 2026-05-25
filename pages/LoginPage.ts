import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly registerEmailInput: Locator;
  readonly registerPasswordInput: Locator;
  readonly registerButton: Locator;
  readonly formError: Locator;
  readonly accountNav: Locator;
  readonly accountWelcome: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('form.woocommerce-form-login #password');
    this.loginButton = page.locator('input[name="login"]');
    this.registerEmailInput = page.locator('#reg_email');
    this.registerPasswordInput = page.locator('#reg_password');
    this.registerButton = page.locator('input[name="register"]');
    this.formError = page.locator('.woocommerce-error');
    this.accountNav = page.locator('.woocommerce-MyAccount-navigation');
    this.accountWelcome = page.locator('.woocommerce-MyAccount-content p strong').first();
  }

  async goto() {
    await this.navigate('/minha-conta/');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await Promise.all([
      this.page.waitForLoadState('load'),
      this.loginButton.click(),
    ]);
  }

  async register(email: string, password: string) {
    await this.registerEmailInput.fill(email);
    await this.registerPasswordInput.fill(password);
    await Promise.all([
      this.page.waitForLoadState('load'),
      this.registerButton.click(),
    ]);
  }

  async isLoggedIn(): Promise<boolean> {
    return this.headerWelcome.isVisible();
  }
}

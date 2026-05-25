import { test, expect } from '../utils/fixtures';
import { billingDetails, defaultVariation } from '../utils/testData';
import { generateEmail, generatePassword } from '../utils/randomData';

test.describe('EBAC Shop - Fluxo de Compra', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('CT-01: Deve exibir produtos na vitrine da página inicial', async ({ homePage }) => {
    await expect(homePage.productCards.first()).toBeVisible();
    const count = await homePage.productCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('CT-02: Deve adicionar produto ao carrinho a partir da vitrine', async ({
    homePage,
    productPage,
  }) => {
    await homePage.selectProductByIndex(0);
    await expect(productPage.productTitle).toBeVisible();
    const productName = await productPage.productTitle.innerText();

    await productPage.addToCart(defaultVariation);

    await expect(productPage.successNotice).toBeVisible();
    await expect(productPage.successNotice).toContainText(productName);
  });

  test('CT-03: Deve refletir item adicionado no carrinho', async ({
    homePage,
    productPage,
    cartPage,
  }) => {
    await homePage.selectProductByIndex(0);
    await productPage.addToCart(defaultVariation);
    await productPage.goToCart();

    await expect(cartPage.cartItems.first()).toBeVisible();
    await expect(cartPage.proceedToCheckoutButton).toBeVisible();
  });

  test('CT-04: Deve permitir alterar a quantidade do item no carrinho', async ({
    homePage,
    productPage,
    cartPage,
  }) => {
    await homePage.selectProductByIndex(0);
    await productPage.addToCart(defaultVariation);
    await productPage.goToCart();

    await cartPage.updateItemQuantity(3);

    const qty = await cartPage.getItemQuantity();
    expect(qty).toBe(3);
  });

  test('CT-05: Deve navegar para o checkout a partir do carrinho', async ({
    homePage,
    productPage,
    cartPage,
    checkoutPage,
  }) => {
    await homePage.selectProductByIndex(0);
    await productPage.addToCart(defaultVariation);
    await productPage.goToCart();
    await cartPage.proceedToCheckout();

    expect(await checkoutPage.isOnCheckoutPage()).toBeTruthy();
    await expect(checkoutPage.placeOrderButton).toBeVisible();
  });

  test('CT-06: Fluxo completo de compra end-to-end', async ({
    homePage,
    productPage,
    cartPage,
    checkoutPage,
  }) => {
    await expect(homePage.productCards.first()).toBeVisible();

    await homePage.selectProductByIndex(0);
    await expect(productPage.productTitle).toBeVisible();

    await productPage.addToCart(defaultVariation);
    await expect(productPage.successNotice).toBeVisible();

    await productPage.goToCart();
    await expect(cartPage.cartItems.first()).toBeVisible();

    await cartPage.updateItemQuantity(2);
    expect(await cartPage.getItemQuantity()).toBe(2);

    await cartPage.proceedToCheckout();
    expect(await checkoutPage.isOnCheckoutPage()).toBeTruthy();

    await checkoutPage.fillBillingDetails(billingDetails);
    await checkoutPage.acceptTerms();
    await checkoutPage.placeOrder();

    expect(await checkoutPage.isOrderConfirmed()).toBeTruthy();
    const orderNumber = await checkoutPage.getOrderNumber();
    expect(orderNumber).toBeTruthy();
    await expect(checkoutPage.orderPaymentMethod).toContainText('Pagamento na entrega');
  });

  test('CT-07: Fluxo completo de compra end-to-end com criação de conta', async ({
    homePage,
    productPage,
    cartPage,
    checkoutPage,
  }) => {
    const email = generateEmail();
    const password = generatePassword();

    await homePage.selectProductByIndex(0);
    await productPage.addToCart(defaultVariation);
    await productPage.goToCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillBillingDetails({ ...billingDetails, email });
    await checkoutPage.enableCreateAccount(password);
    await checkoutPage.acceptTerms();
    await checkoutPage.placeOrder();

    expect(await checkoutPage.isOrderConfirmed()).toBeTruthy();
    const orderNumber = await checkoutPage.getOrderNumber();
    expect(orderNumber).toBeTruthy();
    await expect(checkoutPage.headerWelcome).toContainText(billingDetails.firstName);
  });

  test('CT-08: Deve atualizar o contador do carrinho no header após adicionar produto', async ({
    homePage,
    productPage,
  }) => {
    await homePage.selectProductByIndex(0);
    await productPage.addToCart(defaultVariation);

    await expect(productPage.headerCartCount).not.toHaveText(' 0 ');
    const count = await productPage.headerCartCount.innerText();
    expect(parseInt(count.trim())).toBeGreaterThan(0);
  });
});

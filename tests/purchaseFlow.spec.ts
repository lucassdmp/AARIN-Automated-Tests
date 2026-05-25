import { test, expect } from '../utils/fixtures';
import { billingDetails } from '../fixtures/billingDetails';
import { existingAccountDetails, existingAccountPassword } from '../fixtures/existingAccount';
import { defaultVariation, outOfStockVariation } from '../fixtures/productVariation';
import { generateEmail, generatePassword } from '../utils/randomData';

test.describe('EBAC Shop - Fluxo de Compra', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('CT-01: Dado que a loja está acessível, quando o usuário acessa a página inicial, então os produtos devem ser exibidos na vitrine', async ({ homePage }) => {
    await expect(homePage.productCards.first()).toBeVisible();
    const count = await homePage.productCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('CT-02: Dado que o usuário seleciona um produto, quando adiciona ao carrinho, então a mensagem de confirmação deve conter o nome do produto', async ({
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

  test('CT-03: Dado que um produto foi adicionado ao carrinho, quando o usuário acessa o carrinho, então o item deve aparecer na listagem', async ({
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

  test('CT-04: Dado que há um item no carrinho, quando a quantidade é alterada, então o carrinho deve refletir a nova quantidade', async ({
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

  test('CT-05: Dado que há itens no carrinho, quando o usuário clica em concluir compra, então deve ser redirecionado para a página de checkout', async ({
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

  test('CT-06: Dado que o usuário preencheu os dados e aceitou os termos, quando finaliza o pedido como convidado, então deve ver a confirmação com número do pedido', async ({
    homePage,
    productPage,
    cartPage,
    checkoutPage,
  }) => {
    await homePage.selectProductByIndex(0);
    await productPage.addToCart(defaultVariation);
    await productPage.goToCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillBillingDetails({ ...billingDetails});
    await checkoutPage.acceptTerms();
    await checkoutPage.placeOrder();

    expect(await checkoutPage.isOrderConfirmed()).toBeTruthy();
    const orderNumber = await checkoutPage.getOrderNumber();
    expect(orderNumber).toBeTruthy();
  });

  test('CT-07: Dado que o usuário não tem conta, quando finaliza o pedido criando uma conta, então deve ser redirecionado para o painel logado', async ({
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

  test('CT-08: Dado que o e-mail já está cadastrado, quando tenta criar conta no checkout, então deve ver mensagem de e-mail já registrado', async ({
    homePage,
    productPage,
    cartPage,
    checkoutPage,
  }) => {
    await homePage.selectProductByIndex(0);
    await productPage.addToCart(defaultVariation);
    await productPage.goToCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillBillingDetails(existingAccountDetails);
    await checkoutPage.enableCreateAccount(existingAccountPassword);
    await checkoutPage.acceptTerms();
    await checkoutPage.placeOrderButton.click();

    await expect(checkoutPage.checkoutError).toBeVisible();
    await expect(checkoutPage.checkoutError).toContainText('Uma conta já está registrada com seu endereço de e-mail.');
  });

  test('CT-09: Dado que um produto foi adicionado ao carrinho, quando o usuário visualiza o site, então o contador do header deve refletir os itens adicionados', async ({
    homePage,
    productPage,
  }) => {
    await homePage.selectProductByIndex(0);
    await productPage.addToCart(defaultVariation);

    await expect(productPage.headerCartCount).not.toHaveText(' 0 ');
    const count = await productPage.headerCartCount.innerText();
    expect(parseInt(count.trim())).toBeGreaterThan(0);
  });

  test('CT-10: Dado que uma variação está fora de estoque, quando o usuário a seleciona, então deve ver a mensagem de fora de estoque', async ({
    homePage,
    productPage,
  }) => {
    await homePage.selectProductByIndex(0);
    await productPage.selectVariations(outOfStockVariation);

    await expect(productPage.stockAvailability).toBeVisible();
    await expect(productPage.stockAvailability).toHaveClass(/out-of-stock/);
    await expect(productPage.stockAvailability).toContainText('Fora de estoque');
    await expect(productPage.addToCartButton).toHaveClass(/wc-variation-is-unavailable/);
  });

  test('CT-11: Dado que uma variação está em estoque, quando o usuário adiciona exatamente o limite disponível, então o produto deve ser adicionado ao carrinho', async ({
    homePage,
    productPage,
  }) => {
    await homePage.selectProductByIndex(0);
    await productPage.selectVariations(defaultVariation);

    await expect(productPage.stockAvailability).toBeVisible();
    const stockText = await productPage.stockAvailability.innerText();
    const stockLimit = parseInt(stockText);

    await productPage.setQuantity(stockLimit);
    await expect(productPage.addToCartButton).not.toHaveClass(/disabled/);
    await productPage.addToCartButton.click();

    await expect(productPage.successNotice).toBeVisible();
  });

  test('CT-12: Dado que uma variação está em estoque, quando o usuário informa uma quantidade acima do limite disponível, então o formulário deve rejeitar a quantidade', async ({
    homePage,
    productPage,
  }) => {
    await homePage.selectProductByIndex(0);
    await productPage.selectVariations(defaultVariation);

    await expect(productPage.stockAvailability).toBeVisible();
    const stockText = await productPage.stockAvailability.innerText();
    const stockLimit = parseInt(stockText);

    await productPage.setQuantity(stockLimit + 1);

    const isInvalid = await productPage.quantityInput.evaluate(
      (el: HTMLInputElement) => !el.checkValidity()
    );
    expect(isInvalid).toBeTruthy();
  });

  test('CT-13: Dado que há um item no carrinho, quando o usuário clica no botão de aumentar quantidade, então o carrinho deve refletir a quantidade incrementada', async ({
    homePage,
    productPage,
    cartPage,
  }) => {
    await homePage.selectProductByIndex(0);
    await productPage.addToCart(defaultVariation);
    await productPage.goToCart();

    await cartPage.updateItemQuantity(3);

    const before = await cartPage.getItemQuantity();
    await cartPage.incrementQuantity();

    const after = await cartPage.getItemQuantity();
    expect(after).toBe(before + 1);
  });

  test('CT-14: Dado que há um item no carrinho com quantidade maior que um, quando o usuário clica no botão de diminuir quantidade, então o carrinho deve refletir a quantidade decrementada', async ({
    homePage,
    productPage,
    cartPage,
  }) => {
    await homePage.selectProductByIndex(0);
    await productPage.addToCart(defaultVariation);
    await productPage.goToCart();

    await cartPage.updateItemQuantity(3);

    const before = await cartPage.getItemQuantity();
    await cartPage.decrementQuantity();

    const after = await cartPage.getItemQuantity();
    expect(after).toBe(before - 1);
  });
});

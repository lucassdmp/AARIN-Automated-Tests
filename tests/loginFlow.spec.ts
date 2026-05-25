import { test, expect } from '../utils/fixtures';
import { existingAccountDetails, existingAccountPassword } from '../fixtures/existingAccount';
import { generateEmail, generatePassword } from '../utils/randomData';

test.describe('EBAC Shop - Fluxo de Login e Registro', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('CT-01: Dado que o usuário tem uma conta, quando faz login com credenciais válidas, então deve ver o painel da conta', async ({ loginPage }) => {
    await loginPage.login(existingAccountDetails.email, existingAccountPassword);

    await expect(loginPage.accountNav).toBeVisible();
    await expect(loginPage.accountWelcome).toContainText(existingAccountDetails.firstName);
  });

  test('CT-02: Dado que o usuário informa credenciais inválidas, quando tenta fazer login, então deve ver mensagem de erro', async ({ loginPage }) => {
    await loginPage.login('invalido@naoexiste.com', 'senhaerrada123');

    await expect(loginPage.formError).toBeVisible();
  });

  test('CT-03: Dado que o e-mail ainda não está cadastrado, quando realiza o registro, então deve ser redirecionado para o painel da conta', async ({ loginPage }) => {
    const email = generateEmail();
    const password = generatePassword();

    await loginPage.register(email, password);

    await expect(loginPage.accountNav).toBeVisible();
  });

  test('CT-04: Dado que o usuário tem uma conta, quando tenta fazer login com senha incorreta, então deve ver mensagem de erro com o e-mail informado', async ({ loginPage }) => {
    await loginPage.login(existingAccountDetails.email, 'senhaerrada123');

    await expect(loginPage.formError).toBeVisible();
    await expect(loginPage.formError).toContainText(`A senha fornecida para o e-mail ${existingAccountDetails.email} está incorreta.`);
  });

  test('CT-05: Dado que o e-mail já está cadastrado, quando tenta registrar uma nova conta, então deve ver mensagem de e-mail já registrado', async ({ loginPage }) => {
    await loginPage.register(existingAccountDetails.email, existingAccountPassword);

    await expect(loginPage.formError).toBeVisible();
    await expect(loginPage.formError).toContainText('Erro: Uma conta já está registrada com seu endereço de e-mail. Faça login.');
  });
});

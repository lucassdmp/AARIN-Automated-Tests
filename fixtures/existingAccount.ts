import { BillingDetails, PaymentMethod } from '../pages/CheckoutPage';

export const existingAccountPassword = 'Teste@12345';

export const existingAccountDetails: BillingDetails = {
  firstName: 'Teste Nome',
  lastName: 'Teste Sobrenome',
  address: 'Teste Endereço de Usuário',
  city: 'São Paulo',
  state: 'SP',
  postcode: '62906-090',
  phone: '11999999999',
  email: 'teste@email.com',
  paymentMethod: PaymentMethod.CashOnDelivery,
};

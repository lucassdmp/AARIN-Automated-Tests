import { BillingDetails, PaymentMethod } from '../types/checkout';

export const existingAccountPassword = process.env.EXISTING_ACCOUNT_PASSWORD ?? '';

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

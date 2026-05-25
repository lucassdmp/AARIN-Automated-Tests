import { BillingDetails, PaymentMethod } from '../pages/CheckoutPage';
import { ProductVariation } from '../pages/ProductPage';

export const existingAccountPassword = 'Teste@12345';

export const defaultVariation: ProductVariation = {
  size: 'M',
  color: 'Orange',
};

export const existingAccountDetails: BillingDetails = {
  firstName: 'Teste First Name',
  lastName: 'Teste Last Name',
  address: 'Rua Teste, 123',
  city: 'São Paulo',
  state: 'SP',
  postcode: '01310-100',
  phone: '11999999999',
  email: 'teste@gmail.com',
  paymentMethod: PaymentMethod.CashOnDelivery,
};

export const billingDetails: BillingDetails = {
  firstName: 'Teste First Name',
  lastName: 'Teste Last Name',
  address: 'Rua Teste, 123',
  city: 'São Paulo',
  state: 'SP',
  postcode: '01310-100',
  phone: '11999999999',
  email: 'teste_email@test.com',
  paymentMethod: PaymentMethod.CashOnDelivery,
};

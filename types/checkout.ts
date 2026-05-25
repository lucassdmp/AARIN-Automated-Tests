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

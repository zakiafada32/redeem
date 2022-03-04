export * from './auth';
export * from './inquiry';
export * from './checkout';

export interface Summary {
  name: string;
  phone: string;
  email: string;
  description: string;
  paymentLink: string;
  expiration: string;
}

export enum ResponseCode {
  RC00 = 'RC00',
  RC50 = 'RC50',
  RC51 = 'RC51',
  RC52 = 'RC52',
  RC99 = 'RC99',
}

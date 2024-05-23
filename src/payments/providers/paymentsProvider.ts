import MercadoPagoConfig, { Payment, Preference } from "mercadopago";

export const mercadoPagoConfigProvider = {
    provide: 'MercadoPagoConfig',
    useFactory: () => {
      return new MercadoPagoConfig({
        accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
        options: {
          idempotencyKey: '123',
        },
      });
    },
  };
  
  export const preferenceProvider = {
    provide: 'Preference',
    useFactory: (mercadoPagoConfig) => {
      return new Preference(mercadoPagoConfig);
    },
    inject: ['MercadoPagoConfig'],
  };
  
  export const paymentProvider = {
    provide: 'Payment',
    useFactory: (mercadoPagoConfig) => {
      return new Payment(mercadoPagoConfig);
    },
    inject: ['MercadoPagoConfig'],
  };
import { MercadoPagoConfig, Payment } from 'mercadopago';

export const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

export const payment = new Payment(client);




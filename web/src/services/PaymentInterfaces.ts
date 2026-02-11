/**
 * PaymentInterfaces
 * Definizioni standard per la gestione dei pagamenti (Stripe / RevenueCat)
 * nel codice autogenerato.
 */

export type PaymentProviderType = 'STRIPE' | 'REVENUECAT' | 'NONE';

export interface PaymentIntent {
    id: string;
    amount: number;
    currency: string;
    status: 'pending' | 'success' | 'failed';
    provider: PaymentProviderType;
}

export interface PaymentConfig {
    publicKey: string;
    secretKey?: string; // Optional for client-side
    merchantId?: string;
    environment: 'sandbox' | 'production';
}

/**
 * Interfaccia pluggabile per la gestione del checkout.
 * Il codice generato userà questa interfaccia.
 */
export interface ICheckoutService {
    processPayment: (productId: string, amount: number) => Promise<PaymentIntent>;
    isConfigured: () => boolean;
    getProvider: () => PaymentProviderType;
}

/**
 * Placeholder per il servizio di pagamento reale.
 * Da configurare manualmente dopo l'handover.
 */
export const PaymentConstants = {
    STRIPE_KEY_PLACEHOLDER: "pk_test_ADD_YOUR_STRIPE_KEY_HERE",
    REVENUECAT_ID_PLACEHOLDER: "goog_ADD_YOUR_REVENUECAT_ID_HERE",
};

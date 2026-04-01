/**
 * PayPal Payment Verification Utility
 * Handles payment verification with PayPal API
 */

interface PayPalAccessTokenResponse {
  scope: string;
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
}

interface PayPalOrderDetails {
  id: string;
  status: string;
  purchase_units?: Array<{
    amount?: {
      value: string;
      currency_code: string;
    };
  }>;
  payer?: {
    email_address?: string;
  };
}

interface VerificationResult {
  verified: boolean;
  paymentId: string;
  status: string;
  amount: string;
  currency: string;
  buyerEmail?: string;
  errorMessage?: string;
}

const PAYPAL_API_BASE = process.env.PAYPAL_MODE === 'live'
  ? 'https://api.paypal.com'
  : 'https://api.sandbox.paypal.com';

/**
 * Get PayPal access token for API calls
 */
async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
  ).toString('base64');

  try {
    const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error(`Failed to get PayPal access token: ${response.statusText}`);
    }

    const data = (await response.json()) as PayPalAccessTokenResponse;
    return data.access_token;
  } catch (error) {
    console.error('PayPal access token error:', error);
    throw new Error('Unable to authenticate with PayPal');
  }
}

/**
 * Verify PayPal order and get payment details
 */
async function verifyPayPalOrder(
  orderId: string,
  expectedAmount?: string
): Promise<VerificationResult> {
  try {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return {
        verified: false,
        paymentId: orderId,
        status: 'not_found',
        amount: '0',
        currency: 'USD',
        errorMessage: `PayPal order not found: ${response.statusText}`,
      };
    }

    const order = (await response.json()) as PayPalOrderDetails;

    // Check if payment was captured
    if (order.status !== 'COMPLETED' && order.status !== 'APPROVED') {
      return {
        verified: false,
        paymentId: orderId,
        status: order.status,
        amount: order.purchase_units?.[0]?.amount?.value || '0',
        currency: order.purchase_units?.[0]?.amount?.currency_code || 'USD',
        errorMessage: `Payment status is ${order.status}, expected COMPLETED or APPROVED`,
      };
    }

    const amount = order.purchase_units?.[0]?.amount?.value || '0';
    const currency = order.purchase_units?.[0]?.amount?.currency_code || 'USD';

    // Validate amount if provided
    if (expectedAmount && amount !== expectedAmount) {
      return {
        verified: false,
        paymentId: orderId,
        status: order.status,
        amount,
        currency,
        buyerEmail: order.payer?.email_address,
        errorMessage: `Amount mismatch: expected ${expectedAmount}, got ${amount}`,
      };
    }

    return {
      verified: true,
      paymentId: orderId,
      status: order.status,
      amount,
      currency,
      buyerEmail: order.payer?.email_address,
    };
  } catch (error) {
    console.error('PayPal verification error:', error);
    return {
      verified: false,
      paymentId: orderId,
      status: 'error',
      amount: '0',
      currency: 'USD',
      errorMessage: error instanceof Error ? error.message : 'Unknown verification error',
    };
  }
}

/**
 * Validate payment details before order creation
 */
async function validatePayment(
  paymentId: string,
  expectedAmount: string
): Promise<{
  valid: boolean;
  verification: VerificationResult;
}> {
  const verification = await verifyPayPalOrder(paymentId, expectedAmount);

  return {
    valid: verification.verified,
    verification,
  };
}

export { verifyPayPalOrder, validatePayment, type VerificationResult };

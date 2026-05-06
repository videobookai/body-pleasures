
import { factories } from '@strapi/strapi';
import { errors } from '@strapi/utils';
import { validatePayment } from '../../../utils/paypal';
import { sendCheckoutEmail } from '../../../services/email';

const { ValidationError } = errors;

export default factories.createCoreService('api::order.order', ({ strapi }) => ({
  async create(params: any) {
    const { data } = params;
    const hasPaymentId = data?.paymentId !== undefined && data.paymentId !== null && data.paymentId !== '';
    const hasTotalAmount =
      data?.totalAmount !== undefined && data.totalAmount !== null && data.totalAmount !== '';

    if (hasPaymentId !== hasTotalAmount) {
      throw new ValidationError('paymentId and totalAmount are both required for PayPal payment verification');
    }

    // Verify PayPal payment before creating order
    if (hasPaymentId) {
      try {
        const paymentValidation = await validatePayment(
          data.paymentId,
          data.totalAmount.toString()
        );

        if (!paymentValidation.valid) {
          throw new Error(
            `Payment verification failed: ${paymentValidation.verification.errorMessage}`
          );
        }

        // Add verification details to order data
        data.paymentVerified = true;
        data.verificationStatus = 'verified';
        data.verifiedAt = new Date().toISOString();
      } catch (error) {
        data.paymentVerified = false;
        data.verificationStatus = 'error';
        throw error;
      }
    }

    const result = await super.create(params);

    // Send checkout confirmation email (fire-and-forget, don't block order creation)
    if (data.email) {
      sendCheckoutEmail({
        username: data.username,
        email: data.email,
        address: data.address,
        zip: data.zip,
        phone: data.phone,
        totalAmount: data.totalAmount,
        paymentId: data.paymentId,
        order: data.order,
      }).catch((err) => strapi.log.error('[email] Failed to send checkout email:', err));
    }

    return result;
  },
}));



import { factories } from '@strapi/strapi';
import { errors } from '@strapi/utils';
import { validatePayment } from '../../../utils/paypal';

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

    // Call the default create method
    return super.create(params);
  },
}));


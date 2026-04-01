/**
 * order service
 */

import { factories } from '@strapi/strapi';
import { validatePayment } from '../../../utils/paypal';

export default factories.createCoreService('api::order.order', ({ strapi }) => ({
  async create(params: any) {
    const { data } = params;

    // Verify PayPal payment before creating order
    if (data?.paymentId) {
      try {
        const paymentValidation = await validatePayment(
          data.paymentId,
          data.totalAmount?.toString()
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
        console.error('Payment verification error:', error);
        data.paymentVerified = false;
        data.verificationStatus = 'error';
        throw error;
      }
    }

    // Call the default create method
    return super.create(params);
  },
}));


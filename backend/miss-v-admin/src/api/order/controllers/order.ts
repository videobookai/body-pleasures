/**
 * order controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
  async create(ctx) {
    try {
      // Call the service create method which includes payment verification
      const response = await super.create(ctx);
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Order creation failed';
      
      ctx.status = 400;
      ctx.body = {
        error: {
          message: errorMessage,
          status: 400,
        },
      };
    }
  },
}));


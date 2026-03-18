import type { Core } from '@strapi/strapi';

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    // Patch content-releases migration to handle null oldContentTypes
    // This fixes the crash when Strapi Cloud switches from EE to CE
    const origGetHook = strapi.hook.bind(strapi);
    const patchedHook = function (name: string) {
      const hook = origGetHook(name);
      if (name === 'strapi::content-types.beforeSync') {
        const origCall = hook.call.bind(hook);
        hook.call = async function (context: any) {
          if (context) {
            context.oldContentTypes = context.oldContentTypes ?? {};
            context.contentTypes = context.contentTypes ?? {};
          }
          return origCall(context);
        };
      }
      return hook;
    };
    strapi.hook = patchedHook as any;
  },

  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
};

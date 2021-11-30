const SocialSharing = () => import(/* webpackChunkName: "marko-web-plugin-social-sharing" */ './social-sharing.vue');

export default (Browser, { importSCSS = false } = {}) => {
  if (importSCSS) import('../scss/buttons.scss');
  const { EventBus } = Browser;
  Browser.register('PluginSocialSharing', SocialSharing, {
    provide: { EventBus },
  });
};

export default {
  define: {
    API_DOMAIN: 'http://domain.api',
    WEB_DOMAIN: 'http://domain.web',
    SHORT_DOMAIN: 'domain.web',
    GOOGLE_CLIENT_KEY: 'GOOGLE_CLIENT_KEY',
    MICROSOFT_CLIENT_KEY: 'MICROSOFT_CLIENT_KEY',
    STRIPE_PUBLIC_KEY: 'STRIPE_PUCLIC_KEY',
    ADMIN_HOSTNAME: 'hostname.admin',
  },

  plugins: [
    [
      'umi-plugin-ga',
      {
        code: 'GTM-5N4P4MB',
        judge: () => true, // true or false
      },
    ],
  ],
};

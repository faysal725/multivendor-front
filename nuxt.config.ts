// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
      app: {
      head: {
      templateParams: {
          // other common separators: '·', '—', '•'
        }
      },
    },
    css: ['~/assets/css/main.css'],
    runtimeConfig: {
      public: {
    siteUrl: process.env.FRONTEND_URL,
    siteName: process.env.TITLE,
    siteDescription: process.env.DESCRIPTION,
    language: 'en',
        appName: process.env.APP_NAME ,
        appDescription: process.env.APP_DESCRIPTION ,
        multipleShop: process.env.MULTIPLE_SHOP,
        locationBased: process.env.LOCATION_BASED == "true" ? true : false,
        googleApiKey: process.env.GOOGLE_API_KEY,
        defaultLat: process.env.DEFAULT_LAT,
        defaultLng: process.env.DEFAULT_LNG,
        defaultZoom: process.env.DEFAULT_ZOOM,
        backendUrl: process.env.API_ENDPOINT,
        apiVersion: process.env.API_VERSION,
        frontendUrl: process.env.FRONTEND_URL,
        isNearest: process.env.NEAREST == "true" ? true : false,
        copyRightText: process.env.COPYRIGHTTEXT,
        returnPeriod: process.env.RETURN_PERIOD_HOURS,
        cancelPeriod : process.env.CANCEL_PERIOD_MINUTES,
        radius: process.env.RADIUS,
        //wss
        wsKey  : process.env.WSS_KEY,
        wsHost : process.env.WS_HOST,
        wsPort : process.env.WS_PORT,
        wsCluster : process.env.WS_CLUSTER,
      },
    },
    postcss: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        },
    },
    modules: [
      '@pinia/nuxt',
      '@pinia-plugin-persistedstate/nuxt',
      '@nuxtjs/google-fonts',
    ],
    piniaPersistedstate: {
      cookieOptions: {
        sameSite: 'strict',
      },
      storage: 'cookies'
    },
      extends: [
      'nuxt-seo-kit'
    ],
    seo: {
      indexable: {
        '/product': false,
      },
    },
})
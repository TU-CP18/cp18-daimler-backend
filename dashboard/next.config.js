require('dotenv').config();
const withCss = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');

if (typeof require !== 'undefined') {
  require.extensions['.css'] = (file) => {}
}

const nextConfig = {
  publicRuntimeConfig: {
    CLIENT_ID: process.env.CLIENT_ID,
    LOGIN_RETURN_URL: process.env.LOGIN_RETURN_URL,
    LOGIN_URL: process.env.LOGIN_URL,
  },
};

module.exports = withPlugins([
  withImages,
  withCss,
  [withSass, {
    extensions: ['.module.scss'],
    cssModules: true,
    cssLoaderOptions: {
      importLoaders: 1,
      localIdentName: '[local]__[hash:base64:5]',
    },
  }]
], nextConfig);

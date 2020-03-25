const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    // historyApiFallback: true,
    historyApiFallback: {
      index: '/',
    },
    contentBase: './dist',
    publicPath: '/',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    },
    proxy: {
      '/apiTest': {
        target: 'https://uat-uiaas-v2.synapsefi.com',
        secure: false,
        changeOrigin: true,
        pathRewrite: { '^/apiTest': '' }
      },
      '/api': {
        target: 'https://uat-uiaas.synapsefi.com',
        secure: false,
        changeOrigin: true,
        pathRewrite: { '^/login': '' }
      },
      '/v3': {
        target: 'https://uat-uiaas.synapsefi.com',
        secure: false,
        changeOrigin: true
      },
      '/v3.1': {
        target: 'https://uat-api.synapsefi.com',
        secure: false,
        changeOrigin: true
      },
      '/webhooks': {
        target: 'https://uat-uiaas.synapsefi.com',
        secure: false,
        changeOrigin: true
      },
      '/v1': {
        target: 'https://uat-uiaas.synapsefi.com',
        secure: false,
        changeOrigin: true
      },
    }
  }
});

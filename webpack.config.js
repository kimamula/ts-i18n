const webpack = require('webpack');
const { Server } = require('./src/messages');

module.exports = Server.acceptableLanguages.map((language) => ({
  entry: './src/client.js',
  output: {
    path: './build',
    filename: `bundle_${language}.js` // outputs bundled JS for each language
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/^\..*\/messages$/, (result) => result.request += `/${language}`)
  ]
}));

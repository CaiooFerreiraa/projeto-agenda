const path = require('path'); // CommonJS
const TerserPlugin = require('terser-webpack-plugin'); // Importação do TerserPlugin

module.exports = {
  mode: 'development',
  entry: './frontend/main.js',
  output: {
    path: path.resolve(__dirname, 'public', 'assets', 'js'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'], // Adicionando suporte para CSS
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  devtool: 'source-map'
};

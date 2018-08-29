const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const LicenseInfoWebpackPlugin = require('license-info-webpack-plugin').default;

const { entry, output, resolve, rules, plugins, optimization } = require('./base');

const appendRules = [
  {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'awesome-typescript-loader',
        options: {
          configFileName: 'tsconfig.production.json',
        },
      },
    ],
  },
  {
    test: /\.css$/,
    use: [
      MiniCssExtractPlugin.loader,
      'css-loader',
      'postcss-loader',
    ],
  },
];

module.exports = {
  mode: 'production',
  entry,
  output,
  resolve,
  plugins: [
    ...plugins,
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css',
    }),
    new LicenseInfoWebpackPlugin({
      glob: '{LICENSE,license,License}*',
    }),
  ],
  module: {
    rules: [...rules, ...appendRules],
  },
  optimization: {
    ...optimization,
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          output: { comments: /^\**!|@preserve|@license|@cc_on/ },
        },
      }),
    ],
  },
};

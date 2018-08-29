const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const LicenseInfoWebpackPlugin = require('license-info-webpack-plugin').default;
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const { entry, output, resolve, rules, plugins } = require('./base');

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
      'style-loader',
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
    new LicenseInfoWebpackPlugin({ glob: '{LICENSE,license,License}*' }),
    new BundleAnalyzerPlugin(),
  ],
  module: {
    rules: [...rules, ...appendRules],
  },
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          output: { comments: /^\**!|@preserve|@license|@cc_on/ },
        },
      }),
    ],
  },
};

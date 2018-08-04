/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');


// noinspection WebpackConfigHighlighting
module.exports = {
  /* mode: debug ? 'development' : 'production', */
  mode: 'production',
  // You may want 'eval' instead if you prefer to see the compiled output in DevTools.
  // See the discussion in https://github.com/facebookincubator/create-react-app/issues/343.
  devtool: 'source-map',
  // These are the "entry points" to our application.
  // This means they will be the "root" imports that are included in JS bundle.
  // The first two entry points enable "hot" CSS and auto-refreshes for JS.
  entry: [
    './src/index.js',
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/',

  },
  resolve: {
    extensions: ['.js', '.json', '.css', '.scss'],
    alias: {
    },
  },

  module: {
    rules: [
      // Process JS with Babel.
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: path.join(__dirname, './src'),
        exclude: /node_modules/,
        options: {
          presets: ['env', 'stage-3'],
        },
      },
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },

      // loader for images, fonts, file
      {
        /* test: /\.(jpe?g|png|gif|svg|ttf|eot|woff(2)?)$/, */
        test: /\.(jpe|jpg|png|gif|woff|woff2|eot|ttf|otf|svg)(\?.*$|$)/,
        use: [
          {
            loader: 'url-loader',
            options: { limit: 40000 },
          },
          'image-webpack-loader',
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
    /* new CopyWebpackPlugin([
      { from: 'views', to: '../views' },
    ]), */
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
    }),
  ],

  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          ecma: 8,
          warnings: false,
          compress: {
            ecma: 8,
            warnings: false,
          },
          mangle: true,
          output: {
            comments: false,
            ecma: 8,
          },
          sourceMap: true,
        },
      }),
    ],
  },

  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};

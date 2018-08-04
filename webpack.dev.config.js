/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');


// noinspection WebpackConfigHighlighting
module.exports = {
  /* mode: debug ? 'development' : 'production', */
  mode: 'development',
  // You may want 'eval' instead if you prefer to see the compiled output in DevTools.
  // See the discussion in https://github.com/facebookincubator/create-react-app/issues/343.
  devtool: 'source-map',
  // These are the "entry points" to our application.
  // This means they will be the "root" imports that are included in JS bundle.
  // The first two entry points enable "hot" CSS and auto-refreshes for JS.
  entry: [
    'webpack-hot-middleware/client?reload=true',
    './src/index.js',
  ],
  output: {
    path: path.join(__dirname, 'public'),
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
      // in development "style" loader enables hot editing of CSS.
      /* {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }, */

      /* {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      }, */

      /* {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'sass-loader',
          'css-loader',
        ],
      }, */
      {
        test: /\.(scss|css)$/,
        use: [
          // fallback to style-loader in development
          process.env.NODE_ENV !== 'PRODUCTION' ? 'style-loader' : MiniCssExtractPlugin.loader,
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
    // new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin('style.css'),
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
    }),
  ],

  /* devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
  },

  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
  }, */
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};

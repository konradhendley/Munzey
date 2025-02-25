const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  mode: 'production',
  entry: './src/index.js', 
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'static/js/[name].[contenthash].js',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  devServer: {
    static: path.join(__dirname, 'public'),
    port: 3000, 
    liveReload: false,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      "module": false,
      "path": require.resolve("path-browserify"),
      "fs": false, 
    },
  },
  plugins: [
    new NodePolyfillPlugin(),
    new CleanWebpackPlugin(),
    new WebpackManifestPlugin({
        fileName: 'asset-manifest.json',
    }),
    new CopyWebpackPlugin({
        patterns: [
          { from: 'public/favicon.ico', to: '' },
          { from: 'public/logo192.png', to: '' },
          { from: 'public/logo512.png', to: '' },
          { from: 'public/manifest.json', to: '' },
          { from: 'public/robots.txt', to: '' },
        ],
      }),
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash].css',
    }),
    new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html',        
        inject: true,
    }),
    new webpack.DefinePlugin({
        "process.env": JSON.stringify(process.env)
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(),
  ],
};
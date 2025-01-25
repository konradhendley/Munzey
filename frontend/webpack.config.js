const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.js',  // Your entry point, adjust if it's different
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  devServer: {
    static: path.join(__dirname, 'public'),
    port: 3000,  // This should match the port your React app runs on
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // Apply to .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/, // Add this rule to handle CSS files
        use: ['style-loader', 'css-loader'], // Process CSS files with these loaders
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
  ],
};
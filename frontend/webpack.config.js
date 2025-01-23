const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  entry: './src/index.js',  // Your entry point, adjust if it's different
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
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
    new NodePolyfillPlugin(),  // Add the polyfill plugin
  ],
};
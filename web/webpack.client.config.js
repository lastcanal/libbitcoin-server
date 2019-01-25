var path = require('path');
var webpack = require('webpack');

var entryDir = path.join(__dirname)
var outputDir = path.join(__dirname, 'build')

module.exports = {
  entry: [
    path.join(entryDir, 'client', 'index.js')
  ],
  output: {
    path: outputDir,
    filename: 'client.js'
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-env']
        }
      }
    ]
  }
};


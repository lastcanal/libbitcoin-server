const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackCPPStaticPlugin = require('./webpack-cpp-static-plugin')

const entryDir = path.join(__dirname)
const outputPath = path.join(__dirname, 'build')
const targetPath = path.join(__dirname, '..', 'src', 'web')

const html_file = path.join(outputPath, "index.html")
const build_file = path.join(outputPath, "webpage.cpp")
const target_file = path.join(targetPath, "webpage.cpp")

const CPP_TOP = `/**
 *#############################################################################
 *
 *        GENERATED SOURCE CODE, DO NOT EDIT EXCEPT EXPERIMENTALLY
 *
 *#############################################################################
 * Copyright (c) 2011-2019 libbitcoin developers (see AUTHORS)
 *
 * This file is part of libbitcoin.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
#include <bitcoin/server/web/webpage.hpp>

namespace libbitcoin {
namespace server {

std::string default_webpage()
{
    return`

const CPP_BOTTOM = `;
};

} // namespace server
} // namespace libbitcoin`

module.exports = {
  entry: [
    path.join(entryDir, 'index.js')
  ],
  output: {
    path: outputPath,
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      m: 'mithril'
    }),
    new HtmlWebpackPlugin({
      template: path.join(entryDir, 'index.html'),
      inlineSource: 'bundle.(js|css)$',
      inject: true,
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new MiniCssExtractPlugin({
      filename: 'bundle.css',
    }),
    new WebpackCPPStaticPlugin({
      output: {
        path: outputPath,
        filename: 'index.html'
      },
      target: {
        path: targetPath,
        filename: 'webpage.cpp'
      },
      content: {
        top: CPP_TOP,
        bottom: CPP_BOTTOM
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-env']
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader?name=[name].[ext]'
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /node_modules/,
        use: [
           MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ]
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.svg$/,
        loader: 'svg-url-loader',
        options: {
          encoding: 'base64'
        }
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader'
        }
      },
    ]
  }
};


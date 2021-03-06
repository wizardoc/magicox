import Path from 'path'
import { Configuration, DefinePlugin } from 'webpack'
import merge from 'webpack-merge'
import { baseWebpackConfig } from './webpack.config.base'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import WebpackBar from 'webpackbar'
import { getConfigPath, getDistPath } from '@magicox/lib'

// const util from ("./util");

export = async (): Promise<Configuration> =>
  merge(baseWebpackConfig, {
    entry: {
      app: Path.join(await getConfigPath(), 'server-entry.js'),
    },
    mode: 'development',
    output: {
      path: await getDistPath(),
      filename: 'server-entry.js',
      libraryTarget: 'commonjs2', // 打包成commonjs2规范
    },
    target: 'node', // 指定node运行环境
    module: {
      rules: [
        {
          test: /\.css/,
          use: [MiniCssExtractPlugin.loader, { loader: 'css-loader' }],
        },
      ],
    },
    plugins: [
      new DefinePlugin({
        'process.env.server': true,
      }),
      // 服务端不支持window document等对象，需将css外链
      // new MiniCssExtractPlugin({
      //   filename: "static/css/[name].[contenthash].css"
      // }),
      new WebpackBar({
        name: 'Server',
        color: 'blue',
        compiledIn: false,
      }),
    ],
  })

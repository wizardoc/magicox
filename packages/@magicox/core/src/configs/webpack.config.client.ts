import Path from 'path'
import merge from 'webpack-merge'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { baseWebpackConfig } from './webpack.config.base'
import WebpackBar from 'webpackbar'
import { Configuration, DefinePlugin } from 'webpack'
import { configure, getConfigPath, getDistPath } from '@magicox/lib'

export = async (): Promise<Configuration> => {
  const { template } = await configure.getConfig()

  return merge(baseWebpackConfig, {
    entry: {
      app: Path.join(await getConfigPath(), 'client-entry.js'),
    },

    mode: 'development' as Configuration['mode'],

    output: {
      path: await getDistPath(),
      filename: 'static/js/bundle.js',
      publicPath: '/dist/',
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['css-loader', 'style-loader'],
        },
      ],
      // rules: util.styleLoaders({
      //     sourceMap: isProd ? true : false,
      //     usePostCSS: true,
      //     extract: isProd ? true : false
      //   })
    },
    plugins: [
      new DefinePlugin({
        'process.env.client': true, // 指定React环境为服务端
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template,
      }),
      new WebpackBar({
        name: 'Client',
        color: '#41b883',
        compiledIn: false,
      }),
    ],
  })
}

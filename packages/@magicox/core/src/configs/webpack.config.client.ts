import Path from 'path'
import merge from 'webpack-merge'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { baseWebpackConfig } from './webpack.config.base'
import WebpackBar from 'webpackbar'
import { getConfigPath, getDistPath } from '../utils'
import { Configuration } from 'webpack'
import { configure } from '../services'

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
      publicPath: '/dist/', // 打包后输出路径以/dist/开头
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

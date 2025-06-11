import {Configuration, DefinePlugin} from 'webpack'
import {merge} from 'webpack-merge'
import common from './webpack.common'
import TerserPlugin from 'terser-webpack-plugin'

const config = merge<Configuration>( common, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(?:m?js|ts)$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: [
          'webpack-strip-block',
          'babel-loader'
        ]
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin( {
      terserOptions: {
        compress: {
          drop_console: true
        }
      },
      extractComments: false
    } )]
  },

} )

export default config
import { Configuration, DefinePlugin } from 'webpack'
import { merge } from 'webpack-merge'
import common from './webpack.common'
// required for type checking
import 'webpack-dev-server'

const config = merge<Configuration>(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    server: 'https',
    allowedHosts: ['.ngrok.io'],
    port: 3000,
    hot: true,
    open: true
  },
  plugins: [
    new DefinePlugin({
      'process.env': JSON.stringify({ PLATFORM: 'development', ...process.env })
    })
  ]
})

export default config

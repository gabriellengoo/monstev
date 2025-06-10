import 'dotenv/config'
import { Configuration } from 'webpack'
import { resolve as _resolve } from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'

const __dirname = _resolve()

const config: Configuration = {
  performance: {
    hints: false
  },

  entry: _resolve(__dirname, 'src/app.js'),

  output: {
    path: _resolve(__dirname, 'dist'),
    filename: 'assets/js/app.[contenthash].js',
    library: {
      name: 'xochiworld',
      type: 'umd'
    },
    clean: true,
    assetModuleFilename: 'assets/rsc/[hash][ext][query]'
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
        // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          {
            loader: 'css-loader',
            options: {
              url: true
            }
          },
          // Compiles Sass to CSS
          'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: true
            }
          }
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          esModule: false,
          sources: {
            list: [
            // All default supported tags and attributes
              '...',
              {
                tag: 'a-asset-item',
                attribute: 'src',
                type: 'src'
              },
              {
                tag: 'xrextras-capture-config',
                attribute: 'watermark-image-url',
                type: 'src'
              }
            ],
            urlFilter: (attribute, value) => {
              if (value.charAt(0) === '/') {
                return false
              }
              return true
            }
          }
        },
        exclude: [
          _resolve(__dirname, 'src/template.html')
        ]
      },
      {
        test: /\.(mp4|png|jpe?g|gif|webm)$/i,
        type: 'asset/resource',
        exclude: /models/
      },
      {
        test: /\.(mp3|svg|m4a|ico|vtt|woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(glb|obj|fbx)$/i,
        loader: 'file-loader',
        options: {
          esModule: false,
          outputPath: '/assets/models',
          publicPath: 'assets/models/'
        }
      },
      {
        test: /\.gltf$/,
        loader: _resolve('./gltf-loader/'),
        options: {
          esModule: false,
          outputPath: '/assets/models',
          publicPath: 'assets/models/'
        }
      },
      {
        test: /models.*\.(mp4|bin|png|jpe?g|gif|webm)$/,
        loader: 'file-loader',
        options: {
          esModule: false,
          outputPath: '/assets/models/gltf-assets',
          publicPath: './gltf-assets/'
        }
      }
    ]
  },

  resolve: {
    extensions: ['*', '.js', '.ts']
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: _resolve(__dirname, 'src/template.html')
    }),
    new CaseSensitivePathsPlugin(),
    new CopyPlugin({
      patterns: [
        { from: _resolve(__dirname, 'src/public'), to: _resolve(__dirname, 'dist/') }
      ]
    })
  ]
}

export default config

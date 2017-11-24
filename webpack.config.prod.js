const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

module.exports = {
  devtool: 'source-map',
  entry: [
    path.resolve(__dirname, 'src/index')
  ],
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'src/img/*',
        to: 'img',
        force: true
      },
      {
        from: 'node_modules/font-awesome/css/font-awesome.min.css',
        to: 'css',
        force: true
      },
      {
        from: 'node_modules/font-awesome/fonts',
        to: 'fonts',
        force: true
      }
    ], {
      debug: 'debug'
    }),
    new webpack.optimize.UglifyJsPlugin()
  ],
  module: {
    rules: [
      {test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, use: 'url-loader?limit=10000&mimetype=application/font-woff'},
      {test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, use: 'file-loader'},
      {test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/, use: 'url-loader'},
      {test: /\.js$/, exclude: /node_modules/, use: ['babel-loader', 'eslint-loader']},
      {test: /\.css$/, use: ['style-loader', 'css-loader']},
      {
        test: /\.scss/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'resolve-url-loader', 'sass-loader']
      }
    ]
  }
}

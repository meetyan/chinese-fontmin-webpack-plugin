const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

const {ChineseFontminWebpackPlugin} = require('../index')

module.exports = (env, argv) => {
  console.log('webpack config argv =>', argv)
  const DEV = argv.mode === 'development'

  return {
    mode: DEV ? 'development' : 'production',
    entry: './src/index.js',
    output: {
      filename: 'bundle.[hash].js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
      }),
      new CleanWebpackPlugin(),
      new ChineseFontminWebpackPlugin({
        custom: {
          replace: true,
          text: 'abc',
        },
      }),
    ],
    resolve: {
      modules: [__dirname, 'src', 'node_modules'],
      extensions: ['*', '.js', '.jsx', '.tsx', '.ts'],
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: require.resolve('babel-loader'),
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  exportLocalsConvention: 'camelCase',
                  localIdentName: '[name]__[local]___[hash:base64:5]',
                },
              },
            },
          ],
        },
        {
          test: /\.png|svg|jpg|gif$/,
          use: ['file-loader'],
        },
      ],
    },
  }
}

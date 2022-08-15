const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    main: path.join(__dirname, './index.js'),
  },
  output: {
    filename: 'main.[hash:8].js',
    path: path.join(__dirname, '../dist'),
  },
  plugins: [
    // 将 output 的 main.[hash:8].js 打包后插入到 index.html
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './index.html'),
    }),
    new CleanWebpackPlugin(), // 每次打包后，清空残留文件
  ],
}

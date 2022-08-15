const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    main: path.join(__dirname, './index.js'),
  },
  output: {
    filename: 'main.[hash:8].js',
    path: path.join(__dirname, '../dist'),
  },
}

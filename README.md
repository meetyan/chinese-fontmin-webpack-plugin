# chinese-fontmin-webpack-plugin

中文 Fontmin Webpack 插件

目前该插件支持以下功能：

* 常用汉字提取，包括:
  - 《现代汉语常用字表》常用字(2500字)
  - 《现代汉语常用字表》次常用字(1000字)
  - 《现代汉语通用字表》(7000字)
* 常见符号数字提取，如：
  - 26 个英文字母和部分法文字母
  - 数字
  - 常用中英文符号
* 自定义文字提取


## 如何使用

目前，此插件是基于 Webpack 5 开发的，Webpack 4.x 版本未经测试。

在 `webpack.config.js` 下的 `plugins` 字段里，添加以下代码:

```js
const {ChineseFontminWebpackPlugin} = require('chinese-fontmin-webpack-plugin')
...

plugins: [
  new ChineseFontminWebpackPlugin({
      han2500: true, // 是否提取常用 2500 汉字
      han1000: true, // 是否提取常用 1000 汉字
      han7000: false, // 是否提取常用 7000 汉字
      alphabet: true, // 是否提取字母
      number: true, // 是否提取数字
      punctuation: true, // 是否提取标点符号
      custom: {
        text: '', // 自定义文字
        replace: false, // 是否覆盖上述的字段（如常用汉字），是则只提取自定义文字，否则在上述字段后追加自定义文字
      },
  }),
],

...
```

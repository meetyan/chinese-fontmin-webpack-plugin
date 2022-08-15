const Fontmin = require('fontmin')
const {RawSource} = require('webpack-sources')

const pluginName = 'ChineseFontminWebpackPlugin'

class ChineseFontminWebpackPlugin {
  constructor() {}

  apply(compiler) {
    /**
     * webpack提供三种触发钩子的方法：
     * tap：以同步的方式触发钩子
     * tapAsync：以异步的方式触发钩子
     * tapPromise：以异步的方式触发钩子，返回 Promise
     */
    compiler.hooks.compilation.tap(pluginName, compilation => {
      /**
       * compilation 生命周期
       * https://webpack.js.org/api/compilation-hooks/
       */
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage: compilation.PROCESS_ASSETS_STAGE_DEV_TOOLING,
        },
        assets => {
          const fontExtensions = ['.ttf', '.otf']

          Object.entries(assets).forEach(([pathname, source]) => {
            const fileExtension = `.${pathname.split('.').pop()}`

            if (fontExtensions.includes(fileExtension)) {
              new Fontmin()
                .src(source.source())
                .use(
                  Fontmin.glyph({
                    text: '天地玄黄 宇宙洪荒',
                  })
                )
                .run((error, files) => {
                  if (error) {
                    const errMsg = 'An error occurred when compressing font with Fontmin.'
                    return console.error(errMsg, error)
                  }

                  assets[pathname] = new RawSource(files[0].contents)
                })
            }
          })
        }
      )
    })
  }
}

module.exports = ChineseFontminWebpackPlugin

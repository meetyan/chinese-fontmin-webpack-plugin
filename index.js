const Fontmin = require('fontmin')
const {RawSource} = require('webpack-sources')
const isPlainObject = require('lodash.isplainobject')

const glyphFiles = require('./glyph')

const pluginName = 'ChineseFontminWebpackPlugin'

class ChineseFontminWebpackPlugin {
  constructor(glyph = {}) {
    if (!isPlainObject(glyph)) {
      const errMsg =
        'Invalid glyph. Make sure a plain object is passed as a parameter when instantiating.'
      throw new Error(errMsg)
    }

    if (glyph.custom && !isPlainObject(glyph.custom)) {
      const errMsg = 'Invalid custom glyph. Make sure a plain object is passed as a parameter.'
      throw new Error(errMsg)
    }

    this.glyph = {
      han2500: true,
      han1000: true,
      han7000: false,
      alphabet: true,
      number: true,
      punctuation: true,
      custom: {
        text: '',
        replace: false,
      },
      ...glyph,
    }

    this.glyphText = ''

    this.defineGlyphText()
  }

  defineGlyphText() {
    if (this.glyph.custom?.replace) {
      this.glyphText = this.glyph.custom.text || ''
      return
    }

    if (this.glyph.han1000) {
      this.glyphText = this.glyphText + glyphFiles.han1000
    }

    if (this.glyph.han2500) {
      this.glyphText = this.glyphText + glyphFiles.han2500
    }

    // 因为 7000 字已包含上述的 2500 + 1000，无需再叠加
    if (this.glyph.han7000) {
      this.glyphText = glyphFiles.han7000
    }

    if (this.glyph.alphabet) {
      this.glyphText = this.glyphText + glyphFiles.alphabet
    }

    if (this.glyph.number) {
      this.glyphText = this.glyphText + glyphFiles.number
    }

    if (this.glyph.punctuation) {
      this.glyphText = this.glyphText + glyphFiles.punctuation
    }

    this.glyphText = this.glyphText + (this.glyph.custom?.text || '')
  }

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

          // 找到字体文件，提取、打包及替换
          Object.entries(assets).forEach(([pathname, source]) => {
            const fileExtension = `.${pathname.split('.').pop()}`

            if (!fontExtensions.includes(fileExtension)) return

            new Fontmin()
              .src(source.source())
              .use(
                Fontmin.glyph({
                  text: this.glyphText,
                })
              )
              .run((error, files) => {
                if (error) {
                  console.error('An error occurred when compressing font with Fontmin.')
                  throw new Error(error)
                }

                // 打包生成新的字体文件后，替换原有的文件
                assets[pathname] = new RawSource(files[0].contents)
              })
          })
        }
      )
    })
  }
}

module.exports = {
  ChineseFontminWebpackPlugin,
  glyph: glyphFiles,
}

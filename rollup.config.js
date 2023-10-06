const resolve = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const pkg = require('./package.json')

module.exports = [
  {
    input: 'build/index.js',
    output: {
      name: 'o2diff',
      file: pkg.browser,
      format: 'umd',
      globals: {
        'lodash': '_'
      }
    },
    plugins: [
      resolve(),
      commonjs()
    ],
    external: [
      'lodash'
    ]
  },

  {
    input: 'build/index.js',
    output: [
      {
        file: pkg.main,
        format: 'cjs'
      },
      {
        file: pkg.module,
        format: 'es'
      }
    ]
  }
]

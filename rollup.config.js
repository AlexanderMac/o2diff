const typescript = require('@rollup/plugin-typescript')
const dts = require('rollup-plugin-dts')

module.exports = [
  {
    input: 'src/index.ts',
    output: {
      dir: "build",
      name: 'o2diff',
      format: 'umd',
    },
    plugins: [
      typescript(),
    ],
    external: [
      'lodash',
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      dir: "build",
    },
    plugins: [
      dts.dts(),
    ],
  }
]

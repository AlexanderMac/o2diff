'use strict';

const commonjs    = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');

module.exports = {
  input: 'src/index.js',
  output: {
    file: 'dist/o2diff.js',
    name: 'o2diff',
    format: 'iife',
    globals: {
      'lodash': '_'
    }
  },
  plugins: [
    nodeResolve(),
    commonjs()
  ],
  external: [
    'lodash'
  ]
};

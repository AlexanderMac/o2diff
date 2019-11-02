'use strict';

const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');

module.exports = {
  input: 'index.js',
  output: {
    file: 'index.esm.js',
    name: 'o2diff',
    format: 'umd',
    globals: {
      'lodash': '_'
    }
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    })
  ],
  external: [
    'lodash'
  ]
};

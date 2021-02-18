// import { uglify } from "rollup-plugin-uglify";
import { terser } from "rollup-plugin-terser";

import { babel } from '@rollup/plugin-babel';

import json from '@rollup/plugin-json'; // 使得src中也能获取到package.json中的参数

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';

const globals = {
  'lodash': 'lodash'
};

const external = Object.keys(globals);

const commonPlugins = [
  babel({ babelHelpers: 'bundled', exclude: 'node_modules/**' }),
  json()
];

export default [
  /* lodash为全局 */
  /* {
    external,
    input: 'src/main.js',
    output: {
      name: 'vueOnEx',
      file: pkg.browser,
      format: 'umd',
      globals
    },
    plugins: [
      ...commonPlugins,
      uglify(),
    ]
  }, */
  /* 将lodash打包进产物 */
  /* {
		input: 'src/main.js',
		output: [
			{ file: pkg.module, format: 'esm' }
    ],
    plugins: [
      ...commonPlugins,
      terser(),
      resolve(),
      commonjs()
    ]
  }, */
  {
    external,
		input: 'src/main.js',
		output: [
			{ file: pkg.main, format: 'esm' }
    ],
    plugins: [
      ...commonPlugins,
      terser(),
      resolve(),
      commonjs()
    ]
	},
];
module.exports = {
  root: true, // 如果不设置，则eslint会向上检测父级目录下的文件 --> 文件系统根目录下文件，设置后以当前.eslintrc.js文件所在目录为根目录
  env: {
    browser: true,
    node: true,
    es6: true, // 设置了parserOptions支持ES6, 不意味着同时支持新的 ES6 全局变量或类型（如Set）
  },
  parser: 'esprima', // ESLint 默认使用Espree作为其解析器
  parserOptions: {
    ecmaVersion: 10, // 不设置parser字段，默认使用Espree，则不需要安装额外的lint parser
    ecmaFeatures: {
      jsx: true,
    },
  }, // 指定你想要支持的 JavaScript 语言选项，默认eslint支持ECMAScript 5 语法
  plugins: ['import'], // 可以省略包名的前缀 eslint-plugin-，eslint-plugin-import可以省略写为import；eslint-plugin-import用于支持对ES2015+ (ES6+) import/export语法的校验, 并防止一些文件路径拼错或者是导入名称错误的情况
  extends: ['eslint:recommended', 'airbnb-base'], // 如果extends未设置，且rules为空，则什么规则都没有
  rules: {
    'no-unsafe-finally': 'off',
    'no-plusplus': 0,
    'no-continue': 0,
    'no-console': 1,
    'func-names': 'off',
    'no-unused-expressions': 1,
    'max-len': ['error', { code: 100, ignoreTrailingComments: true, ignoreStrings: true }],
  },
};
// 更多规则详见：https://eslint.bootcss.com/docs/user-guide/configuring

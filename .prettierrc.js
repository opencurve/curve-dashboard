module.exports = {
  arrowParens: 'avoid', // 箭头函数参数括号
  printWidth: 80, //单行长度
  tabWidth: 2, //缩进长度
  useTabs: false, //使用空格代替tab缩进
  semi: false, //句末使用分号
  singleQuote: true, //使用单引号
  quoteProps: 'as-needed', //仅在必需时为对象的key添加引号
  jsxSingleQuote: true, // jsx中使用单引号
  trailingComma: 'all', //多行时尽可能打印尾随逗号
  bracketSpacing: true, //在对象前后添加空格-eg: { foo: bar }
  jsxBracketSameLine: true, //多属性html标签的‘>’折行放置
  proseWrap: 'preserve', // 使用默认的折行标准,主要是针对markdown
  htmlWhitespaceSensitivity: 'css', //对HTML全局空白不敏感
  endOfLine: 'lf', //结束行形式
}

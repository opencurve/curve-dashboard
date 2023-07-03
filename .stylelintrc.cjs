module.exports = {
  extends: [
    'stylelint-config-standard', // stylelint推荐配置
    'stylelint-config-recommended-vue',
    'stylelint-config-recess-order', // 属性排序
  ],
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts', '**/*.json'],
  rules: {
    'color-function-notation': null, // 使用颜色函数，个人认为没有必要，而且会让组件无法识别颜色
    'alpha-value-notation': null, // 指定字母值的百分比或数字表示法，例如rgba的a可以指定位百分比或者数字。
    'selector-class-pattern': null, // 类定义限制,例如数帆的项目可以要求所有class名都以sf开头。
    'custom-property-pattern': null, // 指定自定义属性的模式，例如数帆的项目要求所有自定义属性以sf开头
    'function-url-quotes': null, // url是否必须要引号
    'no-descending-specificity': [true, { ignore: ['selectors-within-list'] }],
    'unit-no-unknown': [true, { ignoreUnits: ['pv'] }], // 支持自定义的单位
    'font-family-no-missing-generic-family-keyword': [
      true,
      { ignoreFontFamilies: ['DIN', 'PingFang SC', 'Roboto'] }, // 支持导入的字体
    ],
    'value-no-vendor-prefix': [true, { ignoreValues: ['box'] }],
  },
}

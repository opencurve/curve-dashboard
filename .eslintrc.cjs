/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution') // 这个库是用来解决monoRep可能出现的问题的，后期可以考虑把项目转成monoRep

// https://cn.eslint.org/docs/rules/
/*
 * "off"或者0，不启用这个规则
 * "warn"或者1，出现问题会有警告
 * "error"或者2，出现问题会报错
 * ---------------------------
 * extends 直接应用别人的规范,包括其parser,overrides,rules等等
 * plugin 引入别人新增的规则，具体是否开启要在rules中自己配置。
 */

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:vue/recommended',
    'plugin:@typescript-eslint/eslint-recommended', // 使用推荐的规则，来自@typescript-eslint/eslint-plugin
    'plugin:prettier/recommended', // prettier配置 关闭 ESLint 中与 Prettier 中会发生冲突的规则
  ],
  globals: {
    // script setup
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    defineOptions: 'readonly',
    withDefaults: 'readonly',
    NodeJS: 'readonly',
  },
  plugins: [
    '@typescript-eslint',
    'simple-import-sort', // import和export排序
    'prettier', // 将 Prettier 的规则设置到 ESLint 的规则中
  ],
  parserOptions: {
    parser: {
      js: 'espree',
      jsx: 'espree',
      ts: '@typescript-eslint/parser',
      tsx: '@typescript-eslint/parser',
      // Leave the template parser unspecified, so that it could be determined by `<script lang="...">`
    },
    extraFileExtensions: ['.vue'], // .vue文件将被这个parser解析
    ecmaVersion: 'latest', // es使用最新版本语法解析
    sourceType: 'module', // esm,允许import和export
    ecmaFeatures: {
      jsx: true,
      tsx: true,
    },
  },
  parser: 'vue-eslint-parser',
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.vue'],
      rules: {
        // The core 'no-unused-vars' rules (in the eslint:recommeded ruleset)
        // does not work with type definitions
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'warn',
      },
    },
  ],

  rules: {
    'simple-import-sort/imports': 'error', // import sort排序
    'simple-import-sort/exports': 'error', // export sort排序
    'vue/multi-word-component-names': 0, // 组件名多单词
    'vue/no-multiple-template-root': 'off', // v3支持多个根组件了，这个规则主要是针对v2的
    'vue/no-v-model-argument': 'off', // 禁止使用v-model的参数 eg: v-model:argName = 'argValue'
    'vue/no-dupe-keys': 'off',
    '@typescript-eslint/consistent-type-imports': 'off',
    // 'import-type': 'error',
    // 'vue/custom-event-name-casing': 'off',
    // 'vue/require-default-prop': 'off',
    // 'vue/require-prop-types': 'off',
    // 'vue/define-component': 'off',
  },
}

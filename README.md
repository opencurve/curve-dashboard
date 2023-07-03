# curve-dsashboard

本项目是 curve 控制台的前端项目

- 项目依赖
- 如何安装和启动项目
- 项目文件相关介绍
- 如何开发本项目
- 如何调试本项目

## 项目依赖和 vscode 插件

> 推荐安装的插件属于锦上添花，不安装也无妨

- 项目依赖 node 17 及以上版本
- 代码 formatter 工具 prettier: `esbenp.prettier-vscode`
- 代码 lint 工具 ESLint: `dbaeumer.vscode-eslint`
- postcss 语法高亮插件 `cpylua.language-postcss`和`vunguyentuan.vscode-postcss`
- vue3 官方插件 volar `Vue.volar`和`Vue.vscode-typescript-vue-plugin`
- 推荐安装 vue3 代码提示工具 `hollowtree.vue-snippets`
- 推荐安装 ts 报错合理提示插件 `mattpocock.ts-error-translator`
- 推荐安装 单词拼写检测插件 `streetsidesoftware.code-spell-checker`
- 推荐安装 色值显示插件 `naumovs.color-highlight`
- 推荐安装 彩虹缩进插件 `oderwat.indent-rainbow`
- 推荐安装 图片侧边预览插件 `kisstkondoros.vscode-gutter-preview`
- 推荐安装 文件图标主题库 `PKief.material-icon-theme`
- 推荐安装 TODO 高亮插件 `wayou.vscode-todo-highlight`

安装完插件以后打开 vscode 配置文件，添加如下配置：

```json
  "editor.codeActionsOnSave": {// 保存时触发eslint fix
    "source.fixAll.eslint": true
  },

  "emmet.includeLanguages": {
    // 使用postcss来解析css,要安装postcss language support插件,启用 Emmet 缩写扩展
    "postcss": "css",
  },

  // prettier配置
  "prettier.useEditorConfig": false, // 不被editorconfig影响

  // 关于format的配置
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
```

## 项目安装和启动

- 执行 `npm install` 安装依赖
- 执行 `npm run dev` 启动本地服务，端口号可以在`vite.config.ts`文件的 server 字段下添加 port 字段修改

## 项目文件相关介绍

- .vscode 文件夹：vscode 部分插件配置
- dist 文件夹： `build`命令打包出口文件夹
- node_modules 文件夹： 三方依赖模块集合
- public 文件夹： 公共文件，待补充
- src 文件夹： 主要项目代码集合
  - api 文件夹
    - 具体 api 文件：通过`@/utils/_fetch`文件做数据请求，命名基本和路由保持一致
  - assets 文件夹：资源文件夹
  - components： 公共组件文件夹，简单组件可以是文件，如果复杂组件可以是文件夹
  - directives： 自定义指令文件夹
  - hooks： compositionApi 文件夹
  - i18n：多语言文件夹，目前支持中文和英文两种
  - layout：布局文件夹，应该要加入页面权限相关内容
  - router： 路由配置文件夹
  - store：pinia 仓库，模块数量和 api 保持一致
  - styles：公共样式文件夹，内部有公共样式和 css 变量
  - utils：工具文件夹
  - views：路由页面文件夹，嵌套结构尽量和路由保持一致
  - app.vue 文件：vue 根文件
  - main.ts：vite 打包入口文件，也是整个项目的入口文件
- .env：环境配置文件，内部变量通过`import.meta.env`访问。具体参考 https://cn.vitejs.dev/guide/env-and-mode.html#env-files
- .eslintrc.cjs: eslint 配置文件，详细规则通过`rules`配置即可。具体参考 https://eslint.org/
- .gitignore：配置文件路径，以避免某些纯本地文件上传到仓库。值得注意的是如果该文件已经在仓库中了，那 gitignore 中的配置将失效，要先去仓库删除该文件。
- .prettierrc.js：prettier 配置文件，内有详细注释
- env.d.ts：env 字段类型文件
- index.html：打包模板，可修改 title，添加静态资源等
- package.json 和 package-lock.json：npm 包相关文件，控制 npm 包依赖和包版本依赖。
- postcss.config.js：postcss 配置文件。具体参考 https://postcss.org/
- tsconfig.config.json：ts 工程模块所以 ts 配置文件
- tsconfig.json：ts 配置文件
- vite.config.ts：vite 配置文件

## 如何开发本项目

- 新建 store 和 api 文件时请执行`npm run model`指令，按照提示进行创建
- 上述命令也可以创建 view 文件，文件会引入 store。并添加基础示例代码，但是路由配置需要自己添加
- components 文件夹下组件 首字母大写
- hooks 文件以 use 开头
- directives 文件以 v 开头
- store 和 api 有 global 文件，用来完善全局相关数据模型
- 页面鉴权待补充，指令加路由钩子应该就可以了
- 代理相关配置在`vite.config.ts`文件的 proxy 字段中，请求工具会根据当前环境自动拼接`'/api'`

## 开发建议

- store 内返回一个 state 作为当前 store 总的数据源
- 不要在组件内修改非本组件创建的数据，保持数据流清晰
- 代码提交规范参考 https://github.com/conventional-changelog/commitlint

## 备忘

- vue3 中 echarts 实例不要用 ref 保存，直接使用普通变量即可. [Vue3 项目中使用折线图出现 tooltip 不显示 #14342](https://github.com/apache/echarts/issues/14342)

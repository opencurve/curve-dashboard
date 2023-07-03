/* eslint-disable no-undef */
function upperFirst(str) {
  if (!str) {
    return console.error('错误: upperFirst 方法需要传入字符串类型的值')
  }
  return str.charAt(0).toUpperCase() + str.slice(1)
}

module.exports = plop => {
  plop.setHelper('or', function () {
    return Array.prototype.slice.call(arguments, 0, -1).some(Boolean)
  })
  plop.setHelper('and', function () {
    return Array.prototype.every.call(arguments, Boolean)
  })
  plop.setHelper('eq', (v1, v2) => v1 === v2)
  plop.setHelper('ne', (v1, v2) => v1 !== v2)
  plop.setHelper('upperFirst', upperFirst)

  /* 
    lt: (v1, v2) => v1 < v2,
    gt: (v1, v2) => v1 > v2,
    lte: (v1, v2) => v1 <= v2,
    gte: (v1, v2) => v1 >= v2,
*/
  plop.setGenerator('model', {
    description: '创建数据模型',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: '请输入模型名称',
        validate: value => {
          if (!value) return false
          return true
        },
      },
      {
        type: 'confirm',
        name: 'needStore',
        message: '是否需要创建store文件',
      },
      {
        type: 'confirm',
        name: 'needApi',
        message: '是否需要创建api文件',
      },
      {
        type: 'confirm',
        name: 'needView',
        message: '是否需要创建view文件',
      },
      {
        type: 'input',
        name: 'viewPath',
        message: '请输入文件夹相对路径: src/views/',
        when: ({ needView }) => needView,
      },
    ],
    actions: data => {
      // eslint-disable-next-line no-unused-vars
      const { name, needStore, needApi, needView } = data // 这个rest内都是boolean键值对
      const viewPath = data.viewPath || name
      const actions = []
      if (needStore) {
        actions.push({
          type: 'add',
          path: `src/store/{{name}}.ts`,
          templateFile: './plop-templates/index.store.hbs',
          data,
        })
      }
      if (needApi) {
        actions.push({
          type: 'add',
          path: `src/api/{{name}}.ts`,
          templateFile: './plop-templates/index.api.hbs',
          data,
        })
      }
      if (needView) {
        actions.push({
          type: 'add',
          path: `src/views/${viewPath}/index.vue`,
          templateFile: './plop-templates/index.vue.hbs',
          data,
        })
      }

      return actions
    },
  })
}

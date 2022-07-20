const merchantRouter = {
  route: null,
  name: null,
  title: '商品管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-tushuguanli',
  filePath: 'view/goods/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '添加商品',
      type: 'view',
      name: 'goodsAdd',
      route: '/goods/add',
      filePath: 'view/goods/add.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '商品列表',
      type: 'view',
      name: 'goods',
      route: '/goods/lists',
      filePath: 'view/goods/lists.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '编辑商品',
      type: 'view',
      name: 'merchant',
      route: '/goods/edit',
      filePath: 'view/goods/edit.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
  ],
}

export default merchantRouter

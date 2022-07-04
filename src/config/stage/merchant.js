const merchantRouter = {
  route: null,
  name: null,
  title: '商户管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-tushuguanli',
  filePath: 'view/merchant/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '添加商户',
      type: 'view',
      name: 'merchantCreate',
      route: '/merchant/add',
      filePath: 'view/merchant/merchant-create.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '商户列表',
      type: 'view',
      name: 'merchant',
      route: '/merchant/list',
      filePath: 'view/merchant/merchant-list.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
  ],
}

export default merchantRouter

<template>
  <div class="container">
    <div class="header">
      <div class="title">商户列表2</div>
    </div>
    <!-- 表格 -->
    <lin-table
      :tableColumn="tableColumn"
      :tableData="tableData"
      :operate="operate"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      @row-click="rowClick"
      v-loading="loading"
    ></lin-table>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :background="true"
        :page-size="pageCount"
        :current-page="currentPage"
        v-if="refreshPagination"
        layout="prev, pager, next, jumper"
        :total="total_nums"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import merchant from '@/model/merchant'
import LinTable from '@/component/base/table/lin-table'
import MerchantModify from './merchant-modify'


export default {
  components: { LinTable },
  inject: ['eventBus'],
  data() {
    return {
      id: 0, // 用户id
      refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
      editIndex: null, // 编辑的行
      total_nums: 0, // 分组内的用户总数
      currentPage: 1, // 默认获取第一页的数据
      pageCount: 5, // 每页10条数据
      tableData: [], // 表格数据
      tableColumn: [
        { prop: 'market_name', label: '商圈' },
        { prop: 'merchant_name', label: '商户名称' },
        { prop: 'merchant_photo', label: '图片地址' },
        { prop: 'merchant_score', label: '商户评分' },
        { prop: 'start_delivery_price', label: '起送价格' },
        { prop: 'delivery_price', label: '配送费' },
        { prop: 'status', label: '状态' },
        { prop: 'create_time', label: '创建时间' },
        { prop: 'update_time', label: '更新时间' },
      ], // 表头数据
      operate: [], // 表格按键操作区
      dialogFormVisible: false, // 控制弹窗显示
      selectGroup: '', // 选中的分组Id
      groups: [], // 所有分组
      group_id: undefined,
      activeTab: '修改信息',
      form: {
        // 表单信息
        username: '',
        password: '',
        confirm_password: '',
        email: '',
        group_ids: [],
      },
      loading: false,
    }
  },
  methods: {
    // 根据分组 刷新/获取分组内的用户
    async getAdminUsers() {
      let res
      const currentPage = this.currentPage - 1
      try {
        this.loading = true
        res = await merchant.getMerchantList({ market_id: 1, page_size: this.pageCount, page: currentPage }) // eslint-disable-line
        this.loading = false
        if (res.status == window.SUCCESS_STATUS) {
          this.tableData = res.data.data;
          this.total_nums = res.data.total;
        }else {
          this.$message.error(res.msg);
        }

      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    // 获取所有分组
    // async getAllGroups() {
    //   try {
    //     this.loading = true
    //     this.groups = await Admin.getAllGroups()
    //     this.loading = false
    //   } catch (e) {
    //     this.loading = false
    //     console.log(e)
    //   }
    // },
    // 获取所拥有的权限并渲染  由子组件提供
    async handleEdit(val) {

    },
    // 切换table页
    async handleCurrentChange(val) {
      this.currentPage = val
      this.loading = true
      await this.getAdminUsers('changePage')
      this.loading = false
    },
    handleDelete(val) {
      let res
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          res = await Admin.deleteOneUser(val.row.merchant_id)
          this.loading = false
          if (res.code < window.MAX_SUCCESS_CODE) {
            if (this.total_nums % this.pageCount === 1 && this.currentPage !== 1) {
              // 判断删除的是不是每一页的最后一条数据
              this.currentPage--
            }
            await this.getAdminUsers()
            this.$message({
              type: 'success',
              message: `${res.message}`,
            })
          }
        } catch (e) {
          this.loading = false
        }
      })
    },
    // 双击 table ro
    rowClick(row) {
      this.handleEdit(row)
    },
    // 切换tab栏
    handleClick(tab) {
      this.activeTab = tab.name
    },
    // 监听子组件更新用户信息是否成功
    async handleInfoResult(flag) {
      this.dialogFormVisible = false
      if (flag === true) {
        this.getAdminUsers()
      }
    },
  },
  async created() {
    await this.getAdminUsers()
    //this.getAllGroups()
    //this.tableColumn = [{ prop: 'username', label: '名称' }, { prop: 'groupNames', label: '所属分组' }] // 设置表头信息
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'primary' },
      { name: '删除', func: 'handleDelete', type: 'danger' },
    ]
    this.eventBus.$on('addUser', this.addUser)
  },
  beforeDestroy() {
    this.eventBus.$off('addUser', this.addUser)
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      height: 59px;
      line-height: 59px;
      color: $parent-title-color;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}

.info {
  margin-left: -55px;
  margin-bottom: -30px;
}

.password {
  margin-top: 20px;
  margin-left: -55px;
  margin-bottom: -20px;
}
</style>

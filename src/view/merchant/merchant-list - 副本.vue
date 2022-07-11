<template>
  <div>
    <!-- 列表页面 -->
    <div class="container" v-if="!showEdit">
      <div class="header">
        <div class="title">图书列表</div>
        <div>
          <el-button @click="exprotExcel">导出</el-button>
        </div>
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
    </div>

    <!-- 编辑页面 -->
    <book-modify v-else @editClose="editClose" :editBookID="editBookID"></book-modify>
  </div>
</template>

<script>
import merchant from '@/model/merchant'
import LinTable from '@/component/base/table/lin-table'
import MerchantModify from './merchant-modify'
import ParseTime from '@/lin/util/parse-time'

export default {
  components: {
    LinTable,
    MerchantModify,
  },
  data() {
    return {
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
        ],
      tableData: [],
      operate: [],
      showEdit: false,
      editBookID: 1,
    }
  },
  async created() {
    this.loading = true
    await this.getMerchantLists()
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'primary' },
      {
        name: '删除',
        func: 'handleDelete',
        type: 'danger',
        permission: '删除图书',
      },
    ]
    this.loading = false
  },
  methods: {
    async getMerchantLists() {
      try {
        const res = await merchant.getMerchantList();
        if (res.status == window.SUCCESS_STATUS) {
            this.tableData = res.data.data;
        }else {
          this.$message.error(res.msg);
        }

      } catch (error) {
        if (error.code === 10020) {
          this.tableData = []
        }
      }
    },
    handleEdit(val) {
      console.log('val', val)
      this.showEdit = true
      this.editBookID = val.row.id
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该图书, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await merchant.deleteMerchant(val.row.id)
        if (res.code < window.MAX_SUCCESS_CODE) {
          this.getMerchantLists()
          this.$message({
            type: 'success',
            message: `${res.message}`,
          })
        }
      })
    },
    rowClick() {},
    editClose() {
      this.showEdit = false
      this.getMerchantLists()
    },
    // 导出表格
    exprotExcel() {
      // 动态导入
      import('@/lin/util/export-excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'label', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'label', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list',
        })
      })
    },
    // 将表单格式化为json数据
    formatJson(filterVal) {
      return this.tableData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return ParseTime(v[j])
        }
        return v[j]
      }),)
    },
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
</style>

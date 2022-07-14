<template>
  <div class="main-div">
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <el-form :inline="true" ref="form" :model="form" label-width="80px">

            <el-form-item label="商圈">
              <el-select v-model="form.market_id" clearable  placeholder="请选择排重状态">
                <el-option label="68号" value="1"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onSubmit">搜索</el-button>
              <el-button type="primary" @click="AddMerchant()">添加商户</el-button>
            </el-form-item>
          </el-form>

        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table :data="listData" border style="width: 100%">
          <el-table-column prop="merchant_id" label="商户ID" width="180"></el-table-column>
          <el-table-column prop="merchant_name" label="商户名称"> </el-table-column>
          <el-table-column prop="market_name" label="商圈"> </el-table-column>
          <el-table-column prop="merchant_photo" label="商户图片URL" width="180"></el-table-column>
          <el-table-column prop="merchant_score" label="商户评分"> </el-table-column>
          <el-table-column prop="start_delivery_price" label="起送价格"> </el-table-column>
          <el-table-column prop="delivery_price" label="配送费"> </el-table-column>
          <el-table-column prop="status" label="状态"> </el-table-column>
          <el-table-column prop="create_time" label="创建时间"> </el-table-column>
          <el-table-column prop="update_time" label="更新时间"></el-table-column>
          <el-table-column prop="event_status" label="	状态" width="100">
            <template slot-scope="scope">
              <div class="table_btns">
                <el-select v-if="scope.row.status ==1 || scope.row.status==0" size="mini" v-model="scope.row.status" @change="changeSwitch(scope.row)" :class="{vail_selcet:scope.row.status==1}">
                  <el-option label="有效" :value="1"></el-option>
                  <el-option label="删除" :value="0"></el-option>
                </el-select>
                <div v-else>未知</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="130">
            <template slot-scope="scope">
              <el-button @click="editMerchant(scope.row.merchant_id)" type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :background="true" :page-sizes="[ 5, 10, 20, 50, 100,200]" :page-size="pageCount" :current-page="currentPage" layout="total, sizes, prev, pager, next, jumper" :total="total_nums"></el-pagination>
    </div>
  </div>

</template>


<script>
import {getMerchantList} from '@/model/merchant'
export default {
  name: "merchant",
  data() {
    return {
      form: {
        market_id: '',
      },
      listData: [],
      loading: true,
      downLoading: false,
      dialogFormVisible: false,
      currentPage: 1, // 默认获取第一页的数据
      pageCount: 10, // 每页10条数据
      total_nums: 0, // 分组内的用户总数
    }
  },
  created() {
    this.loading = true
    this.merchantListTableData()
  },
  mounted() {

  },
  methods: {
    handleSizeChange(limit){
      this.pageCount = limit;
      this.merchantListTableData()

    },
    handleCurrentChange(page){
      this.currentPage = page;
      this.merchantListTableData()
    },
    onSubmit() {
      this.currentPage = 1;
      this.merchantListTableData()
    },
    AddMerchant() {
      this.$router.push({path: "/merchant/merchant-create"})
    },
    editMerchant(id){
      this.$router.push({path: "/merchant/merchant-modify",query: {id: id}})
    },
    async merchantListTableData(){
      let market_id = this.form.market_id
      let limit = this.pageCount //每页10条数据
      let page = this.currentPage //默认获取第一页的数据
      this.loading = true

      try {
        let res = await merchant.getMerchantList({market_id:market_id,page_size:limit,page:page}) // eslint-disable-line
        this.loading = false
        if (res.status == window.SUCCESS_STATUS) {
          this.listData = res.data.data
          this.currentPage = res.data.current_page
          this.pageCount = res.data.per_page
          this.total_nums = res.result.total
        }else {
          this.$message.error(res.msg);
        }
      } catch (e) {
        this.loading = false
        console.log(e)
      }


      // getMerchantList({market_id:market_id,page_size:limit,page:page}).then(res => {
      //   if (res.status == window.SUCCESS_STATUS) {
      //     this.listData = res.data.data
      //     this.currentPage = res.data.current_page
      //     this.pageCount = res.data.per_page
      //     this.total_nums = res.data.total
      //   }
      //   this.loading = false
      // })
    },
    changeSwitch(item) {
      let changeType = item.status == 1 ? '启用' : '删除';
      this.$confirm("您确认"+changeType+"吗？", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      }).then(async () => {
        this.setStatus(item.merchant_id, item.status)
      });
    },
    async setStatus(merchatId, status) {
      let res = await merchant.setStatus(merchatId, status)
      if (res.status == 200) {
        this.merchantListTableData()
        this.$message.success(res.msg)
      } else {
        this.$message.success(res.msg)
      }
    }
  }
}
</script>

<style>
.main-div {
  padding: 20px;
}
</style>

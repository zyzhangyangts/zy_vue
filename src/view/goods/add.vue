<template>
  <div class="container">
    <div class="title">添加商户</div>
    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-form :model="form" status-icon ref="form" label-width="100px" @submit.native.prevent>
            <el-form-item label="商圈" prop="title">
              <el-select
                v-model="form.market_id"
                label="请填写商圈"
                filterable
                placeholder="请填写商圈"
                clearable
                @change="changeMarket"
              >
                <el-option
                  v-for="item in marketList"
                  :key="item.market_id"
                  :label="item.market_name"
                  :value="item.market_id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="商户" prop="title">
              <el-select
                v-model="form.merchant_id"
                label="请选择商户"
                filterable
                placeholder="请选择商户"
              >
                <el-option
                  v-for="item in merchantList"
                  :key="item.merchant_id"
                  :label="item.merchant_name"
                  :value="item.merchant_id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="商户名称" prop="author">
              <el-input size="medium" v-model="form.merchant_name" placeholder="请填写商户名称"></el-input>
            </el-form-item>

            <el-form-item label="商品图片">
              <upload-imgs ref="upload_photo" :rules="file_rules" :max-num="4" :multiple="false" />
              <div><el-button @click="getValue('upload_photo')">获取当前图像数据</el-button></div>
            </el-form-item>

            <el-form-item label="商户评分" prop="image">
              <el-input size="medium" v-model="form.merchant_score" placeholder="请填写商户评分"></el-input>
            </el-form-item>

            <el-form-item label="起送价格" prop="image">
              <el-input size="medium" v-model="form.start_delivery_price" placeholder="请填写起送价格"></el-input>
            </el-form-item>

            <el-form-item label="配送费" prop="image">
              <el-input size="medium" v-model="form.delivery_price" placeholder="请填写配送费"></el-input>
            </el-form-item>

            <el-form-item class="submit">
              <el-button type="primary" @click="submitForm('form')" :loading="loading">保 存</el-button>
              <el-button @click="resetForm('form')">重 置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import merchant from '@/model/merchant'
import goodsClass from '@/model/GoodsClass'
import market from '@/model/market'
import UploadImgs from '@/component/base/upload-image'

export default {
  components: {
    UploadImgs,
  },
  data() {
    return {
      file_rules: {
        minWidth: 100,
        minHeight: 100,
        maxSize: 5,
      },
      form: {
        market_id: 0,
        merchant_name: '',
        merchant_photo: '',
        merchant_score: 4.5,
        start_delivery_price: 20,
        delivery_price: 2,
      },
      marketList: [{"market_id":0, "market_name": "请选择商圈"}],
      merchantList: [{"merchant_id":0, "merchant_name": "请选择商户"}],
      goodsClassList: [{"merchant_id":0, "merchant_name": "请选择商户"}],
      loading: false,
      fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]
    }
  },
  created() {
    this.getMarketList()
  },
  methods: {
    async getMarketList(){
      this.loading = true

      try {
        let res = await market.lists({page_size:10000,page:1, status:1}) // eslint-disable-line
        this.loading = false
        if (res.status == window.SUCCESS_STATUS) {
          this.marketList = this.marketList.concat(res.data.data)
        }else {
          this.$message.error(res.msg)
        }
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    async getGoodsClassList(){
      this.loading = true

      try {
        let res = await goodsClass.lists({parent_id:0, page_size:10000,page:1, status:1}) // eslint-disable-line
        this.loading = false
        if (res.status == window.SUCCESS_STATUS) {
          this.marketList = this.marketList.concat(res.data.data)
        }else {
          this.$message.error(res.msg)
        }
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    async getMerchantList(){
      if(this.form.market_id <= 0) {
        return true;
      }
      this.loading = true

      try {
        let res = await merchant.getMerchantList({market_id:this.form.market_id,page_size:100000,page:1, status:1}) // eslint-disable-line
        this.loading = false
        if (res.status == window.SUCCESS_STATUS) {
          this.merchantList = this.merchantList.concat(res.data.data)
        }else {
          this.$message.error(res.msg)
        }
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    async changeMarket() {
      await this.getMerchantList()
    },
    async submitForm(formName) {
      const fileList = await this.$refs.upload_photo.getValue();
      fileList.map((item) => {
        this.form.merchant_photo = item.display;
        return item;
      });
      try {
        this.loading = true
        const res = await merchant.createMerchant(this.form)
        this.loading = false
        if (res.status == window.SUCCESS_STATUS) {
          this.$message.success(`${res.msg}`);
          this.resetForm(formName);
        }else {
          this.loading = false;
          this.$message.error(res.msg);
        }
      } catch (error) {
        this.loading = false
        this.$message.error('请求失败')
        console.log(error)
      }
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleAvatarSuccess(res, file, fileList) {
      this.form.merchant_photo = file.response[0].url;
      console.log(this.form.merchant_photo);
    },

    async getValue(name) {
      console.log(await this.$refs[name].getValue())
      const imgObj = await this.$refs[name].getValue();
      // eslint-disable-next-line
      alert('已获取数据, 打印在控制台中')
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;
    border-bottom: 1px solid #dae1ec;
  }

  .wrap {
    padding: 20px;
  }

  .submit {
    float: left;
  }
}
</style>

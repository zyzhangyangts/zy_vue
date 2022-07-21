<template>
  <div class="container">
    <div class="title">编辑商户</div>
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
              >
                <el-option
                  v-for="item in marketList"
                  :key="item.market_id"
                  :label="item.market_name"
                  :value="item.market_id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商户名称" prop="author">
              <el-input size="medium" v-model="form.merchant_name" placeholder="请填写商户名称"></el-input>
            </el-form-item>
            <el-form-item label="封面" prop="image">
              <el-upload
                class="upload-demo"
                action="http://api.admin.zy.com/cms/file"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleAvatarSuccess"
                :file-list="fileList"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>

            <el-form-item label="普通示例">
              <upload-imgs ref="upload_photo" :rules="file_rules" :max-num="1" :multiple="false" :value="initData" />
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
import UploadImgs from '@/component/base/upload-image'
import market from '@/model/market'

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
        merchant_id: 0,
        market_id: 0,
        merchant_name: '',
        merchant_photo: '',
        merchant_score: 4.5,
        start_delivery_price: 20,
        delivery_price: 2,
      },
      marketList: [{"market_id":0, "market_name": "请选择"}],
      loading: false,
      fileList: [],
      initData: []
    }
  },
  created() {
    this.getMarketList();
    this.getInfo();
  },
  methods: {
    async getMarketList(){
      this.loading = true

      try {
        let res = await market.lists({page_size:10000,page:1}) // eslint-disable-line
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
    async submitForm(formName) {
      // const fileList = await this.$refs.upload_photo.getValue();
      // fileList.map((item) => {
      //   this.form.merchant_photo = item.display;
      //   return item;
      // });
      try {
        this.loading = true
        const res = await merchant.editMerchant(this.form)
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
    // async getMarketData() {
    //   try {
    //     const result = await getMarketData();
    //     if (result.data && result.data.length > 0) {
    //       this.marketList = result.data;
    //
    //       this.getInfo();
    //     }
    //   } catch (err) {
    //     console.log(err);
    //   }
    // },
    // 获取信息
    async getInfo() {
      try {
        const result = await merchant.getMerchant(this.$route.query.id);
        if (result.status == 200) {

          this.form = result.data;
          this.fileList = [{'name': '', 'url': result.data.merchant_photo}]
          this.initData = [{'id': 0, 'display': result.data.merchant_photo , 'src' : result.data.merchant_photo, 'imgId': '123'}]
        }
      } catch (e) {
        console.log(e);
      }
    }
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

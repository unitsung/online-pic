<template>
  <div class="upload">
    <el-page-header @back="goBack" content="上传作品"></el-page-header>
    <main>
      <el-card class="box-card" header="作品信息">
        <el-form label-width="120px" :model="model" ref="form">
          <el-form-item label="作品名称">
            <el-input v-model="model.name" placeholder="请输入作品名称" maxlength="50" show-word-limit></el-input>
          </el-form-item>

          <el-form-item label="创作时间">
            <el-input v-model="model.date" placeholder size="normal" clearable></el-input>
          </el-form-item>

          <el-form-item label="作品类型">
            <el-select v-model="model.cid" placeholder="请选择作品类型" @change="cidChange">
              <el-option
                v-for="(item,index) in categories"
                :key="index"
                :label="item.name"
                :value="item._id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="作品题材">
            <el-select v-model="model.theme_id" placeholder="请选择作品题材">
              <el-option
                v-for="(item,index) in themes"
                :key="index"
                :label="item.name"
                :value="item._id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-divider>上传图片信息</el-divider>
          <el-form-item label="上传图片" class="b-img">
            <el-upload
              :action="$http.defaults.baseURL + '/upload/big'"
              :on-success="res=>model.bigImg=res.url"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
            <!-- <el-upload
                class="avatar-uploader"
                :action="$http.defaults.baseURL + '/upload/big'"
                :show-file-list="false"
                :on-success="res=>model.bigImg=res.url"
              >
                <img v-if="model.bigImg" :src="model.bigImg" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>-->
          </el-form-item>
        </el-form>
      </el-card>
      <p>
        <el-button type="primary" @click.native="save" plain>发布</el-button>
      </p>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      model: {
        name: '',
        cid: '',
        theme_id: '',
        date: '',
        artist_id: sessionStorage.id,
        smallImg: '',
        bigImg: ''
      },
      categories: [
        {
          _id: '',
          name: ''
        }
      ],
      themes: [
        {
          _id: '',
          name: ''
        }
      ],
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  created() {
    this.getdata()
  },
  methods: {
    async save() {
      // eslint-disable-next-line no-unused-vars
      let res
      if (this.id) {
        res = await this.$http.put(`rest/images/${this.id}`, this.model)
      } else {
        res = await this.$http.post('rest/images', this.model)
      }
      this.$router.go(-1)
      this.$message({
        type: 'success',
        message: '保存成功'
      })
    },
    resetForm() {
      this.$refs.form.resetFields()
    },
    async getdata() {
      const res1 = await this.$http.get('rest/categories?limit=9999')
      const res3 = await this.$http.get('rest/themes?limit=9999')
      this.categories = res1.data.item
      this.themes = res3.data
    },
    async cidChange() {
      const res = await this.$http.get(`themes/?id=${this.model.cid}`)
      this.themes = res.data
    },
    goBack() {
      this.$router.go(-1)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.upload {
  overflow: hidden;
  background-color: #f8f8f8;
  // margin: 0 auto;
  .avatar-uploader .el-upload {
    max-width: 230px;
    max-height: 120px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.wrap {
  width: 1200px;
  margin: 0 auto;
  .el-page-header {
    margin: 20px auto;
  }

  p .el-button {
    margin-left: 50px;
    margin-bottom: 90px;
    width: 200px;
  }
}
</style>

<template>
  <div class="img-edit">
    <h1>{{ id ? '修改' : '新增' }}作品</h1>
    <main>
      <el-form label-width="120px" :model="model" ref="form">
        <el-form-item label="作品名称">
          <el-input v-model="model.name"></el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-select v-model="model.artist_id" placeholder="请选择" filterable>
            <el-option
              v-for="(item,index) in artists"
              :key="index"
              :label="item.name"
              :value="item._id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="创作时间">
          <el-input v-model="model.date" placeholder size="normal" clearable></el-input>
        </el-form-item>

        <el-form-item label="分类">
          <el-select v-model="model.cid" placeholder="请选择" @change="cidChange">
            <el-option
              v-for="(item,index) in categories"
              :key="index"
              :label="item.name"
              :value="item._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主题">
          <el-select v-model="model.theme_id" placeholder="请选择">
            <el-option
              v-for="(item,index) in themes"
              :key="index"
              :label="item.name"
              :value="item._id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="小图" class="s-img">
          <el-upload
            class="avatar-uploader"
            :action="$http.defaults.baseURL + '/upload/small'"
            :show-file-list="false"
            :on-success="res=>model.smallImg=res.url"
            :headers="getAuthHeader()"
          >
            <img v-if="model.smallImg" :src="model.smallImg" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="大图" class="b-img">
          <el-upload
            class="avatar-uploader"
            :action="$http.defaults.baseURL + '/upload/big'"
            :show-file-list="false"
            :on-success="res=>model.bigImg=res.url"
            :headers="getAuthHeader()"
          >
            <img v-if="model.bigImg" :src="model.bigImg" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item size="normal">
          <el-button type="primary" @click.native="save">保存</el-button>
          <!-- <el-button @click.native="resetForm" v-if="!id">重置</el-button> -->
        </el-form-item>
      </el-form>
    </main>
  </div>
</template>

<script>
export default {
  props: {
    id: {}
  },
  data() {
    return {
      model: {
        name: '',
        cid: '',
        theme_id: '',
        date: '',
        artist_id: '',
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
      artists: [
        {
          _id: '',
          name: ''
        }
      ]
    }
  },
  created() {
    this.id && this.fetch(this.id)
    this.getdata()
  },
  methods: {
    async fetch(id) {
      const res = await this.$http.get(`rest/images/${id}`)
      this.model = res.data
    },
    async save() {
      // eslint-disable-next-line no-unused-vars
      let res
      if (this.id) {
        res = await this.$http.put(`rest/images/${this.id}`, this.model)
      } else {
        res = await this.$http.post('rest/images', this.model)
      }
      this.$router.push('/images/list')
      this.$message({
        type: 'success',
        message: '保存成功'
      })
    },
    resetForm() {
      this.$refs.form.resetFields()
      // console.log(this.$refs.form.resetFields)
    },
    async getdata() {
      const res1 = await this.$http.get('rest/categories?limit=9999')
      const res2 = await this.$http.get('rest/artists?limit=9999')
      const res3 = await this.$http.get('rest/themes?limit=9999')
      this.categories = res1.data.item
      this.artists = res2.data.item
      this.themes = res3.data.item
    },
    async cidChange() {
      const res = await this.$http.get(`themes/?id=${this.model.cid}`)
      // console.log(res.data)
      this.themes = res.data
    }
  }
}
</script>
<style lang="scss" >
.img-edit {
  width: 600px;
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
</style>

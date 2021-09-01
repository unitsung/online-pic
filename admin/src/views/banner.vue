<template>
  <div class="img-edit">
    <h1>首页轮播图</h1>
    <main>
      <el-form label-width="120px" :model="model" ref="form">
        <el-form-item label="轮播图信息">
          <el-select v-model="model.images_id" placeholder="请选择" filterable multiple>
            <el-option
              v-for="(item,index) in images"
              :key="index"
              :label="item.name"
              :value="item._id"
            ></el-option>
          </el-select>
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
        images_id: ''
      },
      images: [
        {
          _id: '',
          name: ''
        }
      ]
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
        res = await this.$http.put(`rest/banners/${this.id}`, this.model)
      } else {
        res = await this.$http.post('rest/banners', this.model)
      }
      this.$router.push('/main')
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
      const res2 = await this.$http.get('rest/images?limit=500')
      this.images = res2.data.item
    }
  }
}
</script>
<style lang="scss" >
.img-edit {
  width: 600px;
  // margin: 0 auto;
}
</style>

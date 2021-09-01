<template>
  <div class="artist-edit">
    <h1>{{ id ? '修改' : '新增' }}艺术家信息</h1>
    <main>
      <el-form label-width="120px" :model="model" ref="form">
        <el-form-item label="姓名">
          <el-input v-model="model.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="简介">
          <el-input
            v-model="model.info"
            type="textarea"
            placeholder="请输入简介信息"
            maxlength="20000"
            show-word-limit
            autosize
          ></el-input>
        </el-form-item>

        <el-form-item size="normal">
          <el-button type="primary" @click.native="save">保存</el-button>
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
        info: ''
      }
    }
  },
  created() {
    this.id && this.fetch(this.id)
  },
  methods: {
    async fetch(id) {
      const res = await this.$http.get(`rest/artists/${id}`)
      this.model = res.data
    },
    async save() {
      // eslint-disable-next-line no-unused-vars
      let res
      if (this.id) {
        res = await this.$http.put(`rest/artists/${this.id}`, this.model)
      } else {
        res = await this.$http.post('rest/artists', this.model)
      }
      this.$router.push('/artists/list')
      this.$message({
        type: 'success',
        message: '保存成功'
      })
    }
  }
}
</script>
<style lang="scss" >
.artist-edit {
  width: 600px;
}
</style>

<template>
  <div class="categories">
    <h1>{{ id ? '编辑' : '新增' }}分类</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="名称">
        <el-input v-model="model.name" placeholder="请输入分类名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    id: {}
  },
  data() {
    return { model: {}, themes: [] }
  },
  created() {
    this.fetchParents()
    this.id && this.fetch(this.id)
  },
  methods: {
    async fetch(id) {
      const res = await this.$http.get(`rest/categories/${id}`)
      this.model = res.data
    },
    async fetchParents() {
      const res = await this.$http.get('rest/categories/')
      this.themes = res.data
    },
    async save() {
      // eslint-disable-next-line no-unused-vars
      let res
      if (this.id) {
        res = await this.$http.put(`rest/categories/${this.id}`, this.model)
      } else {
        res = await this.$http.post('rest/categories', this.model)
      }
      // this.$router.push('/categories/list')
      this.$message({
        type: 'success',
        message: '保存成功'
      })
    }
  }
}
</script>

<style scoped>
.categories {
  width: 500px;
}
</style>

<template>
  <div class="theme">
    <h1>{{ id ? '编辑' : '新增' }}主题</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="所属分类">
        <el-select v-model="model.category_id">
          <el-option
            v-for="item in categories"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="题材名称">
        <el-input v-model="model.name" placeholder="请输入题材名称"></el-input>
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
    return { model: {}, categories: [] }
  },
  created() {
    this.fetchParents()
    this.id && this.fetch(this.id)
  },
  methods: {
    async fetch(id) {
      const res = await this.$http.get(`rest/themes/${id}`)
      this.model = res.data
    },
    async fetchParents() {
      const res = await this.$http.get('rest/categories/?limit=1000')
      this.categories = res.data.item
    },
    async save() {
      // eslint-disable-next-line no-unused-vars
      let res
      if (this.id) {
        res = await this.$http.put(`rest/themes/${this.id}`, this.model)
      } else {
        res = await this.$http.post('rest/themes', this.model)
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

<style>
.theme {
  width: 600px;
}
</style>

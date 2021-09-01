<template>
  <div class="about">
    <h1>{{ id ? '编辑' : '新增' }}文章</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="标题">
        <el-input v-model="model.title"></el-input>
      </el-form-item>
      <el-form-item label="详情">
        <vue-editor v-model="model.detail" useCustomImageHandler @image-added="handleImageAdded"></vue-editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 引入第三方插件 vue2Editor
import { VueEditor } from 'vue2-editor'
export default {
  props: {
    id: {}
  },
  components: {
    VueEditor
  },
  data() {
    return { model: { title: '', detail: '' } }
  },
  created() {
    this.id && this.fetch(this.id)
  },
  methods: {
    async fetch(id) {
      const res = await this.$http.get(`rest/articles/${id}`)
      this.model = res.data
    },
    async save() {
      // eslint-disable-next-line no-unused-vars
      let res
      if (this.id) {
        res = await this.$http.put(`rest/articles/${this.id}`, this.model)
      } else {
        res = await this.$http.post('rest/articles', this.model)
      }
      this.$router.push('/articles/list')
      this.$message({
        type: 'success',
        message: '保存成功'
      })
    },
    // 自定义 vue2-editor图片上传
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      const formData = new FormData()
      formData.append('file', file)
      const res = await this.$http.post('upload/article', formData)
      Editor.insertEmbed(cursorLocation, 'image', res.data.url)
      resetUploader()
    }
  }
}
</script>

<style>
</style>

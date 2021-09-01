<template>
  <div class="newDetail">
    <el-page-header @back="goBack" content="新闻详情"></el-page-header>
    <div class="info">
      <div class="title">{{info.title}}</div>
      <div class="detail" v-html="info.detail"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['id'],
  data() {
    return {
      info: {}
    }
  },
  created() {
    this.fetch(this.id)
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    async fetch(id) {
      const res = await this.$http.get(`rest/article/${id}`)
      this.info = res.data
    }
  }
}
</script>

<style lang="scss" scoped>
.newDetail {
  overflow: hidden;
}
.el-page-header {
  margin: 20px 0 60px;
}
.info {
  margin-bottom: 50px;
  .title {
    text-align: center;
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 40px;
  }
  .detail p {
    text-indent: 2em;
  }
}
</style>

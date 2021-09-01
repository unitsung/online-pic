<template>
  <div class="new">
    <el-page-header @back="goBack" content="新闻头条"></el-page-header>
    <ul v-for="item in model" :key="item._id">
      <li @click="goDetail(item._id)">{{item.title}}</li>
      <el-divider></el-divider>
    </ul>
    <div class="pagination">
      <el-pagination
        :current-page="curr"
        :page-size="30"
        layout=" prev, pager, next"
        :total="total"
        background
        @current-change="curr_change"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      model: {},
      skip: 0,
      total: 0,
      curr: 1
    }
  },
  created() {
    this.getList()
  },
  computed: {},

  methods: {
    async getList() {
      const res = await this.$http.get(`rest/article/?skip=${this.skip}`)
      this.model = res.data.item
      this.total = res.data.count
    },

    goBack() {
      this.$router.back()
    },
    curr_change(val) {
      this.skip = parseInt((val - 1) * 30)
      this.getList()
    },
    goDetail(id) {
      this.$router.push(`/new/detail/${id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.new {
  overflow: hidden;
  min-height: 100vh;
}
.el-page-header {
  margin: 20px 0 60px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-bottom: 50px;
  ::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #ff7c38;
  }
  ::v-deep .el-pagination .el-pager li:not(.active):hover {
    color: #ff7c38;
  }
}
.new li {
  cursor: pointer;
}
</style>

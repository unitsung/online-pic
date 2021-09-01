<template>
  <div class="cate">
    <el-page-header @back="goBack">
      <div slot="content">{{title}}</div>
    </el-page-header>
    <el-card class="box-card" header="筛选作品题材">
      <div class="tag">
        <el-button @click="getList()">所有类型</el-button>
        <el-button v-for="item in themes" :key="item._id" @click="addFilter(item._id)">{{item.name}}</el-button>
      </div>
      <div class="search">
        <span>艺搜就好</span>
        <el-input v-model="str" placeholder="搜一搜" size="normal" clearable></el-input>
        <el-button type="primary" round @click="search">搜索</el-button>
      </div>
      <p class="total">
        共
        <span>{{total}}</span> 条结果
      </p>
    </el-card>
    <ul class="card-box">
      <li v-for="item in model" :key="item._id" @click="goDetail(item._id)">
        <div class="card-img">
          <el-image :src="item.bigImg" fit="contain"></el-image>
        </div>
        <div class="card-info">
          <a :title="item.name" class="card-info-title" target="_blank">{{item.name}}</a>
        </div>
      </li>
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
      curr: 1,
      themes: {},
      str: '',
      youhua: { cid: '' },
      banhua: { cid: '' },
      guohua: { cid: '' },
      shuimo: { cid: '' }
    }
  },
  async created() {
    await this.getCid()
    await this.getList()
    await this.getThemes()
  },
  computed: {
    title() {
      if (this.$route.path == '/cate/youhua') {
        return '油画'
      } else if (this.$route.path == '/cate/guohua') {
        return '国画'
      } else if (this.$route.path == '/cate/banhua') {
        return '版画'
      } else {
        return '现代水墨'
      }
    },
    cid() {
      if (this.$route.path == '/cate/youhua') {
        return this.youhua.cid
      } else if (this.$route.path == '/cate/guohua') {
        return this.guohua.cid
      } else if (this.$route.path == '/cate/banhua') {
        return this.banhua.cid
      } else {
        return this.shuimo.cid
      }
    }
  },
  watch: {
    cid: function () {
      this.getList()
      this.getThemes()
    }
  },
  methods: {
    async getList() {
      const res = await this.$http.get(
        `rest/images/?cid=${this.cid}&limit=30&skip=${this.skip}`
      )
      this.model = res.data.item
      this.total = res.data.count
    },
    async getThemes() {
      const res1 = await this.$http.get(`themes/?id=${this.cid}`)
      this.themes = res1.data
      console.log(this.themes)
    },
    goBack() {
      this.$router.back()
    },
    curr_change(val) {
      this.skip = parseInt((val - 1) * 30)
      this.getList()
    },
    handleClose(tag) {
      this.themes.splice(this.themes.indexOf(tag._id), 1)
    },
    async addFilter(theme_id) {
      const res = await this.$http.get(
        `images/filter/?cid=${this.cid}&limit=30&skip=${this.skip}&tid=${theme_id}`
      )
      this.model = res.data.item
      this.total = res.data.count
    },
    goDetail(id) {
      this.$router.push(`/detail/${id}`)
    },
    async search() {
      const res = await this.$http.post(`images/search/`, {
        name: this.str,
        limit: 30,
        skip: this.skip
      })
      this.model = res.data.item
      this.total = res.data.count
    },
    async getCid() {
      const res = await this.$http.get('rest/categories')
      res.data.item.forEach((item) => {
        if (item.name == '油画') {
          this.youhua.cid = item._id
        }
        if (item.name == '国画') {
          this.guohua.cid = item._id
        }
        if (item.name == '版画') {
          this.banhua.cid = item._id
        }
        if (item.name == '当代水墨') {
          this.shuimo.cid = item._id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.cate {
  overflow: hidden;
}
.el-page-header {
  margin: 20px;
}
.card-box {
  display: flex;
  flex-wrap: wrap;
  padding: 0;
}
.card-box li {
  list-style: none;
  width: 210px;
  margin-right: 20px;
  margin-bottom: 20px;
  cursor: pointer;
  border: 1px solid #ccc;

  .card-img {
    width: 100%;
    height: 200px;
    background-color: #e3e3e3;
  }
  .el-image {
    width: 100%;
    height: 100%;
  }
  .card-info {
    padding: 10px;
    background-color: #f6f6f6;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .card-info-title {
    font-size: 14px;
    color: #333;
    cursor: pointer;
    &:hover {
      color: #ff7c38;
    }
  }
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

.tag {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  .el-button {
    margin-bottom: 10px;
  }
}
.total {
  display: flex;
  justify-content: flex-end;
  margin-right: 80px;
  margin-top: 30px;
  font-size: 14px;
  span {
    color: #ff7c38;
  }
}
.search {
  display: flex;
  align-items: center;
  margin-top: 20px;
  span {
    width: 80px;
    margin-right: 10px;
  }
  ::v-deep .el-input {
    width: 1000px;
    margin-right: 20px;
  }
}
</style>

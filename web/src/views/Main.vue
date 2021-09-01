<template>
  <div class="main">
    <div class="swipper">
      <el-carousel height="500px">
        <el-carousel-item
          v-for="item in banners"
          :key="item._id"
          @click.native="goDetail(item._id)"
        >
          <el-image :src="item.bigImg" fit="cover"></el-image>
        </el-carousel-item>
      </el-carousel>
    </div>

    <el-tabs v-model="activeName" @tab-click="handleClick" stretch>
      <el-tab-pane label="油画" name="first">
        <ul class="card-box">
          <li v-for="item in youhua.data" :key="item._id" @click="goDetail(item._id)">
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
            :current-page="youhua.curr"
            :page-size="30"
            layout=" prev, pager, next"
            :total="youhua.total"
            background
            @current-change="curr_change1"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="当代水墨" name="second">
        <ul class="card-box">
          <li v-for="item in shuimo.data" :key="item._id" @click="goDetail(item._id)">
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
            :current-page="shuimo.curr"
            :page-size="30"
            layout=" prev, pager, next"
            :total="shuimo.total"
            background
            @current-change="curr_change2"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="版画" name="third">
        <ul class="card-box">
          <li v-for="item in banhua.data" :key="item._id" @click="goDetail(item._id)">
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
            :current-page="banhua.curr"
            :page-size="30"
            layout=" prev, pager, next"
            :total="banhua.total"
            background
            @current-change="curr_change3"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="国画" name="fourth">
        <ul class="card-box">
          <li v-for="item in guohua.data" :key="item._id" @click="goDetail(item._id)">
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
            :current-page="guohua.curr"
            :page-size="30"
            layout=" prev, pager, next"
            :total="guohua.total"
            background
            @current-change="curr_change4"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      banners: [],
      activeName: 'first',
      youhua: { cid: '', data: {}, curr: 1, skip: 0, total: 0 },
      guohua: { cid: '', data: {}, curr: 1, skip: 0, total: 0 },
      shuimo: { cid: '', data: {}, curr: 1, skip: 0, total: 0 },
      banhua: { cid: '', data: {}, curr: 1, skip: 0, total: 0 }
    }
  },
  created() {
    this.init()
  },
  methods: {
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
    },
    async getBanner() {
      const res = await this.$http.get('rest/banner')
      let banner = res.data.item[0].images_id
      banner.forEach(async (item) => {
        const image = await this.$http.get(`rest/images/${item}`)
        this.banners.push(image.data)
      })
    },
    async getYouhua() {
      console.log(this.youhua.cid)
      const res = await this.$http.get(
        `rest/images/?cid=${this.youhua.cid}&limit=30&skip=${this.youhua.skip}`
      )
      this.youhua.data = res.data.item
      this.youhua.total = res.data.count
    },
    async getBanhua() {
      const res = await this.$http.get(
        `rest/images/?cid=${this.banhua.cid}&limit=30&skip=${this.banhua.skip}`
      )
      this.banhua.data = res.data.item
      this.banhua.total = res.data.count
    },
    async getShuimo() {
      const res = await this.$http.get(
        `rest/images/?cid=${this.shuimo.cid}&limit=30&skip=${this.shuimo.skip}`
      )
      this.shuimo.data = res.data.item
      this.shuimo.total = res.data.count
    },
    async getGuohua() {
      const res = await this.$http.get(
        `rest/images/?cid=${this.guohua.cid}&limit=30&skip=${this.guohua.skip}`
      )
      this.guohua.data = res.data.item
      this.guohua.total = res.data.count
    },
    goDetail(id) {
      this.$router.push(`/detail/${id}`)
    },
    handleClick() {},
    async init() {
      await this.getCid()
      await this.getYouhua()
      await this.getBanhua()
      await this.getShuimo()
      await this.getGuohua()
      await this.getBanner()
    },
    curr_change1(val) {
      this.youhua.skip = parseInt((val - 1) * 30)
      this.getYouhua()
    },
    curr_change2(val) {
      this.shuimo.skip = parseInt((val - 1) * 30)
      this.getShuimo()
    },
    curr_change3(val) {
      this.banhua.skip = parseInt((val - 1) * 30)
      this.getBanhua()
    },
    curr_change4(val) {
      this.guohua.skip = parseInt((val - 1) * 30)
      this.getGuohua()
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  overflow: hidden;
}
.swipper {
  margin-top: 20px;
  margin-bottom: 100px;
}
.swipper img {
  width: 100%;
  height: 100%;
}
.swipper {
  cursor: pointer;
}
::v-deep .el-tabs__item {
  font-size: 18px;
}
::v-deep .el-tabs__item.is-active,
::v-deep .el-tabs__item:hover {
  color: #f06868;
}
::v-deep .el-tabs__active-bar {
  background-color: #f06868;
}
.card-box {
  display: flex;
  flex-wrap: wrap;
}
.pagination {
  display: flex;
  justify-content: center;
  margin: 20px auto;
}
::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #ff7c38;
}
::v-deep .el-pagination .el-pager li:not(.active):hover {
  color: #ff7c38;
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
</style>

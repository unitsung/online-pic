<template>
  <div class="home">
    <Header></Header>
    <div class="wrap">
      <router-view></router-view>

      <el-backtop></el-backtop>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import navbar from '../components/navbar'
import foot from '../components/foot'
export default {
  data() {
    return {
      banner: {}
    }
  },
  components: {
    Header: navbar,
    Footer: foot
  },
  created() {}
  // methods: {
  //   fetch() {
  //     this.banner = this.$http.get('/banner')
  //   }
  // }
}
</script>
<style lang="scss" scoped>
.home {
  background-color: #f8f8f8;
}
.wrap {
  width: 1200px;
  margin: 0 auto;
}
::v-deep .el-backtop,
.el-calendar-table td.is-today {
  color: #ff7c38;
}
</style>

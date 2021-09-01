<template>
  <div id="detail">
    <el-page-header @back="goBack" content="作品详细"></el-page-header>
    <el-divider></el-divider>
    <div class="work-box">
      <el-image :src="work.bigImg" :preview-src-list="srcList" fit="contain"></el-image>
    </div>
    <div class="info-box">
      <div class="work-info">
        <h4>{{work.name}}</h4>
        <p class="artist">
          <span>作者:</span>
          {{work.artist_id.name}}
        </p>
        <p>
          <span>类型:</span>
          {{work.cid.name}}
        </p>
        <p>
          <span>题材:</span>
          {{work.theme_id.name}}
        </p>
        <p>
          <span>创作时间:</span>
          {{work.date}}
        </p>
      </div>
      <div class="artist-info">
        <h4>作者信息</h4>
        <p>{{work.artist_id.info}}</p>
        <el-divider></el-divider>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="rate-box">
      <span class="title">评分:</span>
      <el-rate v-model="rate" text-color="#f07b3f" show-score allow-half></el-rate>
    </div>
    <div class="review">
      <el-input
        v-model="review"
        type="textarea"
        placeholder="说点什么吧"
        maxlength="2000"
        show-word-limit
        autosize
      ></el-input>
      <p>
        <el-button type="primary" size="default" plain>评论</el-button>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['id'],
  data() {
    return {
      work: {},
      srcList: [],
      rate: 0,
      review: ''
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
      const res = await this.$http.get(`rest/images/${id}`)
      this.work = res.data
      this.srcList.push(this.work.bigImg)
    },
    goDetail(id) {
      this.$router.push(`/detail/${id}`)
    }
  }
}
</script>

<style lang="scss">
#detail {
  .el-page-header {
    margin: 20px;
  }
  .work-box {
    width: 1200px;
    height: 600px;
    border: 1px solid #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 50px;
  }
  .el-image {
    width: 1100px;
    height: 550px;
  }
  .info-box {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    min-height: 200px;
    .work-info {
      width: 300px;
      span {
        margin-right: 5px;
      }
      font-size: 14px;
      color: #666;
      h4 {
        color: #333;
        font-size: 16px;
      }
      .artist {
        color: #333;
      }
    }
    .artist-info {
      width: 700px;
      font-size: 14px;
      color: #666;
      h4 {
        color: #333;
        font-size: 16px;
      }
    }
  }
  .rate-box {
    display: flex;
    margin-bottom: 20px;
    .title {
      font-weight: 700;
      margin-right: 10px;
    }
  }
  .review {
    // display: flex;
    justify-content: flex-end;
    padding: 20px;
    margin-bottom: 50px;
    background-color: #eee;
    .el-textarea__inner {
      min-height: 70px !important;
    }
    p {
      display: flex;
      justify-content: flex-end;
      .el-button {
        margin-top: 10px;
      }
    }
  }
}
</style>

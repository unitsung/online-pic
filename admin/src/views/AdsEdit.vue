<template>
  <div class="about">
    <h1>{{ id ? '编辑' : '新建' }}广告位</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="名称">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="广告">
        <el-button type="primary" plain size="small" @click="model.items.push({})"><i class="el-icon-plus"></i> 添加广告
        </el-button>
        <el-row type="flex" style="flex-wrap:wrap">
          <el-col :md="24" v-for="(item,index) in model.items" :key="index" style="margin-top:0.5rem">
            <el-form-item label="跳转链接" v-model="item.url">
              <el-input v-model="item.url"></el-input>
            </el-form-item>
            <el-form-item label="图片" style="margin-top:0.8rem">
              <el-upload class="avatar-uploader" :action="$http.defaults.baseURL + '/upload'" :show-file-list="false"
                :on-success="res=>$set(item,'image',res.url)" :headers="getAuthHeader()">
                <img v-if="item.image" :src="item.image" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item id="delete">
              <el-button type="danger" plain size="small" @click="model.items.splice(index,1)">删除</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit" plain>保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    id: {}
  },
  data () {
    return {
      model: {
        items: []
      }
    }
  },
  created () {
    this.id && this.fetch(this.id)
  },
  methods: {
    async fetch (id) {
      const res = await this.$http.get(`rest/ads/${id}`)
      this.model = Object.assign({}, this.model.items, res.data)
    },
    async save () {
      // eslint-disable-next-line no-unused-vars
      let res
      if (this.id) {
        res = await this.$http.put(`rest/ads/${this.id}`, this.model)
      } else {
        res = await this.$http.post('rest/ads', this.model)
      }
      this.$router.push('/ads/list')
      this.$message({
        type: 'success',
        message: '保存成功'
      })
    }
  }
}
</script>

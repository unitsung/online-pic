<template>
  <div class="category">
    <h1>作品分类列表</h1>
    <el-table :data="items" border stripe>
      <el-table-column prop="_id" label="ID" show-overflow-tooltip sortable />
      <el-table-column prop="name" label="名称" show-overflow-tooltip />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="$router.push(`/categories/edit/${scope.row._id}`)"
          >修改</el-button>
          <el-button type="text" size="small" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 30]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next"
        :total="total"
        background
        @size-change="handle_size_change"
        @current-change="handle_current_change"
      />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      items: [],
      currentPage: 1,
      total: 0,
      limit: 10,
      skip: 0
    }
  },
  created() {
    this.fetch()
  },
  methods: {
    handle_size_change(val) {
      this.limit = val
      this.fetch()
      // console.log(`每页 ${val} 条`);
    },
    // 当前页码
    handle_current_change(val) {
      this.skip = parseInt((val - 1) * this.limit)
      this.fetch()
      // console.log(`当前页: ${val}`);
    },
    async fetch() {
      const params = {
        limit: this.limit,
        skip: this.skip
      }
      const res = await this.$http.get('rest/categories', { params })
      this.items = res.data.item
      this.total = res.data.count
    },
    async remove(row) {
      this.$confirm(`是否确定删除分类 "${row.name}?"`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$http.delete(`rest/categories/${row._id}`)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.fetch()
      })
    }
  }
}
</script>
<style lang="scss" >
.category {
  // .el-table {
  //   max-height: 80vh;
  // }
  .el-table .cell {
    text-align: center;
  }
  .pagination {
    float: right;
    margin-top: 20px;
  }
  .el-table td {
    height: 60px;
  }
}
</style>

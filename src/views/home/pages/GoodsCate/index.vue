<template>
  <div class="cate">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button @click="$refs.addDialog.show()" type="primary" style="margin-bottom: 10px">添加分类</el-button>
      <!-- 表格栏 -->
      <el-table
        :data="cateList"
        style="width: 100%; margin-bottom: 20px"
        row-key="cat_id"
        border
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column prop="cat_name" label="分类名称"> </el-table-column>
        <el-table-column label="是否有效" align="center">
          <template slot-scope="scope">
            <i v-if="scope.row.cat_deleted" style="color: red" class="el-icon-error"></i>
            <i v-else style="color: #409eff" class="el-icon-success"></i>
          </template>
        </el-table-column>
        <el-table-column label="排序" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.cat_level === 0" type="primary" plain disabled size="mini">一级</el-button>
            <el-button v-else-if="scope.row.cat_level === 1" type="primary" plain disabled size="mini">二级</el-button>
            <el-button v-else type="primary" plain disabled size="mini">三级</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="$refs.putDialog.show(scope.row)" size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button @click="removeCategories(scope.row)" size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 添加分类 -->
      <add-goods-cate ref="addDialog" @addSuccess="getCateList"></add-goods-cate>
      <put-categories ref="putDialog"></put-categories>
    </el-card>
  </div>
</template>

<script>
import AddGoodsCate from './pages/AddGoodsCate.vue'
import PutCategories from './pages/PutCategories.vue'
export default {
  components: {
    AddGoodsCate,
    PutCategories
  },
  data() {
    return {
      cateList: [],
      total: 0,
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      currentPage: 1
    }
  },
  methods: {
    // 获取初始化数据
    async getCateList() {
      const { data } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      this.cateList = data.data.result
      this.total = data.data.total
    },
    // 表格一页展示几条数据
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getCateList()
    },
    // 表格切换页
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getCateList()
    },
    removeCategories(value) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data } = await this.$http.delete(`categories/${value.cat_id}/attributes/${value.cat_pid}`)
          if (data.meta.status !== 200) return this.$message(data.meta.msg)
          console.log(data)
          this.$message.success(data.data.msg)
          this.getCateList()
        })
        .catch(() => {})
    }
  },
  created() {
    this.getCateList()
  }
}
</script>
<style scoped>
.el-cascader {
  width: 100%;
}
</style>

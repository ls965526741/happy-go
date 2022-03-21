<template>
  <div class="goods">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索区 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable @clear="getTableData" v-model="tableQueryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getTableData"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="$router.push('add')">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="tableList.goods" border style="width: 100%">
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）" width="120"> </el-table-column>
        <el-table-column prop="goods_number" label="商品数量" width="80"> </el-table-column>
        <el-table-column label="创建时间" width="130">
          <template slot-scope="scope">
            <div>{{ scope.row.upd_time | dateFilter }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="$refs.putDialog.show(scope.row)"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeGoods(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="tableQueryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="tableQueryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableList.total"
        background
      >
      </el-pagination>
      <!-- 编辑goods的dialog -->
      <put-goods ref="putDialog"></put-goods>
    </el-card>
  </div>
</template>

<script>
import { formatDate } from '@/utils/common'
import PutGoods from './pages/PutGoods.vue'
export default {
  components: {
    PutGoods
  },
  data() {
    return {
      searchData: '',
      tableList: {},
      tableQueryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      }
    }
  },
  filters: {
    dateFilter(date) {
      return formatDate(date * 1000)
    }
  },
  methods: {
    async getTableData() {
      const { data } = await this.$http.get('goods', {
        params: this.tableQueryInfo
      })
      if (data.meta.status !== 200) return this.$message.error('数据请求失败')
      this.tableList = data.data
    },
    // 分页功能区
    handleSizeChange(val) {
      this.tableQueryInfo.pagesize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.tableQueryInfo.pagenum = val
      this.getTableData()
    },
    editGoods(val) {},
    async removeGoods(val) {
      const confirmRes = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRes === 'cancel') return this.$message.warning('取消删除')
      const { data } = await this.$http.delete('goods/' + val.goods_id)
      if (data.meta.status !== 200) return this.$message.error('数据删除失败')
      this.$message.success('数据删除成功')
      this.getTableData()
    }
  },
  created() {
    this.getTableData()
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 15px;
}
</style>

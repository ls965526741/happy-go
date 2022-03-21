<template>
  <div class="order">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索区 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable @clear="getOrderData" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getOrderData"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表单栏 -->
      <el-table :data="orderList.goods" style="width: 100%">
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="order_number" label="订单编辑"> </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.order_pay === '0'" type="danger">未付款</el-tag>
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            <div>{{ dateFilter(scope.row.create_time) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" @click="editDialogVisible = true"></el-button>
            <el-button type="success" icon="el-icon-location-outline" @click="locationDialogVisible = true"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="orderList.total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog title="修改地址" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
      <el-form :model="eidtDialog.editRuleForm" :rules="eidtDialog.editRules" ref="editRuleForm" label-width="100px">
        <el-form-item label="省市区/县">
          <el-cascader
            v-model="eidtDialog.cascader.value"
            :options="eidtDialog.cascader.options"
            :props="eidtDialog.cascader.props"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详情地址" prop="local">
          <el-input v-model="eidtDialog.editRuleForm.local"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查询物流对话框 -->
    <el-dialog title="物流进度" :visible.sync="locationDialogVisible" width="50%">
      <el-timeline :reverse="true">
        <el-timeline-item v-for="(activity, index) in location.data" :key="index" :timestamp="activity.time">
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import options from '../../../assets/citydata'
import { formatDate } from '@/utils/common'
export default {
  data() {
    return {
      orderList: {},
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      editDialogVisible: false,
      locationDialogVisible: false,
      eidtDialog: {
        editRuleForm: {
          local: ''
        },
        editRules: {
          local: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            {
              min: 3,
              max: 5,
              message: '长度在 3 到 5 个字符',
              trigger: 'blur'
            }
          ]
        },
        cascader: {
          value: [],
          options,
          props: {
            expandTrigger: 'hover',
            value: 'value',
            label: 'label',
            children: 'children'
          }
        }
      },
      location: {
        data: [
          {
            time: '2018-05-10 09:39:00',
            ftime: '2018-05-10 09:39:00',
            context: '已签收,感谢使用顺丰,期待再次为您服务',
            location: ''
          },
          {
            time: '2018-05-10 08:23:00',
            ftime: '2018-05-10 08:23:00',
            context: '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
            location: ''
          },
          {
            time: '2018-05-10 07:32:00',
            ftime: '2018-05-10 07:32:00',
            context: '快件到达 [北京海淀育新小区营业点]',
            location: ''
          },
          {
            time: '2018-05-10 02:03:00',
            ftime: '2018-05-10 02:03:00',
            context: '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
            location: ''
          },
          {
            time: '2018-05-09 23:05:00',
            ftime: '2018-05-09 23:05:00',
            context: '快件到达 [北京顺义集散中心]',
            location: ''
          },
          {
            time: '2018-05-09 21:21:00',
            ftime: '2018-05-09 21:21:00',
            context: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
            location: ''
          },
          {
            time: '2018-05-09 13:07:00',
            ftime: '2018-05-09 13:07:00',
            context: '顺丰速运 已收取快件',
            location: ''
          },
          {
            time: '2018-05-09 12:25:03',
            ftime: '2018-05-09 12:25:03',
            context: '卖家发货',
            location: ''
          },
          {
            time: '2018-05-09 12:22:24',
            ftime: '2018-05-09 12:22:24',
            context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
            location: ''
          },
          {
            time: '2018-05-08 21:36:04',
            ftime: '2018-05-08 21:36:04',
            context: '商品已经下单',
            location: ''
          }
        ],
        meta: { status: 200, message: '获取物流信息成功！' }
      }
    }
  },
  computed: {
    dateFilter() {
      return function (date) {
        return formatDate(date * 1000)
      }
    }
  },
  methods: {
    async getOrderData() {
      const { data } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (data.meta.status !== 200) return this.$message.error('数据请求失败')
      this.orderList = data.data
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getOrderData()
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getOrderData()
    },
    handleChange(val) {
      console.log(val)
    },
    editDialogClose() {
      this.$refs.editRuleForm.clearValidate()
      this.eidtDialog.cascader.value = []
      this.eidtDialog.editRuleForm = {}
    }
  },
  created() {
    this.getOrderData()
  }
}
</script>

<style scoped></style>

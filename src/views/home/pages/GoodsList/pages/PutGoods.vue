<template>
  <el-dialog title="商品修改" :visible.sync="dialogVisible" width="40%">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="商品名称" prop="goods_name">
        <el-input type="textarea" ref="inputFocus" v-model="ruleForm.goods_name"></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="goods_price">
        <el-input v-model.number="ruleForm.goods_price"></el-input>
      </el-form-item>
      <el-form-item label="数量" prop="goods_number">
        <el-input v-model.number="ruleForm.goods_number"></el-input>
      </el-form-item>
      <el-form-item label="重量" prop="goods_weight">
        <el-input v-model.number="ruleForm.goods_weight"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="postRoles">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      rules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
          { type: 'number', message: '价格必须是数字', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
          { type: 'number', message: '商品数量必须是数字', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
          { type: 'number', message: '商品重量必须是数字', trigger: 'blur' }
        ]
      },
      ruleForm: {},
      list: {}
    }
  },
  methods: {
    async getGoodsListById(id) {
      const { data } = await this.$http.get(`goods/${id}`)
      if (data.meta.status !== 200) return this.$message('data.meta.msg')
      this.ruleForm = data.data
    },
    show(list) {
      this.list = list
      this.getGoodsListById(list.goods_id)
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.inputFocus.focus()
      })
    },
    postRoles() {
      this.$refs.ruleForm.validate(async vali => {
        if (!vali) return this.$message.error('数据验证错误')
        const { data } = await this.$http.put(`goods/${this.list.goods_id}`, this.ruleForm)
        if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
        this.list.goods_price = data.data.goods_price
        this.list.goods_name = data.data.goods_name
        this.list.goods_number = data.data.goods_number
        this.list.goods_weight = data.data.goods_weight
        this.dialogVisible = false
      })
    },
    closeDialog() {
      this.$refs.ruleForm.resetFields()
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
</style>

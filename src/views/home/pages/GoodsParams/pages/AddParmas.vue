<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" @close="$refs.ruleForm.resetFields()" width="50%">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="参数名称" prop="attr_name">
        <el-input v-model="ruleForm.attr_name"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="sendNet">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { putParamsById } from '@/network/commonApi.js'
export default {
  data() {
    return {
      // addDialog
      dialogVisible: false,
      attr_id: '',
      attr_sel: '',
      ruleForm: {
        attr_name: ''
      },
      options: 1,
      rules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    show(value, options) {
      this.attr_sel = value.attr_sel
      this.attr_id = value.attr_id
      this.options = options
      console.log(options)
      this.dialogVisible = true
    },
    sendNet() {
      this.$refs.ruleForm.validate(async val => {
        if (val) {
          if (this.options === 1) return this.postParams()
          putParamsById(this.attr_id)
        }
      })
    },
    async postParams() {
      this.ruleForm.attr_sel = this.attr_sel
      const { data } = await this.$http.post(`categories/${this.attr_id}/attributes`, this.ruleForm)
      console.log(data)
      if (data.meta.status !== 201) return this.$message.error('数据添加失败')
      this.$message.success('数据添加成功')
      this.dialogVisible = false
      this.$emit('success')
    }
  },
  computed: {
    title() {
      if (this.options === 1) {
        if (this.attr_sel === 'many') return '添加动态参数'
        return '添加静态参数'
      }
      if (this.attr_sel === 'many') return '修改动态参数'
      return '修改静态参数'
    }
  }
}
</script>

<style lang="less" scoped>
</style>

<template>
  <el-dialog title="分类参数修改" :visible.sync="dialogVisible" width="50%">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="分类名称" prop="cat_name">
        <el-input ref="inputFocus" v-model="ruleForm.cat_name"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="putCategories">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      ruleForm: { cat_name: '' },
      list: {},
      rules: {
        cat_name: [
          { required: true, message: '请输入新属性名', trigger: 'blur' },
          { min: 2, max: 7, message: '长度在 2 到 7 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    show(list) {
      this.list = list
      this.ruleForm.cat_name = list.cat_name
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.inputFocus.focus()
      })
    },
    putCategories() {
      this.$refs.ruleForm.validate(async vali => {
        if (vali) {
          const { data } = await this.$http.put(`categories/${this.list.cat_id}/attributes/${this.list.cat_pid}`, {
            attr_name: this.ruleForm.cat_name,
            attr_sel: 'many'
          })
          if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
          this.list.cat_name = this.ruleForm.cat_name
          this.dialogVisible = false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>

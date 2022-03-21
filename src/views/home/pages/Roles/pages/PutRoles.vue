<template>
  <el-dialog title="修改角色" :visible.sync="dialogVisible" width="50%">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="角色名称" prop="roleName">
        <el-input ref="inputFocus" v-model="ruleForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="ruleForm.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
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
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      },
      ruleForm: {},
      id: '',
      list: {}
    }
  },
  methods: {
    show(list) {
      this.list = list
      const o = {
        roleDesc: list.roleDesc,
        roleName: list.roleName
      }
      this.ruleForm = JSON.parse(JSON.stringify(o))
      this.id = list.id
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.inputFocus.focus()
      })
    },
    postRoles() {
      this.$refs.ruleForm.validate(async vali => {
        if (!vali) return this.$message.error('数据验证错误')
        const { data } = await this.$http.put(`roles/${this.id}`, this.ruleForm)
        if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
        this.list.roleDesc = this.ruleForm.roleDesc
        this.list.roleName = this.ruleForm.roleName
        this.dialogVisible = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>

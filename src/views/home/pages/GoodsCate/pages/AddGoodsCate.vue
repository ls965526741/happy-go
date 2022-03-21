<template>
  <!-- 添加分类对话框 -->
  <el-dialog title="添加分类" @close="dialogClose" :visible.sync="addDialogVisible" width="50%">
    <el-form ref="cateFormRef" :model="cateForm" :rules="cateFormRoles" label-width="100px">
      <el-form-item label="分类名称：" prop="cat_name">
        <el-input v-model="cateForm.cat_name"></el-input>
      </el-form-item>
      <el-form-item label="父级分类：">
        <el-cascader
          v-model="cascaderValue"
          :options="cascaderList"
          :props="cascaderProps"
          @change="handleChange"
          clearable
          change-on-select
        ></el-cascader>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addDialog">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      isChange: true,
      addDialogVisible: false,
      cateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      cateFormRoles: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      cascaderValue: [],
      cascaderList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  methods: {
    // 显示添加分类对话框
    async show() {
      if (this.isChange) {
        const { data } = await this.$http.get('categories', {
          params: { type: 2 }
        })
        this.cascaderList = data.data
      }
      this.isChange = false
      this.addDialogVisible = true
    },
    // 关闭对话框事件
    dialogClose() {
      this.$refs.cateFormRef.resetFields()
      this.cascaderValue = []
      this.cateForm = {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      }
    },
    // 监听cascader属性的变化
    handleChange(val) {
      if (val.length === 0) {
        this.cateForm.cat_pid = 0
        this.cateForm.cat_level = 0
      } else if (val.length === 1) {
        const pid = val[0]
        this.cateForm.cat_pid = pid
        this.cateForm.cat_level = 1
      } else {
        const pid = val[1]
        this.cateForm.cat_pid = pid
        this.cateForm.cat_level = 2
      }
    },
    // 添加产品分类
    async addDialog() {
      const { data } = await this.$http.post('categories', this.cateForm)
      if (data.meta.status !== 201) return this.$message.error('数据添加失败')
      this.addDialogVisible = false
      this.$message.success('数据添加成功')
      this.$emit('addSuccess')
      this.isChange = true
    }
  }
}
</script>

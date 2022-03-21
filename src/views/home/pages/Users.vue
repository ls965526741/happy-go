<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 搜索 添加用户数据 -->
      <el-row :gutter="20">
        <el-col :span="10"
          ><el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getUserData"
            ><el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button></el-input
        ></el-col>
        <el-col :span="6">
          <el-button v-permission type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="tableData" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="头像" width="80px">
          <template slot-scope="scoped">
            <div class="user_image"><img style="" :src="scoped.row.user_img" alt="" /></div>
          </template>
        </el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#409eff"
              inactive-color="#dcdfe6"
              @change="userDataChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editData(scope.row)"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteUserData(scope.row)"></el-button>
            <!-- 文字提示 -->
            <el-tooltip content="角色分配" placement="top-end" :enterable="false">
              <el-button type="warning" size="mini" icon="el-icon-scissors" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[2, 4]"
        :page-size="2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户数据对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" @close="addDialogClosed" width="50%">
      <el-form :model="addForm" :rules="addFormrules" ref="addForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户数据对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" @close="editDialogClosed" width="50%">
      <el-form :model="editForm" :rules="editFormrules" ref="editFormRef" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" clearable prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" clearable prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="roleDialogVisible" width="50%">
      <p>当前用户：{{ roleList.username }}</p>
      <p>当前角色：{{ roleList.role_name }}</p>
      <p>
        分配角色：
        <el-select v-model="currentRole" placeholder="请选择">
          <el-option v-for="item in roleListData" :key="item.id" :label="item.roleName" :value="item.id"> </el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSetRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 手机号的验证
    const checkPhone = (rule, value, callback) => {
      const reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/

      if (!value) {
        return callback(new Error('手机号不能为空'))
      }
      if (value.length < 11) {
        return callback(new Error('手机号必须十一位'))
      }
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('请输入合法的手机号'))
      }
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      tableData: [],
      total: 0,
      dialogVisible: false,
      // 添加表单的数据区
      addForm: {
        username: 'ads',
        password: '123123',
        email: '11@qq.com',
        mobile: '19811111111'
      },
      addFormrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [{ validator: checkPhone, trigger: 'blur' }]
      },
      // 修改表单的数据区
      editDialogVisible: false,
      editCurrentId: '',
      editForm: {
        username: '',
        email: '',
        mibile: ''
      },
      editFormrules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [{ validator: checkPhone, trigger: 'blur' }]
      },
      roleList: {},
      roleDialogVisible: false,
      currentRole: '',
      roleListData: {}
    }
  },
  methods: {
    // 数据请求
    async getUserData() {
      const { data } = await this.$http.get('users', { params: this.queryInfo })
      // console.log(data.data)
      this.tableData = data.data.users
      this.total = data.data.total
    },
    // 分页功能区

    // 一页几条数据
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getUserData()
    },
    // 切换到第几页
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getUserData()
    },
    // 修改用户状态
    async userDataChange(val) {
      const { data: res } = await this.$http.put(`users/${val.id}/state/${val.mg_state}`)
      if (res.meta.status !== 200) {
        this.$message.error('数据提交失败')
        val.mg_state = !val.mg_state
      } else this.$message.success('数据提交成功')
    },
    // 搜索用户
    searchUser() {
      this.getUserData()
    },
    // 关闭对话框
    addDialogClosed() {
      this.$refs.addForm.resetFields()
    },
    // 添加用户
    addUser() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return
        const { data } = await this.$http.post('users', this.addForm)
        if (data.meta.status === 201) {
          this.$message.success('数据添加成功')
          this.getUserData()
        } else {
          // console.log(data)
          this.$message.success('数据添加失败')
        }
        this.dialogVisible = false
      })
    },
    // 获取修改用户对话框的用户信息
    async editData(val) {
      this.editCurrentId = val.id
      const { data } = await this.$http.get(`users/${val.id}`)
      if (data.meta.status === 200) {
        this.editForm = data.data
        this.editDialogVisible = true
      } else {
        this.$message.delete('数据获取失败')
      }
      // console.log(data)
    },
    // 关闭添加用户对话框
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户数据
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data } = await this.$http.put(`users/${this.editCurrentId}`, this.editForm)
        if (data.meta.status !== 200) {
          return this.$message.error('数据修改失败')
        } else {
          this.$message.success('数据修改成功')
          this.getUserData()
          this.editDialogVisible = false
        }
      })
    },
    // 删除用户信息
    deleteUserData(val) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data } = await this.$http.delete(`users/${val.id}`)
          // console.log(data)
          if (data.meta.status === 200) {
            this.$message.success('删除成功')
            this.getUserData()
          } else {
            this.$message.error('删除失败')
          }
        })
        .catch(() => {
          this.$message.error('已取消删除')
        })
    },
    // 打开分配角色对话框
    async setRole(val) {
      this.editCurrentId = val.id
      const { data } = await this.$http.get('roles')
      if (data.meta.status !== 200) {
        return this.$message.error('角色信息获取失败')
      }
      this.roleListData = data.data
      // console.log(data.data)
      this.roleList = val
      this.roleDialogVisible = true
    },
    // 修改用户角色
    async saveSetRole() {
      const { data } = await this.$http.put(`users/${this.editCurrentId}/role`, { rid: this.currentRole })
      if (data.meta.status !== 200) return this.$message.error('数据提交失败')
      this.getUserData()
      this.$message.success('数据提交成功')
      this.currentRole = ''
      this.roleDialogVisible = false
    }
  },
  created() {
    this.getUserData()
  }
}
</script>

<style lang='less' scoped>
.el-table {
  margin-top: 10px !important;
  margin-bottom: 10px !important;
}
.user_image {
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 40px;
    display: block;
    border-radius: 5px;
  }
}
</style>

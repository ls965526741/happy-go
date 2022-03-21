<template>
  <!-- 表单 -->
  <el-form :model="input" ref="loginForm" :rules="rules" label-width="80px">
    <el-form-item label="用户名" prop="username">
      <el-input placeholder="请输入用户名" prefix-icon="el-icon-user" v-model="input.username" id="username">
      </el-input>
    </el-form-item>
    <el-form-item label="用户密码" prop="password">
      <el-input placeholder="请输入密码" prefix-icon="el-icon-view" v-model="input.password" show-password></el-input>
    </el-form-item>
    <div class="button">
      <el-button type="primary" @click="getUserInfo">提交</el-button>
      <el-button type="primary" @click="resetUserInfo">重置</el-button>
    </div>
    <DragCerifyImgChip ref="DragCerifyImgChip" class="img_chip" @passcallback="loginBack"></DragCerifyImgChip>
  </el-form>
</template>

<script>
import DragCerifyImgChip from '@/components/DragCerifyImgChip'
export default {
  components: {
    DragCerifyImgChip
  },
  data() {
    return {
      // 表单数据
      input: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则
      rules: {
        username: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 4, max: 16, message: '长度在 4 到 16 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          {
            min: 5,
            max: 10,
            message: '长度在 5 到 10 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 滑块验证
    getUserInfo() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          this.$refs.DragCerifyImgChip.show()
        } else {
          return false
        }
      })
    },
    // 用户登录
    async loginBack() {
      this.$refs.DragCerifyImgChip.close()
      const res = await this.$http.post('login', {
        username: this.input.username,
        password: this.input.password
      })
      const status = res.data.meta.status
      if (status === 200) {
        this.$message.success(res.data.meta.msg + '!')
        const token = res.data.data.token
        const id = res.data.data.id
        sessionStorage.setItem('token', token)
        sessionStorage.setItem('userId', id)
        const redirect = this.$router.currentRoute.fullPath.redirect
        if (redirect) return this.$router.push(redirect)
        this.$router.push('/home')
      } else if (status === 400) {
        this.$message.warning(res.data.meta.msg + '!')
      } else {
        this.$message.error('接口错误')
      }
    },
    // 重置表单数据
    resetUserInfo() {
      this.$refs.loginForm.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.button {
  display: flex;
  justify-content: center;
}
.img_chip {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
}
</style>

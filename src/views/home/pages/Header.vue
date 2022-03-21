<template>
  <div class="header">
    <div class="log_out">
      <div>title</div>
      <div>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <i class="el-icon-bell"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
              <el-tab-pane label="@我" name="first">
                <div class="my_message">
                  <i class="el-icon-chat-line-round"></i>
                  <div>你已查看所有@我</div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="通知" name="second">
                <div class="my_message">
                  <i class="el-icon-document"></i>
                  <div>你已查看所有通知</div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="私信" name="third">
                <div class="my_message">
                  <i class="el-icon-message"></i>
                  <div>你已查看所有私信</div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <img v-if="userList.user_img" :src="userList.user_img" alt="" />
            <img v-else src="/assets/img/no_user_img.png" alt="" />
            {{ userList.username }}
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-user" command="setting">个人设置</el-dropdown-item>
            <el-dropdown-item icon="el-icon-switch-button" command="backLogo">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!-- 修改个人信息dialog -->
    <el-dialog title="修改个人信息" :visible.sync="dialogVisible" width="60%">
      <el-tabs tab-position="left">
        <el-tab-pane label="基本设置">
          <el-form :model="userList" :rules="rules" ref="ruleFous" label-width="80px">
            <el-form-item label="用户名">
              <el-input disabled v-model="userList.username"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input disabled v-model="userList.email"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="mobile">
              <el-input v-model="userList.mobile"></el-input>
            </el-form-item>
            <el-form-item label="城市">
              <el-input v-model="userList.city"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-input v-model="userList.gender"></el-input>
            </el-form-item>
          </el-form>
          <div class="user_img">
            <div @mouseover="addImage = true" @mouseout="addImage = false" @click="showCropper">
              <img v-if="userList.user_img" :src="userList.user_img" alt="" />
              <img v-else src="/assets/img/no_user_img.png" alt="" />
              <i class="el-icon-plus" :style="addImage === true ? 'display:block' : ''"></i>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="安全设置">配置管理</el-tab-pane>
        <el-tab-pane label="绑定账号">角色管理</el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFalse">取 消</el-button>
        <el-button type="primary" @click="dialogTrue">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 图片剪切 -->
    <cropper dialogTitle="修改头像" ref="cropper" @getCropBlob="getCropBlob"></cropper>
  </div>
</template>

<script>
import Cropper from '@/components/Cropper/index.vue'
export default {
  components: {
    Cropper
  },
  created() {
    this.getUser()
  },
  data() {
    return {
      userList: {},
      rules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
      },
      dialogVisible: false,
      activeName: 'first',
      addImage: false
    }
  },
  methods: {
    async getUser() {
      const userInfo = sessionStorage.getItem('userInfo')
      if (userInfo !== 'undefined' && userInfo !== null) {
        this.userList = JSON.parse(userInfo)
        return
      }
      const { data } = await this.$http.get(`./users/${sessionStorage.getItem('userId')}`)
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg || '网络请求失败！')
      sessionStorage.setItem('userInfo', JSON.stringify(data.data))
      this.userList = data.data
    },
    // 修改个人信息
    async putUser() {
      const { data } = await this.$http.put(`./users/${sessionStorage.getItem('userId')}`, this.userList)
      if (data.meta.status !== 200) return this.$message.error('数据修改失败')
      this.userList = data.data
      sessionStorage.setItem('userInfo', JSON.stringify(data.datad))
      this.dialogVisible = false
    },
    // 上传图片
    async upload(img) {
      const { data } = await this.$http.post('/upload', img)
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
      this.userList.user_img = data.data.url
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleCommand(command) {
      switch (command) {
        case 'backLogo':
          sessionStorage.removeItem('token')
          sessionStorage.removeItem('userInfo')
          this.$router.push('/login')
          break
        case 'setting':
          this.dialogVisible = true
          break
      }
    },
    // dialog区
    dialogTrue() {
      this.$refs.ruleFous.validate(vali => {
        if (!vali) return
        this.putUser()
      })
    },
    dialogFalse() {
      this.$refs.ruleFous.resetFields()
      this.dialogVisible = false
    },
    // cropper区
    showCropper() {
      this.$refs.cropper.show()
    },
    async getCropBlob(blob) {
      this.$refs.cropper.hide()
      const formData = new FormData()
      formData.append('file', blob, 'data.jpg')
      this.upload(formData)
    }
  }
}
</script>

<style lang="less" scoped>
.log_out {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  z-index: 100;
  height: 60px;
  background-color: #f5f5f5;
  div:nth-child(1) {
    padding-left: 20px;
  }
  div:nth-child(2) {
    display: flex;
    align-items: center;
    .el-dropdown {
      padding-right: 20px;
    }
  }
}
.el-dropdown-item i {
  color: #f56c6c;
}
.my_message {
  width: 100%;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #a3a3a3;
  i {
    font-size: 40px;
    padding-bottom: 10px;
  }
  div {
    color: 14px;
  }
}
.el-dropdown-link {
  display: flex;
  align-items: center;
  img {
    width: 40px;
    border-radius: 50%;
    height: 40px;
    margin-right: 20px;
  }
}
.el-icon-bell {
  font-size: 24px;
  font-weight: 700;
}

.el-tab-pane {
  display: flex;
  .el-form {
    flex: 5;
  }
  div {
    flex: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    img {
      width: 80%;
      border-radius: 50%;
      margin: auto;
      text-align: center;
    }
    i {
      display: none;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 50px;
      color: #f5f7fa;
    }
  }
}
</style>

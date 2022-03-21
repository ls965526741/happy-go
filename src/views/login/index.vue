<template>
  <div class="contain">
    <div class="main">
      <login v-show="currentPage === 'login'"></login>
      <register v-show="currentPage === 'register'"></register>
      <forget-password v-show="currentPage === 'forgetPassword'"></forget-password>
      <div v-show="currentPage !== 'register'" class="link_box">
        <span @click="currentPage = 'register'">注册</span>
      </div>
      <div v-show="currentPage !== 'login'" class="link_box"><span @click="currentPage = 'login'">登陆</span></div>
      <div v-show="currentPage !== 'forgetPassword'" class="link_box">
        <span @click="currentPage = 'forgetPassword'">忘记密码</span>
      </div>
    </div>
    <div class="info-footer">
      <div class="info-beian"><i class="iconfont icon-copyright2"></i> 2021 HAPPY GO | 粤ICP备19028126号-1</div>
    </div>
  </div>
</template>
<script>
import Login from './pages/Login.vue'
import Register from './pages/Register.vue'
import ForgetPassword from './pages/Forget.vue'
export default {
  components: {
    Login,
    Register,
    ForgetPassword
  },
  data() {
    return {
      currentPage: 'login'
    }
  },
  methods: {}
}
</script>
<style lang="less" scoped>
.contain {
  width: 100vw;
  height: 100vh;
  position: relative;
  background-image: linear-gradient(-225deg, #d4ffec 0%, #57f2cc 48%, #4596fb 100%);
  .main {
    background-color: #fff;
    position: absolute;
    display: flex;
    flex-direction: column;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 5px;
    padding: 20px;
    .link_box span {
      font-size: 14px;
      padding: 15px;
      display: inline-block;
    }
  }
}
.info-footer {
  position: absolute;
  left: 50%;
  bottom: 60px;
  transform: translateX(-50%);
}
</style>

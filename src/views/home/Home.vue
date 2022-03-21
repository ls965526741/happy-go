<template>
  <div class="home">
    <el-container class="conntainer">
      <el-container>
        <el-aside :width="isToggle ? '64px' : '300px'">
          <el-menu
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#1c9eff"
            :unique-opened="true"
            :collapse="isToggle"
            :collapse-transition="false"
            :router="true"
            :default-active="asideBarActive"
          >
            <el-header>
              <img src="assets/img/logo.png" alt="" />
              <h1 v-if="!isToggle">{{ loginTitle }}</h1>
            </el-header>
            <el-submenu v-for="item in menuData" :key="item.id" :index="item.id.toString()">
              <template slot="title">
                <i :class="fontData[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <el-menu-item-group v-for="childrenItem in item.children" :key="childrenItem.id">
                <el-menu-item
                  :index="childrenItem.path.toString()"
                  @click="asideBarActive = childrenItem.path.toString()"
                >
                  <template slot="title">
                    <i :class="fontData[item.id]"></i>
                    <span>{{ childrenItem.authName }}</span>
                  </template>
                  {{
                }}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <div class="toggle-button" @click="isToggle = !isToggle">|||</div>
          </el-menu>
        </el-aside>
        <el-main>
          <home-header></home-header>
          <div class="router">
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { title } from '@/config/settings.js'
import HomeHeader from './pages/Header.vue'
export default {
  components: {
    HomeHeader
  },
  data() {
    return {
      menuData: [],
      fontData: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isToggle: false,
      asideBarActive: '',
      userList: {}
    }
  },
  created() {
    this.getMenuData()
    this.getUser()
    this.screenChange()
  },
  methods: {
    // 监听屏幕变化
    screenChange() {
      addEventListener('resize', () => {
        const clientWidth = document.documentElement.clientWidth || document.body.clientHeight
        if (clientWidth < 1029) return (this.isToggle = true)
        this.isToggle = false
      })
    },
    async getMenuData() {
      const { data } = await this.$http.get('menus')
      this.menuData = data.data
    },
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
    }
  },
  computed: {
    loginTitle() {
      return title.charAt(0).toUpperCase() + title.slice(1)
    }
  }
}
</script>
<style lang="less" scoped>
.home,
.conntainer,
.el-menu {
  height: 100%;
  border-right: 0px;
}
.el-aside {
  position: relative;
  .el-header {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #292a2d;
    h1 {
      color: #fff;
    }
    img {
      width: 45px;
      margin-right: 10px;
    }
  }
}
.el-main {
  padding: 0;
  max-height: 100vh;
  .router {
    padding: 20px;
    height: calc(100vh - 60px);
    box-sizing: border-box;
    overflow: scroll;
  }
}
.iconfont {
  padding-right: 5px;
}
.toggle-button {
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  letter-spacing: 4px;
  background-color: #292a2d;
  line-height: 40px;
  cursor: pointer;
}
</style>

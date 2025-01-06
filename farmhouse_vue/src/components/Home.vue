<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span>农家乐后台管理系统</span>
        </div>
        <div style="display: flex; align-items: center;">
          <div style="margin-right: 20px; font-size: 15px;"><el-tag effect="dark">{{ getradio() }}</el-tag>：<el-tag>{{ uname }}</el-tag></div>
          <div>
           <el-button type="success" @click="Front()">前台</el-button>
            <el-button type="danger" @click="logout()">退出</el-button>
          </div>
        </div>
      </div>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollpase ? '85px' : '200px'">
        <div class="toggle">
          <el-button :icon="icon" @click="toggleCollpase"></el-button>
        </div>
        <el-menu background-color="#313334" text-color="#fff" active-text-color="#409EFF" unique-opened router
          :default-active="activePath" :collapse="isCollpase" :collapse-transition="false">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.navname }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subitem.path" v-for="subitem in item.children" :key="subitem.id"
              @click="saveNaveState('/' + subitem.path)">
              <i class="el-icon-menu"></i>
              <span slot="title">{{ subitem.navname }}</span>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>

      <!-- 右侧内容主题 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>

  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      iconObj: {
        '1': 'iconfont icon-users',
        '2': 'iconfont icon-nongjiale',
        '3': 'iconfont icon-meishi',
        '4': 'iconfont icon-kefang',
        '5': 'iconfont icon-baozhengyudingfangjianbaozheng',
        '6': 'iconfont icon-liuyan'
      },
      //激活的链接
      activePath: '',
      icon: 'el-icon-s-fold',
      isCollpase: false,
      uname: '',
      radio: '',
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
    var uname = localStorage.getItem("uname");
    var radio = localStorage.getItem("radio");
    var user = JSON.parse(JSON.stringify(uname));
    this.uname = user
    this.radio = radio
  },
  methods: {
    getradio() {
      console.log('radio',this.radio);
      if (this.radio == '0') {
        return "管理员";
      } else if (this.radio == '1') {
        return "用户";
      } else if(this.radio == '2'){
        return "商家";
      }
    },
    Front(){
      this.$router.push('/userpage')
    },
    // 退出登录
    logout() {
      window.sessionStorage.clear();
      window.localStorage.clear();
      this.menulist = ''
      this.$router.push('/login')
    },

    toggleCollpase() {
      this.isCollpase = !this.isCollpase
      if (this.icon === 'el-icon-s-unfold') {
        this.icon = 'el-icon-s-fold'
      } else {
        this.icon = 'el-icon-s-unfold'
      }
    },
    // 获取菜单
    getMenuList() {
      var radio = localStorage.getItem('radio')
      if (radio == '0') {
        this.getlist0()

      } else if (radio == '1') {
        this.getlist1()

      } else {
        this.getlist2()

      }
    },
    async getlist0() {
      const { data: res } = await this.$http.get('list/0')
      if (res.meta.status !== 200) return this.$message.error('获取失败！')
      this.menulist = res.data
    },
    async getlist1() {
      const { data: res } = await this.$http.get('list')
      if (res.meta.status !== 200) return this.$message.error('获取失败！')
      this.menulist = res.data
    },
    async getlist2() {
      const { data: res } = await this.$http.get('list/2')
      if (res.meta.status !== 200) return this.$message.error('获取失败！')
      this.menulist = res.data
    },

    //保存链接的激活状态
    saveNaveState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100vh;
}

.el-header {
  background-color: #313334;
  color: #333;
  text-align: center;
  line-height: 60px;

  >div {
    display: flex;
    justify-content: space-between;
    color: white;
    font-size: 20px;

  }
}

a {
  text-decoration: none;
}
.el-aside {
  background-color: #313334;
  color: #333;

  .el-menu {
    border-right: none;
  }
}

.toggle {
  font-size: 10px;
  line-height: 24px;
  color: #333;
  text-align: center;

  .el-button {
    width: 100%;
    background-color: #333;
    color: white;
    border: 0px;
  }
}

.el-main {
  background-color: #E9EEF3;
  color: #333;

}

body>.el-container {
  margin-bottom: 40px;
}

.iconfont {
  margin: 15px;
}
</style>
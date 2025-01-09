<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header style="height: 380px;width: 100%;">
      <!-- 导航栏 -->
      <el-menu class="menu" mode="horizontal">
        <router-link to="/">
          <el-menu-item index="1">首页</el-menu-item>
        </router-link>
        <router-link to="/agritainmentPage">
          <el-menu-item index="2">农家乐</el-menu-item>
        </router-link>
        <router-link to="/foodPage">
          <el-menu-item index="3">美食信息</el-menu-item>
        </router-link>
        <router-link to="/roomPage">
          <el-menu-item index="4">客房信息</el-menu-item>
        </router-link>
        <router-link to="/information">
          <el-menu-item index="5">个人信息</el-menu-item>
        </router-link>
        <router-link to="/home">
          <el-menu-item index="5">后台管理</el-menu-item>
        </router-link>
      </el-menu>

      <!-- 轮播图 -->
      <el-carousel trigger="click" height="300px">
        <el-carousel-item v-for="item in images" :key="item.index">
          <img :src="item.src" :alt="item.alt">
        </el-carousel-item>
      </el-carousel>


    </el-header>

    <!-- 内容 -->
    <el-main>
      <el-card class="box-card">
        <el-row class="card-title">
          农家乐推荐
        </el-row>
        <el-row class="npic-card" :gutter="20">
          <el-col :span="4" v-for="item in Agritourism" :key="item.nid">
            <div class="grid" @click="goToDetail(item.nid)">
              <div> <img :src="`http://localhost:3000${item.npic}`" alt=""></div>
              <div> <span>{{ item.nname }}</span></div>
            </div>
          </el-col>
        </el-row>
        <el-row style="text-align: center;"><router-link to="/agritainmentPage">更多推荐 >></router-link></el-row>
      </el-card>

      <el-card class="box-card">
        <el-row class="card-title">
          美食推荐
        </el-row>
        <el-row class="npic-card" :gutter="20">
          <el-col :span="4" v-for="item in Food" :key="item.mid">
            <div class="grid" @click="goToFoodDetail(item.mid)">
              <div> <img :src="`http://localhost:3000${item.mpic}`" alt=""></div>
              <div> <span>{{ item.mname }}</span></div>
            </div>
          </el-col>
        </el-row>
        <el-row style="text-align: center;"> <router-link to="/foodPage">更多推荐 >></router-link></el-row>
      </el-card>

      <el-card class="box-card">
        <el-row class="card-title">
          客房推荐
        </el-row>
        <el-row class="npic-card" :gutter="20">
          <el-col :span="4" v-for="item in Room" :key="item.zid">
            <div class="grid" @click="goToRoomDetail(item.zid)">
              <div> <img :src="`http://localhost:3000${item.zpic}`" alt=""></div>
              <div> <span>{{ item.zname }}</span></div>
            </div>
          </el-col>
        </el-row>
        <el-row style="text-align: center;"><router-link to="/roomPage">更多推荐 >></router-link></el-row>
      </el-card>

    </el-main>

    <!-- footer -->
    <!-- <el-footer> Footer</el-footer> -->
  </el-container>
</template>

<script>
export default {
  created() {
    this.getAgritourism()
    this.getRoom()
    this.getFood()
  },
  data() {
    return {
      Agritourism: [],
      Room: [],
      Food: [],
      images: [
        { src: require('../../../public/images/bg3.jpg'), alt: '图片1' },
        { src: require('../../../public/images/bg4.jpg'), alt: '图片2' },
        { src: require('../../../public/images/bg7.jpg'), alt: '图片3' },
        { src: require('../../../public/images/bg8.jpg'), alt: '图片4' }
      ]
    }
  },
  methods: {
    goTo(path) {
      this.$router.push(path)
    },
    // 获取农家乐信息
    async getAgritourism() {
      const { data: res } = await this.$http.get('/agritourism/asPage')
      if (res.status !== 200) return
      this.Agritourism = res.data
      // console.log('1', this.Agritourism);
    },
    //获取农家乐详细信息
    goToDetail(nid) {
      console.log(nid);
      this.$router.push({ name: 'farmstayDetail', params: { nid } })
    },
    //获取美食的信息
    async getFood() {
      const { data: res } = await this.$http.get('/food/asPage')
      if (res.status !== 200) return
      this.Food = res.data
      // console.log('3', this.Room);
    },
    //获取美食详细信息
    goToFoodDetail(mid) {
      console.log(mid);
      this.$router.push({ name: 'foodDetail', params: { mid } })
    },
    //获取客房信息
    async getRoom() {
      const { data: res } = await this.$http.get('/room/asPage')
      if (res.status !== 200) return
      this.Room = res.data
      // console.log('2', this.Room);
    },
    //获取客房的详细信息
    goToRoomDetail(zid) {
      console.log(zid);
      this.$router.push({ name: 'roomDetail', params: { zid } })
    },
  },

}
</script>

<style lang="less" scoped>
.home-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 2200px;

}

.el-header {
  text-align: center;
  position: relative;

  .el-menu {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    border-radius: 10px;
    width: 100%;
    box-shadow: rgba(168, 225, 202, 0.35) 0px 5px 15px;
  }
}
.el-carousel{
  margin-top: 10px;
  border-radius: 40px 0 40px 0;
}
a {
  text-decoration: none;
}

.router-link-active {
  text-decoration: none;
}

.title {
  margin-top: 20px;
  font-size: 30px;
  font-weight: bold;
  color: white;
}

//内容
.el-main {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
}

//卡片内容
.box-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 95%;
  height: 100%;
  border-radius: 20px;
  margin-bottom: 20px;

  .grid {
    text-align: center;
    margin-bottom: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

    span {
      font-size: 10px;
    }
  }

  .el-card {
    display: flex;
    flex-direction: column;
  }
}

.card-title {
  font-family: 'Helvetica Neue', sans-serif;
  font-size: 24px;
  color: #333;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 4px;
  text-shadow: 2px 2px #d2caca;

  margin: 0 auto;
  line-height: 70px;
  font-weight: bold;
  border-radius: 40px;
  width: 91%;
  height: 70px;
  border: 1px solid white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
}

.npic-card {
  img {
    margin-top: 10px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    height: 150px;
    width: 150px;
  }

}

.grid:hover  {
  transform: scale(1.1);
}

.grid:hover span {
  font-weight: bold;
}

.grid-content {
  margin: 0 auto;
  text-align: center;
}

.el-footer {
  font-size: 1.2rem;
  padding: 20px;
  text-align: center;
  color: gray;
}
</style>
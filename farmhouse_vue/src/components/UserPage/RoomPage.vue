<template>
  <div class="farmstay-detail">
    <div>
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
    </div>

    <div class="mbx">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>客房</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-card class="card-center">
      <el-row :gutter="20">
        <el-col :span="5">
          <el-input placeholder="客房名称" v-model="keyword1" clearable @clear="getFarmstay"></el-input>
        </el-col>
        <el-col :span="5">
          <el-input placeholder="客房类型" v-model="keyword2" clearable @clear="getFarmstay"></el-input>
        </el-col>
        <el-col :span="5">
          <el-input placeholder="农家乐名称" v-model="keyword3" clearable @clear="getFarmstay"></el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="getFarmstay" icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>
      <!-- 农家乐内容 -->
      <el-row class="npic-card" :gutter="20">
        <el-col :span="6" v-for="item in Farmstay" :key="item.zid">
          <div class="grid" @click="goToDetail(item.zid)">
            <div> <img :src="`http://localhost:3000${item.zpic}`" alt=""></div>
            <div> <span>{{ item.zname }}</span></div>
          </div>
        </el-col>
      </el-row>
      <el-row :span="24" style="text-align: center;" :gutter="20">
        <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" background
          layout="prev, pager, next" :total="total">
        </el-pagination>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import dayjs from 'dayjs';
export default {
  created() {
    this.getFarmstay();
  },
  computed: {
    formattedTime() {
      return (time) => dayjs(time).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 12,
      total: 0,
      keyword1: '',
      keyword2: '',
      keyword3: '',
      Farmstay: [],
      Message: [],
      currentTab: 'details'
    }
  },
  methods: {
    //获取美食信息
    async getFarmstay() {
      const params = {
        keyword1: this.keyword1,
        keyword2: this.keyword2,
        keyword3: this.keyword3,
        offset: (this.currentPage - 1) * this.pageSize,
        limit: this.pageSize,
      };
      const { data: res } = await this.$http.get('/room', { params })
      this.Farmstay = res.rows
      this.total = res.count;

      console.log(res);
    },
    //获取美食详细信息
    goToDetail(zid) {
      console.log(zid);
      this.$router.push({ name: 'roomDetail', params: { zid } })
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getFarmstay()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.currentPage = newPage
      this.getFarmstay()
    },
  }
}
</script>

<style scoped lang="less">
.menu {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  border-radius: 10px;
  border: 1px solid rgb(237, 228, 228);
  box-shadow: 3px 5px 8px 0 rgba(27, 133, 220, 0.2);

}

.mbx {
  margin-top: 10px;
  border: 1px solid rgb(239, 239, 239);
  box-shadow: 3px 5px 8px 0 rgba(59, 143, 212, 0.2);
}

.el-breadcrumb {
  font-size: 15px;
  margin-top: 20px;
  margin-left: 20px;
}


.card-center {
  margin-top: 10px;

  .el-row {
    margin-top: 30px;
  }
}

a {
  text-decoration: none;
}

.router-link-active {
  text-decoration: none;
}

.npic-card {
  img {
    margin-top: 10px;
    box-shadow: 0 4px 8px rgba(221, 216, 216, 0.2);
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

.grid {
  border: 1px solid rgb(228, 227, 227);
  text-align: center;
  margin-bottom: 20px;
  margin-right: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  span {
    font-size: 5px;
  }
}

.box-card {
  margin-top: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}

.clearfix {
  .el-button {
    transform: skew(-20deg);
  }
}

.comment {
  margin-bottom: 5px;
}

.conentright {
  h3 {
    margin-left: 25px;
  }
}

.user-name {
  font-size: 18px;
  font-weight: bold;
}

.message-time {
  text-align: right;
}

.farmstay-detail {
  max-width: 1000px;
  margin: 0 auto;
}

.farmstay-image {
  width: 100%;
  height: 60%;
}</style>
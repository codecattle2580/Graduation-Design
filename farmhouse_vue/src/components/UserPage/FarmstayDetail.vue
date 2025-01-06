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

        <el-row v-for="item in Farmstay" :key="item.index" class="title">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/agritainmentPage' }">农家乐</el-breadcrumb-item>
                <el-breadcrumb-item>{{ item.nname }}</el-breadcrumb-item>
            </el-breadcrumb>
        </el-row>

        <el-row v-for="item in Farmstay" :key="item.nid" class="elrow">
            <el-col :span="10" class="imgleft">
                <img :src="`http://localhost:3000${item.npic}`" alt="Farmstay Image" class="farmstay-image">
            </el-col>
            <el-col :span="10">
                <el-form :model="item" label-position="left" label-width="100px" class="conentright">
                    <h2>{{ item.nname }}</h2>
                    <el-form-item label="类型：">{{ item.ntype }}</el-form-item>
                    <el-form-item label="地址：">{{ item.naddress }}</el-form-item>
                    <el-form-item label="电话：">{{ item.nphone }}</el-form-item>
                </el-form>
            </el-col>
        </el-row>

        <el-card class="box-card" v-for="item in Farmstay" :key="item.index">
            <div slot="header" class="clearfix">
                <el-button @click="currentTab = 'details'">详情</el-button>
                <el-button @click="currentTab = 'comments'">评论</el-button>
            </div>

            <div v-if="currentTab === 'details'">
                <!-- 在这里展示农家乐详情页面的内容 -->
                <el-form :model="item" label-position="left" label-width="100px" class="conentright">
                    <el-form-item label="介绍">{{ item.nintroduce }}</el-form-item>
                </el-form>
            </div>

            <!-- 展示农家乐的评论 -->
            <div v-else-if="currentTab === 'comments'" v-for="comment in Message" :key="comment.index">
                <el-card class="comment">
                    <div class="user-name">{{ comment.user }}</div>
                    <el-row>
                        <el-col :span="12">
                            <el-rate v-model="comment.roomgrade" disabled></el-rate>
                        </el-col>
                        <el-col :span="12" class="message-time">{{ formattedTime(comment.messagetime) }}</el-col>
                    </el-row>
                    <div class="message-content">{{ comment.message }}</div>
                </el-card>
            </div>
        </el-card>
    </div>
</template>
  
<script>
import dayjs from 'dayjs';
export default {
    created() {
        this.getFarmstay();
        this.getMessage();
    },
    computed: {
        formattedTime() {
            return (time) => dayjs(time).format('YYYY-MM-DD HH:mm:ss');
        }
    },
    data() {
        return {
            Farmstay: [],
            Message: [],
            currentTab: 'details'
        }
    },
    methods: {
        //获取农家乐信息
        async getFarmstay() {
            const id = this.$route.params.nid;
            console.log('id值：', id);
            const { data: res } = await this.$http.post(`/agritourism/user/${id}`)
            this.Farmstay = res.data
            console.log(this.Farmstay);
        },
        async getMessage() {
            const nid = this.$route.params.nid;
            const { data: res } = await this.$http.post(`/message/getnid/${nid}`)
            if (res.status !== 200) {
                console.log('获取数据失败');
            } else {
                this.Message = res.data
            }
            console.log(this.Message);
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
    box-shadow: 3px 5px 8px 0 rgba(59, 143, 212, 0.2);

}

.title {
    margin-top: 10px;
    border: 1px solid rgb(239, 239, 239);
    box-shadow: 3px 5px 8px 0 rgba(59, 143, 212, 0.2);
}

.elrow {
    margin-top: 10px;
    border: 1px solid rgb(236, 232, 232);
    display: flex;
    align-items: center;
    box-shadow: 3px 5px 8px 0 rgba(59, 143, 212, 0.2);
}

.el-breadcrumb {
    font-size: 15px;
    margin-top: 20px;
    margin-left: 20px;
}

.imgleft {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px;

    img {
        height: 300px;
        border-radius: 20px 0;
        box-shadow: 0 4px 8px 0 rgba(246, 246, 246, 0.2);
    }
}

a {
    text-decoration: none;
}

.router-link-active {
    text-decoration: none;
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

.user-name {
    font-size: 18px;
    font-weight: bold;
}

.message-time {
    text-align: right;
}

.farmstay-detail {
    max-width: 800px;
    margin: 0 auto;
}

.farmstay-image {
    width: 100%;
    height: 60%;
}
</style>
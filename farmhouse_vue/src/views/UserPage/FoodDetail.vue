<template>
    <div class="farmstay-detail">
        <div>
            <HeaderMenu/>
        </div>

        <el-row v-for="item in Farmstay" :key="item.index" class="title">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/foodPage' }">美食</el-breadcrumb-item>
                <el-breadcrumb-item>{{ item.mname }}</el-breadcrumb-item>
            </el-breadcrumb>
        </el-row>

        <el-row v-for="item in Farmstay" :key="item.nid" class="elrow">
            <el-col :span="10" class="imgleft">
                <img :src="`http://localhost:3000${item.mpic}`" alt="Farmstay Image" class="farmstay-image">
            </el-col>
            <el-col :span="10">
                <el-form :model="item" label-position="left" label-width="100px" class="conentright">
                    <h1>{{ item.mname }}</h1>
                    <el-form-item label="类型：">{{ item.mtype }}</el-form-item>
                    <el-form-item label="农家乐："><router-link :to="'/farmstayDetail/' + item.nid">{{ item.nname }}</router-link></el-form-item>
                    <el-form-item label="类型：">{{ item.ntype }}</el-form-item>
                    <el-form-item label="电话：">{{ item.nphone }}</el-form-item>
                    <el-form-item label="地址：">{{ item.naddress }}</el-form-item> 
                </el-form>
            </el-col>
        </el-row>

        <el-card class="box-card" v-for="item in Farmstay" :key="item.index">
            <div slot="header" class="clearfix">
                <el-button @click="currentTab = 'details'">详情</el-button>
            </div>

            <div v-if="currentTab === 'details'">
                <!-- 在这里展示农家乐详情页面的内容 -->
                <el-form :model="item" label-position="left" label-width="100px" class="conentright">
                    <el-form-item label="介绍">{{ item.mflavour }}</el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>
  
<script>
import dayjs from 'dayjs';
import HeaderMenu from '@/components/bar/HeaderMenu.vue';
export default {
    components: {
        HeaderMenu
    },
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
            Farmstay: [],
            Message: [],
            currentTab: 'details'
        }
    },
    methods: {
        //获取美食信息
        async getFarmstay() {
            const id = this.$route.params.mid;
            console.log('id值：', id);
            const { data: res } = await this.$http.post(`/food/user/${id}`)
            this.Farmstay = res.data
            console.log(this.Farmstay);
        },
        goToDetail(nid) {
            console.log(nid);
            this.$router.push({ name: 'farmstayDetail', params: { nid } })
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

.toptitle {
    width: 800px;
    margin-top: 10px;
    line-height: 60px;
    margin-bottom: 20px;
    font-size: 15px;
    border: 1px solid rgb(19, 74, 161);
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);

    span {
        margin-left: 20px;
    }
}

.title {
    margin-top: 10px;
    border: 1px solid rgb(239, 239, 239);
    box-shadow: 3px 5px 8px 0 rgba(59, 143, 212, 0.2);
}

.el-breadcrumb {
    font-size: 15px;
    margin-top: 20px;
    margin-left: 20px;
}

.elrow {
    margin-top: 10px;
    border: 1px solid rgb(236, 232, 232);
    display: flex;
    align-items: center;
    box-shadow: 3px 5px 8px 0 rgba(59, 143, 212, 0.2);
}

a {
    text-decoration: none;
}

.router-link-active {
    text-decoration: none;
}

.imgleft {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px;

    img {
        height: 300px;
        border-radius: 20px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
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
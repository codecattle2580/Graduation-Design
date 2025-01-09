<template>
    <div>
        <!-- 面包屑导航栏 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户留言</el-breadcrumb-item>
            <el-breadcrumb-item>留言评论</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 查询 -->
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="5">
                    <el-input placeholder="客房名称" v-model="keyword1" clearable @clear="getList"></el-input>
                </el-col>
                <el-col :span="5">
                    <el-input placeholder="客房类型" v-model="keyword2" clearable @clear="getList"></el-input>
                </el-col>
                <el-col :span="5">
                    <el-input placeholder="农家乐名称" v-model="keyword3" clearable @clear="getList"></el-input>
                </el-col>
                <el-col :span="5">
                    <el-button type="primary" @click="getList">查询</el-button>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="5">
                    <el-button type="danger" @click="handleDelete" :disabled="sels.length === 0">批量删除</el-button>
                </el-col>
            </el-row>


            <el-table :data="list" @selection-change="selschange" border style="width: 100%">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column type="index" label="序号" align="center" :min-width="25"></el-table-column>
                <el-table-column prop="user" label="用户" align="center"></el-table-column>
                <el-table-column prop="message" label="留言内容" align="center"></el-table-column>
                <el-table-column prop="messagetime" :formatter="formatDateTime" label="留言时间" align="center"></el-table-column>
                <el-table-column prop="foodgrade" label="食物评分" align="center"></el-table-column>
                <el-table-column prop="roomgrade" label="客房评分" align="center"></el-table-column>
                <el-table-column prop="nname" label="农家乐名称" align="center"></el-table-column>
                <el-table-column prop="zname" label="客房名称" align="center"></el-table-column>
                <el-table-column prop="ztype" label="客房类型" align="center"></el-table-column>
                <el-table-column prop="zprice" label="客房价格" align="center"></el-table-column>
                <el-table-column label="操作" width="150px" align="center">
                    <template slot-scope="scope">
                        <!-- 详情 -->
                        <el-tooltip effect="dark" content="详情" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-document" size="mini"
                                @click="showDialog(scope.row.id)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                :page-sizes="[1, 2, 5, 10]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>

            <!-- 详情对话框-->
            <el-dialog title="订单详情" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
                <div class="data-container">
                    <div v-for="(item, index) in listform" :key="index">
                        <p>农家乐名称：{{ item.nname }}</p>
                        <p>农家乐类型：{{ item.ntype }}</p>
                        <p>客房名称：{{ item.zname }}</p>
                        <p>客房类型：{{ item.ztype }}</p>
                        <p>客房图片：</p>
                        <p><img :src="`http://localhost:3000${item.zpic}`"/></p>
                        <p>客房设施：{{ item.zfacility }}</p>
                        <p>客房价格：{{ item.zprice }}</p>
                        <p>地址：{{ item.naddress }}</p>
                        <p>留言内容：{{ item.message }}</p>
                        <p>留言时间：{{ formattedTime(item.messagetime) }}</p>
                        <p>美食评分：{{ item.foodgrade }}</p>
                        <p>客房评分：{{ item.roomgrade }}</p>
                    </div>
                </div>
            </el-dialog>

        </el-card>
    </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
    created() {
        this.getList();
    },
    data() {
        return {
            currentPage: 1,
            pageSize: 10,
            total: 0,
            keyword1: '',
            keyword2: '',
            keyword3: '',
            list: [],
            listform: [],
            sels: [],//删除id
            dialogVisible: false,
        }
    },

    //计算
    computed: {
        //详情时间格式化
        formattedTime() {
            return (time) => dayjs(time).format('YYYY-MM-DD HH:mm:ss');
        }
    },
    methods: {
        //时间格式化
        formatDateTime(row, column, cellValue) {
            return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss');
        },
        //获取数据
        async getList() {
            var uname = localStorage.getItem("uname");
            var user = JSON.parse(JSON.stringify(uname));
            const params = {
                keyword1: this.keyword1,
                keyword2: this.keyword2,
                keyword3: this.keyword3,
                offset: (this.currentPage - 1) * this.pageSize,
                limit: this.pageSize,
                user:user
            };
            // console.log(params);
            const { data: res } = await this.$http.get('/message/getusername', { params })
            console.log(res);
            this.list = res.rows
            this.total = res.count;
        },
        //根据id显示留言信息
        async showDialog(id) {
            console.log(id);
            this.dialogVisible = true;
            const { data: res } = await this.$http.post(`/message/user/${id}`)
            console.log(res);
            if (res.meta.status !== 200) {
                return this.$message.error('数据获取失败！')
            }
            this.listform = res.data
        },
        //选择改变
        selschange(val) {
            this.sels = val;
            // console.log("选择了："+this.sels);
        },
        //批量删除
        async handleDelete() {
            const confirmResult = await this.$confirm(
                '此操作将永久删除选择的留言信息, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).catch((err) => err)
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除')
            }
            const ids = this.sels.map(item => item.id);
            // 发送请求到后台API
            const { data: res } = await this.$http.post(`/message/delete`, { ids })
            console.log(res);
            if (res.meta.status !== 200) {
                return this.$message.error('删除失败！')
            }
            this.$message.success('删除成功！')
            this.getList()
        },
        handleClose(done) {
            // 在对话框关闭前的处理，如果传入了done函数则需要手动调用done()来关闭对话框
            done();
        },
        // 监听 pagesize 改变的事件
        handleSizeChange(newSize) {
            this.pageSize = newSize
            this.getList()
        },
        // 监听 页码值 改变的事件
        handleCurrentChange(newPage) {
            console.log(newPage)
            this.currentPage = newPage
            this.getList()
        },
    },
}
</script>

<style lang="less" scoped>
.el-row {
    margin-bottom: 10px;
}

.el-table {
    margin-top: 10px;
}

.el-rate {
    margin-bottom: 20px;
    font-size: 32px;
}

.el-rate__text {
    font-size: 18px;
}
.data-container{
    img{
        height: 200px;
        width: 200px;
    }
}
</style>
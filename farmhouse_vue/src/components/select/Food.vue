<template>
    <div>
        <!-- 面包屑导航栏 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商家查询</el-breadcrumb-item>
            <el-breadcrumb-item>美食</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 查询 -->
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="9">
                    <el-input placeholder="请输需要查询的美食名称" v-model="keyword" clearable @clear="getList">
                        <el-button slot="append" icon="el-icon-search" @click="getList">
                        </el-button>
                    </el-input>
                </el-col>
            </el-row>
            <el-table :data="list" border style="width: 100%">
                <el-table-column type="index" label="序号" align="center" :min-width="25"></el-table-column>
                <el-table-column prop="mname" label="美食名称" align="center"></el-table-column>
                <el-table-column prop="mtype" label="类型" align="center"></el-table-column>
                <el-table-column prop="mpic" label="图片" align="center">
                    <template slot-scope="scope">
                        <el-image style="width: 100px; height: 100px" :src="`http://localhost:3000${scope.row.mpic}`"
                            fit="cover"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="nname" label="农家乐名称" align="center"></el-table-column>
                <el-table-column prop="naddress" label="地址" align="center"></el-table-column>
                <el-table-column prop="nphone" label="咨询电话" align="center"></el-table-column>
                <el-table-column label="操作" width="180px" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-document" size="mini"
                            @click="showDialog(scope.row.mid)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                :page-sizes="[1, 2, 5, 10]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        <!-- 详情对话框-->
        <el-dialog title="详情介绍" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
            <div class="data-container">
                <div v-for="(item, index) in listform" :key="index">
                    <p>农家乐名称：{{ item.nname }}</p>
                    <p>美食名称：{{ item.mname }}</p>
                    <p>图片:</p>
                    <p><img :src="`http://localhost:3000${item.mpic}`"/></p>
                    <p>类型：{{ item.mtype }}</p>
                    <p>咨询电话：{{ item.nphone }}</p>
                    <p>地址：{{ item.naddress }}</p>
                </div>
            </div>

        </el-dialog>
    </div>
</template>

<script>
export default {
    created() {
        this.getList();
    },
    data() {
        return {
            currentPage: 1,
            pageSize: 10,
            total: 0,
            keyword: '',
            list: [],
            listform: [],
            dialogVisible: false
        }
    },
    methods: {
        async getList() {
            const params = {
                keyword: this.keyword,
                offset: (this.currentPage - 1) * this.pageSize,
                limit: this.pageSize,
            };
            const { data: res } = await this.$http.get('/food', { params })
            this.list = res.rows
            this.total = res.count;
            // console.log(res);
            // console.log(this.total);
        },
        //显示对话框
        async showDialog(id) {
            console.log(id);
            this.dialogVisible = true;
            const { data: res } = await this.$http.post(`/food/user/${id}`)
            if (res.meta.status !== 200) {
                return this.$message.error('数据获取失败！')
            }
            this.listform = res.data
            console.log(this.listform);
        },
        // 关闭搜索框
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
.data-container{
    img{
        height: 200px;
        width: 200px;
    }
}
</style>
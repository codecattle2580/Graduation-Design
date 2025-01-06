<template>
    <div>
        <!-- 面包屑导航栏 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>客房预定</el-breadcrumb-item>
            <el-breadcrumb-item>订单查询</el-breadcrumb-item>
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
                    <el-button type="danger" @click="handleDelete" :disabled="sels.length === 0"
                        icon="el-icon-remove">批量删除</el-button>
                </el-col>
            </el-row>

            <el-table :data="list" @selection-change="selschange" border style="width: 100%;">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column type="index" label="序号" align="center" fixed :min-width="25" width="65"></el-table-column>
                <el-table-column prop="zname" label="客房名称" fixed align="center" width="150"></el-table-column>
                <el-table-column prop="nname" label="农家乐名称" align="center" width="150"></el-table-column>
                <el-table-column prop="naddress" label="地址" align="center" width="150"></el-table-column>
                <el-table-column prop="nphone" label="咨询电话" align="center" width="150"></el-table-column>
                <el-table-column prop="ztype" label="客房类型" align="center" width="150"></el-table-column>
                <el-table-column prop="zprice" label="客房价格" align="center" width="150"></el-table-column>
                <el-table-column prop="dbooktime" :formatter="formatDateTime" label="下单时间" align="center"
                    width="150"></el-table-column>
                <el-table-column prop="djoin" :formatter="formatDateTime" label="入住时间" align="center"
                    width="150"></el-table-column>
                <el-table-column prop="dleave" :formatter="formatDateTime" label="退房时间" align="center"
                    width="150"></el-table-column>
                <el-table-column prop="createdname" label="用户" align="center" width="150"></el-table-column>
                <el-table-column prop="uphone" label="用户手机号" align="center" width="150"></el-table-column>
                <el-table-column prop="dstate" label="订单状态" align="center"></el-table-column>
                <el-table-column label="操作" width="180px" align="center" fixed="right">
                    <template slot-scope="scope">
                        <!-- 详情 -->
                        <el-tooltip effect="dark" content="详情" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-document" size="mini"
                                @click="showDialog(scope.row.did)"></el-button>
                        </el-tooltip>

                        <!-- 评分留言 -->
                        <el-tooltip effect="dark" content="评分留言" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-chat-dot-square" size="mini"
                                :disabled="scope.row.dstate === '未预定' || scope.row.dstate === '已预订'"
                                @click="showDialog2(scope.row.did)"></el-button>
                        </el-tooltip>

                        <!-- 订单是否完成 -->
                        <el-tooltip effect="dark" content="订单是否完成" placement="top" :enterable="false">
                            <el-button type="success" icon="el-icon-check" size="mini"
                            :disabled="scope.row.dstate === '已完成' "
                                @click="showDialog3({ did: scope.row.did, zid: scope.row.zid })"></el-button>
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
                        <p><img :src="`http://localhost:3000${item.zpic}`" /></p>
                        <p>客房设施：{{ item.zfacility }}</p>
                        <p>客房价格：{{ item.zprice }}</p>
                        <p>地址：{{ item.naddress }}</p>
                        <p>下单时间：{{ formattedTime(item.dbooktime) }}</p>
                        <p>入住时间：{{ formattedTime(item.djoin) }}</p>
                        <p>退房时间：{{ formattedTime(item.dleave) }}</p>
                        <p>订单状态：{{ item.dstate }}</p>
                        <p>留言状态：{{ item.messagestate }}</p>
                    </div>
                </div>
            </el-dialog>

            <!-- 评分留言 -->
            <el-dialog title="评分留言" :visible.sync="dialogVisible2" width="50%" :before-close="handleClose">
                <div class="data-container">
                    <el-form :model="form" :rules="formRules" ref="FormRef" label-width="120px">
                        <el-form-item label="美食评分" prop="foodgrade">
                            <el-rate v-model="form.foodgrade" show-score></el-rate>
                        </el-form-item>
                        <el-form-item label="客房评分" prop="roomgrade">
                            <el-rate v-model="form.roomgrade" show-score></el-rate>
                        </el-form-item>

                        <el-form-item label="留言内容" prop="message">
                            <el-input type="textarea" v-model="form.message" :rows="6"></el-input>
                        </el-form-item>
                        <el-button type="primary" @click="addMessage('FormRef')">确认</el-button>
                    </el-form>

                    <!-- </el-form> -->
                </div>
            </el-dialog>

        </el-card>
    </div>
</template>

<script>
import dayjs from "dayjs";
export default {
    created() {
        this.getList();
        var uname = localStorage.getItem("uname");
        console.log(uname);
        var user = JSON.parse(JSON.stringify(uname));
        this.form.user = user;
    
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
            sels: [],
            form: {
                did: '',
                user: '',
                message: '',
                messagetime: '',
                foodgrade: 0,
                roomgrade: 0,
            },
            dialogVisible: false,
            dialogVisible2: false,

            formRules: {
                foodgrade: [{ required: true, message: '请留下你的评分', trigger: 'change' }],
                roomgrade: [{ required: true, message: '请留下你的评分', trigger: 'change' }],
                message: [
                    { required: true, message: "请留下你的评论", trigger: "blur" },
                    {
                        min: 1,
                        max: 200,
                        message: '留言内容在200字内',
                        trigger: 'blur',
                    },],
            },
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
        async getList() {
            const params = {
                keyword1: this.keyword1,
                keyword2: this.keyword2,
                keyword3: this.keyword3,
                offset: (this.currentPage - 1) * this.pageSize,
                limit: this.pageSize,
            };
            // console.log(params);
            const { data: res } = await this.$http.get('/order', { params })
            this.list = res.rows
            this.total = res.count;

            console.log(this.list);
        },
        //根据id显示客房信息的对话框
        async showDialog(id) {
            this.dialogVisible = true;
            const { data: res } = await this.$http.post(`/order/user/${id}`)
            console.log(res);
            if (res.meta.status !== 200) {
                return this.$message.error('数据获取失败！')
            }
            this.listform = res.data
        },

        //评分留言
        showDialog2(id) {
            console.log(id);
            this.form.did = id;
            var now = dayjs().format('YYYY-MM-DD HH:mm:ss');;
            this.form.messagetime = now;
            this.dialogVisible2 = true;
            // console.log(this.form);

        },
        //判断订单是否完成
        async showDialog3(params) {
            const confirmResult = await this.$confirm(
                '确认订单是否完成?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).catch((err) => err)
            if (confirmResult !== 'confirm') {
                return this.$message.info('取消订单完成')
            }

            // 发送请求到后台API
            const { data: res } = await this.$http.post(`/order/edit`, params)
            console.log(res);
            if (res.status !== 200) {
                return this.$message.error('订单完成失败')
            }
            this.$message.success('订单已完成')
            this.getList()
        },

        //添加留言信息
        addMessage(FormRef) {
            console.log('validating form');
            this.$refs.FormRef.validate(async valid => {
                console.log(valid);
                if (!valid) return;
                const { data: res } = await this.$http.post('/message/add', this.form);
                console.log(res);
                if (res.status !== 200) {
                    return this.$message.error('留言失败！')
                }
                this.dialogVisible2 = false
                return this.$message.success('留言成功！')
            })
            this.form = {}
        },
        //选择的值
        selschange(rows) {
            this.sels = rows.map(row => row.did);
        },
        async handleDelete() {
            const confirmResult = await this.$confirm(
                '此操作将永久删除选择的订单信息, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).catch((err) => err)
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除')
            }
            const ids = this.sels;
            // 发送请求到后台API
            const { data: res } = await this.$http.post(`/order/delete`, { ids })
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

.el-rate {
    margin-bottom: 20px;
    font-size: 32px;
}

.el-rate__text {
    font-size: 18px;
}

.data-container {
    img {
        height: 200px;
        width: 200px;
    }
}</style>
<template>
    <div>
        <!-- 面包屑导航栏 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商家查询</el-breadcrumb-item>
            <el-breadcrumb-item>客房</el-breadcrumb-item>
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
                    <el-button type="primary" @click="getList" icon="el-icon-search">查询</el-button>
                </el-col>
            </el-row>

            <!-- 显示数据 -->
            <el-table :data="list" border style="width: 100%">
                <el-table-column type="index" label="序号" align="center" :min-width="25"></el-table-column>
                <el-table-column prop="zname" label="客房名称" align="center"></el-table-column>
                <el-table-column prop="ztype" label="客房类型" align="center"></el-table-column>
                <el-table-column prop="zpic" label="客房图片" width="150" align="center">
                    <template slot-scope="scope">
                        <el-image style="width: 100px; height: 100px" :src="`http://localhost:3000${scope.row.zpic}`"
                            fit="cover"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="zfacility" label="客房设施" align="center"></el-table-column>
                <el-table-column prop="zprice" label="客房价格" align="center"></el-table-column>
                <el-table-column label="预定状态" align="center">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.zstate" active-color="#13ce66" inactive-color="#ff4949"
                            :active-value="1" :inactive-value="0" disabled>
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="nname" label="农家乐名称" align="center"></el-table-column>
                <el-table-column prop="ntype" label="类别" align="center"></el-table-column>
                <el-table-column prop="naddress" label="地址" align="center"></el-table-column>
                <el-table-column prop="nphone" label="咨询电话" align="center"></el-table-column>
                <el-table-column label="操作" width="150px" align="center">
                    <template slot-scope="scope">
                        <!-- 详情 -->
                        <el-tooltip effect="dark" content="详情" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-document" size="mini"
                                @click="showDialog(scope.row.zid)"></el-button>
                        </el-tooltip>

                        <!-- 预定 -->
                        <el-tooltip effect="dark" content="客房预定" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-s-claim" size="mini" :disabled="!scope.row.zstate"
                                @click="showDialog2(scope.row.zid)"></el-button>
                        </el-tooltip>

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
                    <p>客房名称：{{ item.zname }}</p>
                    <p>客房类型：{{ item.ztype }}</p>
                    <p>客房图片：</p>
                    <p><img :src="`http://localhost:3000${item.zpic}`" /></p>
                    <p>客房设施：{{ item.zfacility }}</p>
                    <p>客房价格：{{ item.zprice }}</p>
                    <p>客房状态：{{ zstateText }}</p>
                    <p>农家乐类型：{{ item.ntype }}</p>
                    <p>地址：{{ item.naddress }}</p>
                    <p>咨询电话：{{ item.nphone }}</p>
                </div>
            </div>
        </el-dialog>

        <!-- 预定客房 -->
        <el-dialog title="预定信息" :visible.sync="dialogVisible2" width="50%" :before-close="handleClose">
            <div class="data-container">
                <el-form :model="form" :rules="formRules" ref="FormRef" label-width="90px">
                    <el-form-item label="农家乐名称" prop="nname">
                        <el-input v-model="form.nname" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="房间名称" prop="zname">
                        <el-input v-model="form.zname" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="房间类型" prop="ztype">
                        <el-input v-model="form.ztype" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="房间设施" prop="zfacility">
                        <el-input v-model="form.zfacility" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="客房价格" prop="zprice">
                        <el-input v-model="form.zprice" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="入住时间" prop="djoin">
                        <el-date-picker v-model="form.djoin" type="datetime" placeholder="选择日期时间"
                            :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="退房时间" prop="dleave">
                        <el-date-picker v-model="form.dleave" type="datetime" placeholder="选择日期时间"
                            :picker-options="pickerOptions2">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item style="text-align: right;">
                        <el-button type="primary" @click="Cancel">取消</el-button>
                        <el-button type="primary" @click="addform('FormRef')">确认</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import dayjs from 'dayjs';
export default {
    created() {
        this.getList();
    },
    data() {
        return {
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            pickerOptions2: {
                disabledDate: (time) => {
                    if (this.form.djoin) {
                        return time.getTime() < new Date(this.form.djoin).getTime();
                    }
                }
            },
            currentPage: 1,
            pageSize: 10,
            total: 0,
            keyword1: '',
            keyword2: '',
            keyword3: '',
            list: [],
            listform: [],
            form: {
                nname: '',
                zname: '',
                ztype: '',
                zfacility: '',
                zprice: '',
                zid: '',
                djoin: '',
                dleave: '',
                dstate: '',
                messagestate: '',
            },
            dialogVisible: false,
            dialogVisible2: false,
            //规则验证
            formRules: {
                djoin: [
                    { required: true, message: '请选择入住时间', trigger: 'blur' },
                    { validator: this.validateDate, trigger: 'change' }
                ],
                dleave: [
                    { required: true, message: '请选择退房时间', trigger: 'blur' },
                    { validator: this.validateCheckOutDate, trigger: 'change' }
                ],
            }
        }
    },
    computed: {
        //计算客房预定状态
        zstateText() {
            if (this.listform[0].zstate === 0) {
                return "不可预定";
            } else if (this.listform[0].zstate === 1) {
                return "可预定";
            }
        }
    },
    methods: {

        async getList() {
            const params = {
                keyword1: this.keyword1,
                keyword2: this.keyword2,
                keyword3: this.keyword3,
                offset: (this.currentPage - 1) * this.pageSize,
                limit: this.pageSize,
            };
            // console.log(params);
            const { data: res } = await this.$http.get('/room', { params })
            this.list = res.rows
            this.total = res.count;
            console.log(res);

        },
        //根据id显示客房信息的对话框
        async showDialog(id) {
            this.dialogVisible = true;
            const { data: res } = await this.$http.post(`/room/user/${id}`)
            // console.log(res);
            if (res.meta.status !== 200) {
                return this.$message.error('数据获取失败！')
            }
            this.listform = res.data
            // console.log(this.listform);
        },
        //预定信息
        async showDialog2(id) {
            this.dialogVisible2 = true;
            const { data: res } = await this.$http.post(`/room/user/${id}`)
            // console.log(res);
            if (res.meta.status !== 200) {
                return this.$message.error('数据获取失败！')
            }
            this.form = res.data[0]
            // console.log(this.form.zid);
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
        Cancel() {
            this.dialogVisible2 = false;
        },

        //日期验证规则
        validateDate(rule, value, callback) {
            if (value && value.getTime() <= Date.now()) {
                callback(new Error('日期必须在今天之后'));
            } else {
                callback();
            }
        },
        //日期验证规则
        validateCheckOutDate(rule, value, callback) {
            if (value && this.form.checkInDate && value.getTime() <= this.form.checkInDate.getTime()) {
                callback(new Error('退房时间必须在入住时间之后'));
            } else {
                callback();
            }
        },
        //预定客房
        addform(FormRef) {
            //获取当前的用户名
            var uname = localStorage.getItem("uname");
            var user = JSON.parse(JSON.stringify(uname));

            const djoin = dayjs(this.form.djoin).format('YYYY-MM-DD HH:mm:ss');
            const dleave = dayjs(this.form.dleave).format('YYYY-MM-DD HH:mm:ss');
            const zid = this.form.zid;
            const dstate = '已预订';
            const createdname = user;

            let test = { djoin, dleave, zid, dstate, createdname };

            this.$refs.FormRef.validate(async valid => {
                if (!valid) return;
                const { data: res } = await this.$http.post('order/add', test)
                console.log(res);
                if (res.status !== 200) {
                    return this.$message.error('预定错误！');
                }
                this.dialogVisible2 = false
                this.getList();
                return this.$message.success('预定成功！')
            })
        }
    },

}
</script>

<style lang="less" scoped>
.data-container {
    img {
        height: 200px;
        width: 200px;
    }
}</style>
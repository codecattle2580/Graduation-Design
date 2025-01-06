<template>
    <div>
        <!-- 面包屑导航栏 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户信息</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 查询 -->
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="9">
                    <el-input placeholder="请输需要查询用户名称" v-model="keyword" clearable @clear="getList">
                        <el-button slot="append" icon="el-icon-search" @click="getList">
                        </el-button>
                    </el-input>
                </el-col>
               
            </el-row>
            <el-row :gutter="20">
                <el-col :span="2.5">
                    <el-button type="danger" @click="handleDelete" :disabled="sels.length === 0" icon="el-icon-remove">批量删除</el-button>
                </el-col>
                <el-col :span="3">
                    <el-button type="primary" @click="showDialog2" icon="el-icon-circle-plus" >用户</el-button>
                </el-col>
            </el-row>

            <el-table :data="list" @selection-change="selschange" border style="width: 100%;">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column type="index" label="序号" align="center" :min-width="25"></el-table-column>
                <el-table-column prop="uusername" label="用户名" align="center"></el-table-column>
                <el-table-column prop="uemail" label="邮箱" align="center"></el-table-column>
                <el-table-column prop="uphone" label="手机号" align="center"></el-table-column>

                <el-table-column prop="state" label="角色" align="center">
                    <template slot-scope="scope">
                        <el-tag type="danger" effect="dark" :key="scope.row.state"
                            v-if="scope.row.state === '0'">管理员</el-tag>
                        <el-tag type="" effect="dark" :key="scope.row.state" v-if="scope.row.state === '1'">用户</el-tag>
                        <el-tag type="success" effect="dark" :key="scope.row.state"
                            v-if="scope.row.state === '2'">商家</el-tag>

                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150px" align="center">
                    <template slot-scope="scope">
                        <!-- 修改 -->
                        <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-edit" size="mini"
                                @click="showDialog3(scope.row.uid)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                :page-sizes="[1, 2, 5, 10]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>

            <!-- 添加用户信息 -->
            <el-dialog title="添加用户信息" :visible.sync="dialogVisible2" width="50%" :before-close="handleClose">
                <div class="data-container">
                    <el-form :model="form" :rules="formRules" ref="FormRef" label-width="100px">
                        <el-form-item label="用户名" prop="uusername">
                            <el-input v-model="form.uusername"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="upassword">
                            <el-input v-model="form.upassword"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="uemail">
                            <el-input v-model="form.uemail"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号" prop="uphone">
                            <el-input v-model="form.uphone"></el-input>
                        </el-form-item>
                        <el-form-item label="角色" prop="state">
                            <el-select v-model="form.state" placeholder="请选择角色">
                                <el-option v-for="item in options" :key="item.state" :label="item.label"
                                    :value="item.state">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item style="text-align: right;">
                            <el-button type="primary" @click="Cancel">取消</el-button>
                            <el-button type="primary" @click="addform('FormRef')">确认</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-dialog>


            <!--修改用户信息 -->
            <el-dialog title="修改用户信息" :visible.sync="dialogVisible3" width="50%" :before-close="handleClose">
                <div class="data-container">
                    <el-form :model="editForm" :rules="formRules" ref="editFormRef" label-width="100px">
                        <el-form-item label="用户名" prop="uusername">
                            <el-input v-model="editForm.uusername"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="upassword">
                            <el-input v-model="editForm.upassword"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="uemail">
                            <el-input v-model="editForm.uemail"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号" prop="uphone">
                            <el-input v-model="editForm.uphone"></el-input>
                        </el-form-item>
                        <el-form-item label="角色" prop="state">
                            <el-select v-model="editForm.state" placeholder="请选择角色">
                                <el-option v-for="item in options" :key="item.state" :label="item.label"
                                    :value="item.state">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item style="text-align: right;">
                            <el-button type="primary" @click="Cancel">取消</el-button>
                            <el-button type="primary" @click="EditForm()">确认</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
export default {
    created() {
        this.getList();
        var user = JSON.parse(localStorage.getItem("uid"));
        this.form.user = user

    },
    data() {
        // 验证邮箱的规则
        var checkEmail = (rule, value, callback) => {
            //验证邮箱的正则表达式
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9-])+(\.[a-zA-Z0-9_-])+/

            if (regEmail.test(value)) {
                return callback()
            }
            callback(new Error('请输入合法的邮箱'))
        }
        //验证手机号的规则
        var checkMobile = (rule, value, callback) => {
            //验证手机号的正则表达式
            const regMobile =
                /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if (regMobile.test(value)) {
                return callback()
            }
            callback(new Error('请输入合法的手机号'))
        }
        return {
            currentPage: 1,
            pageSize: 10,
            total: 0,
            keyword: '',
            list: [],
            listform: [],
            sels: [],//需要删除的id
            form: {
                uusername: '',
                upassword: '',
                uemail: '',
                uphone: '',
                state: '',
            },
            editForm: {},//修改值
            dialogVisible: false,
            dialogVisible2: false,
            dialogVisible3: false,
            options: [
                { state: '0', label: '管理员' },
                { state: '1', label: '用户' },
                { state: '2', label: '商家' }
            ],
            formRules: {
                uusername: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    {
                        min: 3,
                        max: 10,
                        message: '用户名的长度在3~10之间',
                        trigger: 'blur',
                    },
                ],
                upassword: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    {
                        min: 6,
                        max: 15,
                        message: '密码的长度在6~15之间',
                        trigger: 'blur',
                    },
                ],
                uemail: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' },
                ],
                uphone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' },
                ],
                state: [
                    { required: true, message: '请选择角色', trigger: 'blur' }
                ]
            }
        }
    },

    //计算
    computed: {


    },
    methods: {
        // 获取所有的信息
        async getList() {
            const params = {
                keyword: this.keyword,
                offset: (this.currentPage - 1) * this.pageSize,
                limit: this.pageSize,
            };
            const { data: res } = await this.$http.get('/', { params })
            this.list = res.rows

            this.total = res.count;
            // console.log(this.list);
            // console.log(res);
        },

        //弹出添加用户框
        showDialog2() {
            this.dialogVisible2 = true;
        },
        // 获取修改值
        async showDialog3(id) {
            this.dialogVisible3 = true;
            const { data: res } = await this.$http.post(`/users/${id}`)
            // console.log(res);
            if (res.status !== 200) {
                return this.$message.error('数据获取失败！')
            }
            this.editForm = res.data[0]
        },
        //添加用户
        addform(FormRef) {
            this.$refs.FormRef.validate(async valid => {
                console.log(valid);
                if (!valid) return;
                console.log(this.form);
                const { data: res } = await this.$http.post('/add', this.form);
                if (res.meta.status !== 200) {
                    this.$message.error('添加失败！');
                }
                this.$message.success('添加成功！');
                this.dialogVisible2 = false;

            })
            this.form = {}
            this.getList();
        },

        //修改值
        EditForm() {
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return;
                const data = {
                    uid: this.editForm.uid,
                    uusername: this.editForm.uusername,
                    upassword: this.editForm.upassword,
                    uemail: this.editForm.uemail,
                    uphone: this.editForm.uphone,
                    state: this.editForm.state,
                }
                const { data: res } = await this.$http.put(`/edit`, data)
                console.log(res);
                if (res.meta.status !== 200) {
                    return this.$message.error('修改失败')
                }
                this.$message.success('修改成功')
                this.dialogVisible3 = false
                this.getList()

            })
        },
        //选择的值
        selschange(rows) {
            this.sels = rows.map(row => row.uid);;
            // console.log("选择了：" + this.sels);
        },
        //删除信息
        async handleDelete() {
            const confirmResult = await this.$confirm(
                '此操作将永久删除选择的用户信息, 是否继续?',
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
            const { data: res } = await this.$http.post(`/delete`, { ids })
            console.log(res);
            if (res.meta.status !== 200) {
                return this.$message.error('删除失败！')
            }
            this.$message.success('删除成功！')
            this.getList()
        },
        //取消
        Cancel() {
            this.dialogVisible2 = false;
        },
        //修改框取消
        editCancel() {
            this.dialogVisible3 = false
            this.fileList2.splice(0, this.fileList2.length);
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
</style>
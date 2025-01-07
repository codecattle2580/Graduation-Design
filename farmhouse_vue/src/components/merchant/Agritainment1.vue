<template>
    <div>
        <!-- 面包屑导航栏 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商家查询</el-breadcrumb-item>
            <el-breadcrumb-item>农家乐</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 查询 -->
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="9">
                    <el-input placeholder="请输入农家乐名称" v-model="keyword" clearable @clear="getList">
                        <el-button slot="append" icon="el-icon-search" @click="getList">
                        </el-button>
                    </el-input>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="3">
                    <el-button type="danger" @click="handleDelete" :disabled="sels.length === 0"
                        icon="el-icon-remove">批量删除</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" @click="showDialog2" icon="el-icon-circle-plus">农家乐</el-button>
                </el-col>
            </el-row>
            <!-- 农家乐列表 -->
            <el-table :data="list" border style="width: 100%" @selection-change="selschange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column type="index" label="序号" align="center" :min-width="25"></el-table-column>
                <el-table-column prop="nname" label="农家乐名称" align="center"></el-table-column>
                <el-table-column prop="ntype" label="类型" align="center"></el-table-column>
                <el-table-column label="图片" align="center">
                    <template slot-scope="scope">
                        <el-image style="width: 100px; height: 100px" :src="`http://localhost:3000${scope.row.npic}`"
                            fit="cover"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="naddress" label="地址" align="center"></el-table-column>
                <el-table-column prop="nphone" label="咨询电话" align="center"></el-table-column>
                <el-table-column label="操作" width="180px" align="center">
                    <template slot-scope="scope">

                        <!-- 详情 -->
                        <el-tooltip effect="dark" content="详情" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-document" size="mini"
                                @click="showDialog(scope.row.nid)"></el-button>
                        </el-tooltip>

                        <!-- 修改 -->
                        <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-edit" size="mini"
                                @click="showDialog3(scope.row.nid)"></el-button>
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
        <el-dialog title="详情介绍" :visible.sync="dialogVisible" width="40%" :before-close="handleClose1">
            <div class="data-container">
                <div v-for="(item, index) in listform" :key="index">
                    <p>农家乐名称：{{ item.nname }}</p>
                    <p>类型：{{ item.ntype }}</p>
                    <p>图片：</p>
                    <p><img :src="`http://localhost:3000${item.npic}`" /></p>
                    <p>地址：{{ item.naddress }}</p>
                    <p>咨询电话：{{ item.nphone }}</p>
                    <p>介绍：{{ item.nintroduce }}</p>
                </div>
            </div>
        </el-dialog>

        <!-- 添加农家乐 -->
        <el-dialog title="添加农家乐信息" :visible.sync="dialogVisible2" width="50%" :before-close="handleClose">
            <div class="data-container">
                <el-form :model="form" :rules="formRules" ref="FormRef" label-width="100px">
                    <el-form-item label="农家乐名称" prop="nname">
                        <el-input v-model="form.nname"></el-input>
                    </el-form-item>
                    <el-form-item label="类型" prop="ntype">
                        <el-input v-model="form.ntype"></el-input>
                    </el-form-item>
                    <el-form-item label="图片" prop="npic">
                        <el-upload ref="uploadRef" action="http" :http-request="handledUpload" list-type="picture-card"
                            :show-file-list="true" name="img" :headers="headers" :before-upload="beforeUpload"
                            :on-exceed="handleExceed" :on-preview="handlePictureCardPreview" url-list="imgPreviewList"
                            :limit="1">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisibleImg" append-to-body>
                            <img width="100%" :src="this.form.npic" alt="预览">
                        </el-dialog>
                    </el-form-item>
                    <el-form-item label="地址" prop="naddress">
                        <el-input v-model="form.naddress"></el-input>
                    </el-form-item>
                    <el-form-item label="咨询电话" prop="nphone">
                        <el-input v-model="form.nphone"></el-input>
                    </el-form-item>
                    <el-form-item label="特色介绍" prop="nintroduce">
                        <el-input v-model="form.nintroduce" type="textarea" :rows="6"></el-input>
                    </el-form-item>

                    <el-form-item style="text-align: right;">
                        <el-button type="primary" @click="Cancel">取消</el-button>
                        <el-button type="primary" @click="addform('FormRef')">确认</el-button>
                    </el-form-item>

                </el-form>
            </div>
        </el-dialog>

        <!--修改客房 -->
        <el-dialog title="修改农家乐信息" :visible.sync="dialogVisible3" width="50%" :before-close="handleClose2">
            <div class="data-container">
                <el-form :model="editForm" :rules="formRules" ref="FormRef" label-width="100px">
                    <el-form-item label="农家乐名称" prop="nname">
                        <el-input v-model="editForm.nname"></el-input>
                    </el-form-item>
                    <el-form-item label="类型" prop="ntype">
                        <el-input v-model="editForm.ntype"></el-input>
                    </el-form-item>
                    <el-form-item label="图片" prop="npic">
                        <el-upload action="http" list-type="picture-card" :http-request="handledUpload"
                            :show-file-list="true" :before-upload="beforeUpload" :on-preview="handlePictureCardPreview2"
                            :file-list="fileList2" :on-remove="handleRemove2">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisibleImg" append-to-body>
                            <img width="100%" :src="this.editForm.npic" alt="预览">
                        </el-dialog>
                    </el-form-item>
                    <el-form-item label="地址" prop="naddress">
                        <el-input v-model="editForm.naddress"></el-input>
                    </el-form-item>
                    <el-form-item label="咨询电话" prop="nphone">
                        <el-input v-model="editForm.nphone"></el-input>
                    </el-form-item>
                    <el-form-item label="特色介绍" prop="nintroduce">
                        <el-input v-model="editForm.nintroduce" type="textarea" :rows="6"></el-input>
                    </el-form-item>

                    <el-form-item style="text-align: right;">
                        <el-button type="primary" @click="editCancel">取消</el-button>
                        <el-button type="primary" @click="EditForm('FormRef')">确认</el-button>
                    </el-form-item>

                </el-form>
            </div>
        </el-dialog>

    </div>
</template>

<script>

export default {
    created() {
        this.getList();
        var user = JSON.parse(localStorage.getItem("uid"));
        this.form.uid = user
        console.log(this.form.uid);
        // console.log(this.list);
    },

    data() {
        return {
            currentPage: 1,
            pageSize: 10,
            total: 0,
            keyword: '',
            list: [],
            headers: { enctype: "multipart/form-data", Authorization: window.sessionStorage.getItem('token') },
            listform: [],
            fileList: [],
            fileList2: [],//图片数组
            editForm: {},//修改数据
            imgPreviewList: '',//缩略图列表
            dialogVisible: false,
            dialogVisible2: false,
            dialogVisible3: false,
            dialogVisibleImg: false,
            sels: [],
            form: {
                uid: '',
                nname: '',
                ntype: '',
                npic: '',
                naddress: '',
                nphone: '',
                nintroduce: ''
            },
            formRules: {
                nname: [
                    { required: true, message: '请输入农家乐名称', trigger: 'blur' }
                ],
                ntype: [
                    { required: true, message: '请输入类型', trigger: 'blur' }
                ],
                naddress: [
                    { required: true, message: '请输入地址', trigger: 'blur' }
                ],
                nphone: [
                    { required: true, message: '请输入咨询电话', trigger: 'blur' },
                    { pattern: /^1[3-9]\d{9}$/, message: '电话号码格式不正确', trigger: 'blur' }
                ],
                npic: [
                    { required: true, message: '请选择图片', trigger: 'change' },
                ],
                nintroduce: [
                    { required: true, message: '请输入特色介绍', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        //获取所有农家乐数据
        async getList() {
            var id = JSON.parse(localStorage.getItem("uid"));
            const params = {
                keyword: this.keyword,
                offset: (this.currentPage - 1) * this.pageSize,
                limit: this.pageSize,
                uid: id
            };
            const { data: res } = await this.$http.get('/agritourism/merchant', { params })
            this.list = res.rows

            this.total = res.count;
            // console.log(this.list);
            // console.log(res);
        },
        //上传处理图片
        handledUpload(data) {
            // console.log(data);
            //form 
            const file = data.file;
            const form = new FormData();
            form.append("file", file);
            //调用接口
            const req_data = {
                url: '/upload',
                method: 'post',
                headers: {
                    'Content-Type': "multipart/form-data"
                },
                data: form
            }
            this.$http(req_data).then(res => {
                // 调用接口，上传图片
                let urlArray = res.data.meta.url;
                let urlString = urlArray.join(',');//把数组修改为字符串类型

                this.form.npic = urlString;
                this.editForm.npic = urlString;
                this.fileList2 = [urlString]
                console.log(urlString);
            }).catch(err => {
                console.log(err);
            })
        },
        // 图片上传前验证函数
        beforeUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG && !isPNG) {
                this.$message.error('上传图片只能是 JPG/PNG 格式');
                return false;
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB');
                return false;
            }
            return true;
        },
        //图片限制
        handleExceed(file, fileList) {
            this.$message('暂时只能上传一张图')
        },
        //移除图片
        handleRemove(file, fileList) {
            this.fileList = fileList
            console.log(file, fileList)
        },
        //修改图片
        handleRemove2(file, fileList) {
            console.log(typeof(fileList));
            console.log(fileList);
            this.fileList2 = fileList
            const id = this.editForm.nid;
            const { data: res } = this.$http.post('/agritourism/deleteimg', id)
            console.log(res);
        },
        //图片上传时预览
        handlePictureCardPreview(file) {
            console.log(file);
            this.form.npic = file.url;
            this.dialogVisibleImg = true;
        },
        handlePictureCardPreview2(file) {
            console.log(file);
            this.editForm.npic = file.url;
            this.dialogVisibleImg = true;
        },
        showDialog2() {
            this.dialogVisible2 = true;
        },
        //添加农家乐
        addform(FormRef) {
            this.$refs.FormRef.validate(async valid => {
                console.log(valid);
                if (!valid) return;
                console.log(this.form);
                const { data: res } = await this.$http.post('/agritourism/add', this.form);
                if (res.meta.status !== 200) {
                    this.$message.error('添加失败！');
                }
                this.$message.success('添加成功！');
                this.f
                this.dialogVisible2 = false;

            })
            // 重置表单数据
            this.$refs.FormRef.resetFields();
            this.$refs.uploadRef.clearFiles();
            this.getList();
        },
        //实现修改
        EditForm() {
            this.$refs.FormRef.validate(async valid => {
                if (!valid) return;
                const data = {
                    nid: this.editForm.nid,
                    nname: this.editForm.nname,
                    ntype: this.editForm.ntype,
                    npic: this.editForm.npic,
                    naddress: this.editForm.naddress,
                    nphone: this.editForm.nphone,
                    nintroduce: this.editForm.nintroduce
                }
                if (this.fileList2.length === 0) {
                    console.log(this.fileList2.length);
                    this.$message('请上传图片')
                } else {
                    const { data: res } = await this.$http.put(`agritourism/edit`, data)
                    console.log(res);
                    if (res.meta.status !== 200) {
                        return this.$message.error('修改失败')
                    }
                    this.$message.success('修改成功')
                    this.dialogVisible3 = false
                    this.getList()
                }

            })
        },
        //取消
        Cancel() {
            this.dialogVisible2 = false;
        },
        // 修改取消按钮
        editCancel() {
            this.dialogVisible3 = false
            this.fileList2.splice(0, this.fileList2.length);
        },
        //显示详情对话框
        async showDialog(id) {
            // console.log('详情：' + id);
            this.dialogVisible = true;
            const { data: res } = await this.$http.post(`/agritourism/user/${id}`)
            if (res.status !== 200) {
                return this.$message.error('数据获取失败！')
            }
            this.listform = res.data
        },

        //获取修改信息
        async showDialog3(id) {
            // console.log('修改' + id);
            this.dialogVisible3 = true;
            const { data: res } = await this.$http.post(`/agritourism/user/${id}`)
            if (res.status !== 200) {
                return this.$message.error('数据获取失败！')
            }
            this.editForm = res.data[0]
            if (this.editForm.npic) {
                let arr = this.editForm.npic.split(",");
                let obj = { url: `http://localhost:3000` + arr }
                this.fileList2.push(obj);
            } else {
                // 处理 this.editForm.zpic 为 null 的情况
                console.log('没有找到图片');
            }
            console.log(this.editForm);
        },
        //删除农家乐
        async handleDelete() {
            const confirmResult = await this.$confirm(
                '此操作将永久删除选择的信息, 是否继续?',
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
            const { data: res } = await this.$http.post(`/agritourism/delete`, { ids })
            console.log(res);
            if (res.meta.status !== 200) {
                return this.$message.error('删除失败！')
            }
            this.$message.success('删除成功！')
            this.getList()
        },

        //选择的值
        selschange(rows) {
            this.sels = rows.map(row => row.nid);;
            console.log("选择了：" + this.sels);
        },
        // 关闭搜索框
        handleClose(done) {
            // 在对话框关闭前的处理，如果传入了done函数则需要手动调用done()来关闭对话框
            done();
        },
        handleClose1(done) {
            // 在对话框关闭前的处理，如果传入了done函数则需要手动调用done()来关闭对话框
            done();
        },
        handleClose2() {
            this.dialogVisible3 = false
            this.fileList2.splice(0, this.fileList2.length);
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
.box-card {
    margin-top: 20px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;

    .el-form-item {
        .el-input {
            width: 200px;
        }
    }
}

.el-table {
    font-size: 10px;
}

.el-row {
    margin-bottom: 10px;
}

.data-container {
    img {
        height: 200px;
        width: 200px;
    }
}
</style>
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
                    <el-input placeholder="请输入美食名称" v-model="keyword" clearable @clear="getList" >
                        <el-button slot="append" icon="el-icon-search" @click="getList">
                        </el-button>
                    </el-input>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="2.5">
                    <el-button type="danger" @click="handleDelete" :disabled="sels.length === 0" icon="el-icon-remove">批量删除</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" @click="showDialog2" icon="el-icon-circle-plus" >美食</el-button>
                </el-col>
            </el-row>
            <el-table :data="list" border  style="width: 100%; " @selection-change="selschange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column type="index" label="序号" align="center" :min-width="25" width="65"></el-table-column>
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

                        <!-- 详情 -->
                        <el-tooltip effect="dark" content="详情" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-document" size="mini"
                                @click="showDialog(scope.row.mid)"></el-button>
                        </el-tooltip>

                        <!-- 修改 -->
                        <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-edit" size="mini"
                                @click="showDialog3(scope.row.mid)"></el-button>
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
                    <p>美食名称：{{ item.mname }}</p>
                    <p>图片:</p>
                    <p><img :src="`http://localhost:3000${item.mpic}`"/></p>
                    <p>类型：{{ item.mtype }}</p>
                    <p>咨询电话：{{ item.nphone }}</p>
                    <p>地址：{{ item.naddress }}</p>
                    <p>介绍：{{ item.mflavour }}</p>
                </div>
            </div>
        </el-dialog>

        <!-- 添加美食 -->
        <el-dialog title="添加美食信息" :visible.sync="dialogVisible2" width="50%" :before-close="handleClose">
            <div class="data-container">
                <el-form :model="form" :rules="formRules" ref="FormRef" label-width="100px">
                    <el-form-item label="美食名称" prop="mname">
                        <el-input v-model="form.mname"></el-input>
                    </el-form-item>
                    <el-form-item label="类型" prop="mname">
                        <el-input v-model="form.mtype"></el-input>
                    </el-form-item>
                    <el-form-item label="图片" prop="mpic">
                        <el-upload ref="upload" action="http" :http-request="handledUpload" list-type="picture-card"
                            :show-file-list="true" name="img" :headers="headers" :before-upload="beforeUpload"
                            :on-exceed="handleExceed" :on-preview="handlePictureCardPreview" url-list="imgPreviewList"
                            :limit="1">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisibleImg" append-to-body>
                            <img width="100%" :src="this.form.mpic" alt="预览">
                        </el-dialog>
                    </el-form-item>
                    <el-form-item label="介绍" prop="mflavour">
                        <el-input v-model="form.mflavour" type="textarea" :rows="6"></el-input>
                    </el-form-item>
                    <el-form-item label="农家乐" prop="nid">
                        <el-select v-model="form.nid" placeholder="请选择">
                            <el-option v-for="item in options" :key="item.nid" :label="item.nname" :value="item.nid">
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

        <!-- 修改美食 -->
        <el-dialog title="修改美食信息" :visible.sync="dialogVisible3" width="50%" :before-close="handleClose2">
            <div class="data-container">
                <el-form :model="editForm" :rules="formRules" ref="editFormRef" label-width="100px">
                    <el-form-item label="美食名称" prop="mname">
                        <el-input v-model="editForm.mname"></el-input>
                    </el-form-item>
                    <el-form-item label="类型" prop="mname">
                        <el-input v-model="editForm.mtype"></el-input>
                    </el-form-item>
                    <el-form-item label="图片" prop="mpic">
                        <el-upload ref="upload" action="http" :http-request="handledUpload" list-type="picture-card"
                            :show-file-list="true" name="img" :headers="headers" :before-upload="beforeUpload"
                            :on-exceed="handleExceed" :on-preview="handlePictureCardPreview" :file-list="fileList2"
                            :on-remove="handleRemove2">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisibleImg" append-to-body>
                            <img width="100%" :src="this.editForm.mpic" alt="预览">
                        </el-dialog>
                    </el-form-item>

                    <el-form-item label="介绍" prop="mflavour">
                        <el-input v-model="editForm.mflavour" type="textarea" :rows="6"></el-input>
                    </el-form-item>

                    <el-form-item label="农家乐" prop="nid">
                        <el-select v-model="editForm.nid" placeholder="请选择">
                            <el-option v-for="item in options" :key="item.nid" :label="item.nname" :value="item.nid">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item style="text-align: right;">
                        <el-button type="primary" @click="editCancel">取消</el-button>
                        <el-button type="primary" @click="EditForm('editFormRef')">确认</el-button>
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
        this.getNname();
    },
    data() {
        return {
            currentPage: 1,
            pageSize: 10,
            total: 0,
            keyword: '',
            list: [],//表格数据
            listform: [],
            sels: [],
            options: [],//获取农家乐nid和名称
            editForm: {},
            fileList1: [],//存添加图
            fileList2: [],//存修改图
            headers: { enctype: "multipart/form-data", Authorization: window.sessionStorage.getItem('token') },
            dialogVisible: false,
            dialogVisible2: false,
            dialogVisible3: false,
            dialogVisibleImg: false,
            form: {
                mname: '',
                mtype: '',
                mpic: '',
                mflavour: '',
                nid: '',
            },
            formRules: {
                mname: [
                    { required: true, message: '请输入美食名称', trigger: 'blur' }
                ],
                mtype: [
                    { required: true, message: '请输入类型', trigger: 'blur' }
                ],
                mflavour: [
                    { required: true, message: '请输入美食介绍', trigger: 'blur' }
                ],
                nid: [{ required: true, message: '请选择农家乐', trigger: 'change' }]
            }
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

        },
        //根据id获取详细信息
        async showDialog(id) {
            console.log(id);
            this.dialogVisible = true;
            const { data: res } = await this.$http.post(`/food/user/${id}`)
            if (res.meta.status !== 200) {
                return this.$message.error('数据获取失败！')
            }
            this.listform = res.data
            // console.log(this.listform);
        },
        //添加美食
        addform(FormRef) {
            this.$refs.FormRef.validate(async valid => {
                console.log(valid);
                if (!valid) return;
                console.log(this.form);
                const { data: res } = await this.$http.post('/food/add', this.form);
                if (res.meta.status !== 200) {
                    this.$message.error('添加失败！');
                    console.log(res);
                } else {
                    console.log(res);
                    this.$message.success('添加成功！');
                    this.dialogVisible2 = false;
                }
                this.$refs.FormRef.resetFields()
                this.getList();

            })

        },
        //取消按钮
        Cancel() {
            this.$refs.upload.clearFiles()//清空图片数组
            this.dialogVisible2 = false;
        },
        editCancel() {
            this.dialogVisible3 = false;
            this.$refs.upload.clearFiles()
        },
        //批量删除操作
        async handleDelete() {
            const confirmResult = await this.$confirm(
                '此操作将永久删除选择的留美食信息, 是否继续?',
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
            const { data: res } = await this.$http.post(`/food/delete`, { ids })
            console.log(res);
            if (res.meta.status !== 200) {
                return this.$message.error('删除失败！')
            }
            this.$message.success('删除成功！')
            this.getList()
        },
        //实现修改
        EditForm() {
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return;
                const data = {
                    mid: this.editForm.mid,
                    nid: this.editForm.nid,
                    mname: this.editForm.mname,
                    mtype: this.editForm.mtype,
                    mpic: this.editForm.mpic,
                    mflavour: this.editForm.mflavour,
                }
                if (this.fileList2.length === 0) {
                    console.log(this.fileList2.length);
                    this.$message('请上传图片')
                } else {
                    const { data: res } = await this.$http.put(`food/edit`, data)
                    console.log(res);
                    if (res.status !== 200) {
                        return this.$message.error('修改失败')
                    }
                    this.$message.success('修改成功')
                    this.dialogVisible3 = false
                    this.getList()
                }
            })
        },
        //获取农家乐的nid和名称
        async getNname() {
            const { data: res } = await this.$http.post('agritourism/getNname')
            if (res.status !== 200) {
                // console.log('nid和农家乐名称获取失败');
            } else {
                // console.log('nid和农家乐名称获取成功');
                this.options = res.data
                // console.log(this.options);
            }
        },
        //选择的值
        selschange(rows) {
            this.sels = rows.map(row => row.mid);;
            // console.log("选择了：" + this.sels);
        },
        //显示添加美食
        showDialog2() {
            this.dialogVisible2 = true;
        },
        //获取修改的数据
        async showDialog3(id) {
            this.dialogVisible3 = true;
            const { data: res } = await this.$http.post(`/food/user/${id}`)
            // console.log(res);
            if (res.meta.status !== 200) {
                return this.$message.error('数据获取失败！')
            }
            this.editForm = res.data[0]
            if (this.editForm.mpic) {
                let arr = this.editForm.mpic.split(",");
                let obj = { url: `http://localhost:3000` + arr }
                this.fileList2.push(obj);
            } else {
                // 处理 this.editForm.zpic 为 null 的情况
                console.log('没有找到图片');
            }
            console.log(this.editForm);

        },
        //上传处理图片
        handledUpload(data) {
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

                console.log('1', typeof (urlArray));
                console.log('2', urlString);

                this.form.mpic = urlString;
                this.editForm.mpic = urlString;
                this.fileList2.push(urlArray);
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
            this.fileList1 = fileList
            this.fileList1.forEach((item, index) => {
                if (file.name == item.name) {
                    this.fileList1(index, 1)
                }
            })
            console.log(file, fileList)
        },
        //修改图片
        handleRemove2(file, fileList) {
            this.fileList2 = fileList.map(item => {
                return {
                    name: item,
                    url: item
                }
            })
            const id = this.editForm.mid;
            const { data: res } = this.$http.post('/agritourism/deleteimg', id)
            console.log(res);
        },
        //图片上传时预览
        handlePictureCardPreview(file) {
            this.form.mpic = file.url;
            this.dialogVisibleImg = true;
            console.log(file);
        },
        //修改图片上传预览
        handlePictureCardPreview2(file) {
            this.editForm.mpic = file.url;
            this.dialogVisibleImg = true;
            console.log(file);
        },
        // 关闭搜索框
        handleClose(done) {
            // 在对话框关闭前的处理，如果传入了done函数则需要手动调用done()来关闭对话框
            this.$refs.FormRef.resetFields()
            done();
        },
        // 修改关闭
        handleClose2() {
            this.fileList2.splice(0, this.fileList2.length);//清空图片数组
            this.dialogVisible3 = false;
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
.data-container{
    img{
        height: 200px;
        width: 200px;
    }
}
</style>>


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
            <el-row :gutter="10">
                <el-col :span="3">
                    <el-button type="danger" @click="handleDelete" :disabled="sels.length === 0" icon="el-icon-remove">批量删除</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" @click="showDialog3" icon="el-icon-circle-plus">客房</el-button>
                </el-col>
            </el-row>

            <el-table :data="list" border style="width: 100%" @selection-change="selschange">
                <el-table-column type="selection" width="45"></el-table-column>
                <el-table-column type="index" label="序号" align="center" width="45" fixed></el-table-column>
                <el-table-column prop="zname" label="客房名称" fixed width="150" align="center"></el-table-column>
                <el-table-column prop="ztype" label="客房类型" width="150" align="center"></el-table-column>
                <el-table-column prop="zpic" label="客房图片" width="150" align="center">
                    <template slot-scope="scope">
                        <el-image style="width: 100px; height: 100px" :src="`http://localhost:3000${scope.row.zpic}`"
                            fit="cover"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="zfacility" label="客房设施" width="150" align="center"></el-table-column>
                <el-table-column prop="zprice" label="客房价格" width="150" align="center"></el-table-column>
                <el-table-column label="预定状态" width="150" align="center">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.zstate" active-color="#13ce66" inactive-color="#ff4949"
                            :active-value="1" :inactive-value="0" disabled>
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="nname" label="农家乐名称" width="150" align="center"></el-table-column>
                <el-table-column prop="ntype" label="类别" width="150" align="center"></el-table-column>
                <el-table-column prop="naddress" label="地址" width="150" align="center"></el-table-column>
                <el-table-column prop="nphone" label="咨询电话" width="150" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center" fixed="right">
                    <template slot-scope="scope">
                        <!-- 详情 -->
                        <el-tooltip effect="dark" content="详情" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-document" size="mini"
                                @click="showDialog(scope.row.zid)"></el-button>
                        </el-tooltip>

                        <!-- 预定 -->
                        <el-tooltip effect="dark" content="客房预定" placement="top" :enterable="false">
                            <el-button type="success" icon="el-icon-s-claim" size="mini" :disabled="!scope.row.zstate"
                                @click="showDialog2(scope.row.zid)"></el-button>
                        </el-tooltip>

                        <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-edit" size="mini"
                                @click="showDialog4(scope.row.zid)"></el-button>
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
                    <p><img :src="`http://localhost:3000${item.zpic}`"/></p>
                    <p>客房设施：{{ item.zfacility }}</p>
                    <p>客房价格：{{ item.zprice }}</p>
                    <p>客房状态：{{ zstateText }}</p>
                    <p>农家乐类型：{{ item.ntype }}</p>
                    <p>地址：{{ item.naddress }}</p>
                    <p>咨询电话：{{ item.nphone }}</p>
                </div>
            </div>
        </el-dialog>

        <!-- 客房预定 -->
        <el-dialog title="预定信息" :visible.sync="dialogVisible2" width="50%" :before-close="Cancel">
            <div class="data-container">
                <el-form :model="form" :rules="bookformRules" ref="FormRef" label-width="90px">
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
                        <el-date-picker v-model="form.djoin" type="datetime" placeholder="选择日期时间" :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="退房时间" prop="dleave">
                        <el-date-picker v-model="form.dleave" type="datetime" placeholder="选择日期时间" :picker-options="pickerOptions2">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item style="text-align: right;">
                        <el-button type="primary" @click="Cancel">取消</el-button>
                        <el-button type="primary" @click="addform('FormRef')">确认</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>

        <!-- 添加客房 -->
        <el-dialog title="添加信息" :visible.sync="dialogVisible3" width="50%" :before-close="addCancel">
            <div class="data-container">
                <el-form :model="addformroom" :rules="formRules" ref="addFormRef" label-width="90px">
                    <el-form-item label="房间名称" prop="zname">
                        <el-input v-model="addformroom.zname"></el-input>
                    </el-form-item>
                    <el-form-item label="房间类型" prop="ztype">
                        <el-input v-model="addformroom.ztype"></el-input>
                    </el-form-item>
                    <el-form-item prop="zpic" label="客房图片">
                        <el-upload ref="upload" action="http" :http-request="handledUploadAdd" list-type="picture-card"
                            :show-file-list="true" name="img" :headers="headers" :before-upload="beforeUpload"
                            :on-exceed="handleExceed" :on-preview="handlePictureCardPreview" url-list="imgPreviewList"
                            :limit="1">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisibleImg" append-to-body>
                            <img width="100%" :src="this.addformroom.zpic" alt="预览">
                        </el-dialog>
                    </el-form-item>
                    <el-form-item label="房间设施" prop="zfacility">
                        <el-input v-model="addformroom.zfacility"></el-input>
                    </el-form-item>
                    <el-form-item label="客房价格" prop="zprice">
                        <el-input v-model="addformroom.zprice"></el-input>
                    </el-form-item>
                    <el-form-item label="农家乐" prop="nid">
                        <el-select v-model="addformroom.nid" placeholder="请选择">
                            <el-option v-for="item in options" :key="item.nid" :label="item.nname" :value="item.nid">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="text-align: right;">
                        <el-button type="primary" @click="addCancel">取消</el-button>
                        <el-button type="primary" @click="addFormroom('addFormRef')">确认</el-button>
                    </el-form-item>

                </el-form>
            </div>
        </el-dialog>

        <!--修改客房 -->
        <el-dialog title="修改客房信息" :visible.sync="dialogVisible4" width="50%" :before-close="editCancel">
            <div class="data-container">
                <el-form :model="editForm" :rules="formRules" ref="editFormRef" label-width="90px">
                    <el-form-item label="房间名称" prop="zname">
                        <el-input v-model="editForm.zname"></el-input>
                    </el-form-item>
                    <el-form-item label="房间类型" prop="ztype">
                        <el-input v-model="editForm.ztype"></el-input>
                    </el-form-item>
                    <el-form-item prop="zpic" label="客房图片">
                        <el-upload ref="upload2" action="http" :http-request="handledUploadEdit" list-type="picture-card"
                            :show-file-list="true" name="img" :headers="headers" :before-upload="beforeUpload"
                            :on-exceed="handleExceed" :on-preview="handlePictureCardPreview" :file-list="fileList2"
                            :on-remove="handleRemove2">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisibleImg" append-to-body>
                            <img width="100%" :src="this.editForm.zpic" alt="预览">
                        </el-dialog>
                    </el-form-item>
                    <el-form-item label="房间设施" prop="zfacility">
                        <el-input v-model="editForm.zfacility"></el-input>
                    </el-form-item>
                    <el-form-item label="客房价格" prop="zprice">
                        <el-input v-model="editForm.zprice"></el-input>
                    </el-form-item>
                    <el-form-item label="农家乐" prop="nid">
                        <el-select v-model="editForm.nid" placeholder="请选择">
                            <el-option v-for="item in options" :key="item.nid" :label="item.nname" :value="item.nid">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="text-align: right;">
                        <el-button type="primary" @click="editCancel">取消</el-button>
                        <el-button type="primary" @click="EditForm('addFormRef')">确认</el-button>
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
        this.getNname()
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
            sels: [],//选择删除的id
            list: [],
            options: [],
            listform: [],
            editForm: {},
            headers: { enctype: "multipart/form-data", Authorization: window.sessionStorage.getItem('token') },
            fileList1: [],
            fileList2: [],
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
            addformroom: {
                zname: '',
                ztype: '',
                zpic: '',
                zfacility: '',
                zprice: '',
                zstate: 1,
                nid: ''
            },
            dialogVisibleImg: false,
            dialogVisible: false,
            dialogVisible2: false,
            dialogVisible3: false,
            dialogVisible4: false,
            //规则验证
            formRules: {
                zname: [{ required: true, message: '请输入客房名称', trigger: 'blur' }],
                ztype: [
                    { required: true, message: '请输入客房类型', trigger: 'blur' }
                ],
                zfacility: [
                    { required: true, message: '请输入具体设施', trigger: 'blur' }
                ],
                zpic: [
                    { required: true, message: '请选择文件', trigger: 'change' },
                ],
                zprice: [
                    { required: true, message: '请输入价格', trigger: 'blur' }
                ],
                nid: [
                    { required: true, message: '请选择农家乐', trigger: 'blur' }
                ],

            },
            bookformRules: {
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
        //获取农家乐的nid和名称
        async getNname() {
            var id = JSON.parse(localStorage.getItem("uid"));
            const { data: res } = await this.$http.post(`agritourism/getNname/user/${id}`)
            if (res.status !== 200) {
                // console.log('nid和农家乐名称获取失败');
            } else {
                // console.log('nid和农家乐名称获取成功');
                this.options = res.data
                // console.log(this.options);
            }
        },
        async getList() {
            var id = JSON.parse(localStorage.getItem("uid")); 
            const params = {
                keyword1: this.keyword1,
                keyword2: this.keyword2,
                keyword3: this.keyword3,
                offset: (this.currentPage - 1) * this.pageSize,
                limit: this.pageSize,
                uid :id 
            };
            // console.log(params);
            const { data: res } = await this.$http.get('/room/merchant', { params })
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
        showDialog3() {
            this.dialogVisible3 = true;
        },
        //获取修改信息
        async showDialog4(id) {
            this.dialogVisible4 = true;
            const { data: res } = await this.$http.post(`/room/user/${id}`)
            // console.log(res);
            if (res.meta.status !== 200) {
                return this.$message.error('数据获取失败！')
            }
            this.editForm = res.data[0]
            // console.log(this.editForm);
            if (this.editForm.zpic) {
                let arr = this.editForm.zpic.split(",");
                let obj = { url: `http://localhost:3000` + arr }
                this.fileList2.push(obj);
            } else {
                // 处理 this.editForm.zpic 为 null 的情况
                console.log('没有找到该图片');
            }
        },
        //删除数据
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
            const ids = this.sels;
            // 发送请求到后台API
            const { data: res } = await this.$http.post(`/room/delete`, { ids })
            console.log(res);
            if (res.meta.status !== 200) {
                return this.$message.error('删除失败！')
            }
            this.$message.success('删除成功！')
            this.getList()
        },
        //选择的id
        selschange(rows) {
            this.sels = rows.map(row => row.zid);;
            // console.log("选择了：" + this.sels);
        },
        //上传图片处理
        handledUploadAdd(data) {
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
                this.addformroom.zpic = urlString;
                this.fileList2.push(urlArray);
            }).catch(err => {
                this.$refs.upload.clearFiles()
                console.log(err);
            })
        },
        //上传图片处理
        handledUploadEdit(data) {
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
                this.editForm.zpic = urlString;
                this.fileList2.push(this.editForm.zpic);
            }).catch(err => {
                this.$refs.upload2.clearFiles()
                console.log(err);
            })

        },
        //图片验证 
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
        // 关闭搜索框
        handleClose(done) {
            // 在对话框关闭前的处理，如果传入了done函数则需要手动调用done()来关闭对话框
            done();
        },
        //图片限制
        handleExceed(file, fileList) {
            this.$message('暂时只能上传一张图')
        },
        //添加移除图片
        handleRemove(file, fileList) {
            this.fileList1 = fileList
            this.fileList1.forEach((item, index) => {
                if (file.name == item.name) {
                    this.fileList1(index, 1)
                }
            })
            console.log(file, fileList)
        },
        //添加图片上传时预览
        handlePictureCardPreview(file) {
            this.addformroom.zpic = file.url;
            this.dialogVisibleImg = true;
            console.log(file);
        },
        //修改移除
        handleRemove2(file, fileList) {
            // const id = this.editForm.zid;
            // const { data: res } = this.$http.post('/agritourism/deleteimg', id)
            const urlname = this.editForm.zpic
            const fileName = urlname.substring(9)
            this.$http.delete(`/upload/delete/${fileName}`).then(response => {
                if (response.data.meta.status === 200) {
                    // 文件删除成功
                    this.fileList2.length = 0;
                    this.$refs.upload2.clearFiles()
                    this.$message.success('图片删除成功！')
                } else {
                    // 文件删除失败
                    this.$message.error('图片删除失败！')
                }
            }).catch(error => {
                // 处理错误
                console.log(error);
            })
        },

        //修改图片上传预览
        handlePictureCardPreview2(file) {
            this.editForm.zpic = file.url;
            this.dialogVisibleImg = true;
            console.log('++++', this.editForm.zpic);
            console.log('++++', file);
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
        // 添加取消
        addCancel() {
            this.dialogVisible3 = false;
            this.$refs.upload.clearFiles()
        },
        //修改取消
        editCancel() {
            this.fileList2.length = 0;
            this.dialogVisible4 = false;
            this.$refs.upload2.clearFiles()
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
            var uname = localStorage.getItem("uname");
            var user = JSON.parse(JSON.stringify(uname));

            const djoin = dayjs(this.form.djoin).format('YYYY-MM-DD HH:mm:ss');
            const dleave = dayjs(this.form.dleave).format('YYYY-MM-DD HH:mm:ss');
            const zid = this.form.zid;
            const dstate = '已预订';
            const createdname = user;
            
            let test = { djoin, dleave, zid, dstate,createdname};

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
        },
        //添加客房
        addFormroom(addFormRef) {
            this.$refs.addFormRef.validate(async valid => {
                console.log(valid);
                if (!valid) return;
                console.log(this.addformroom);
                const { data: res } = await this.$http.post('/room/add', this.addformroom);
                if (res.status !== 200) {
                    this.$message.error('添加失败！');
                    console.log(res);
                } else {
                    console.log(res);
                    this.$message.success('添加成功！');
                    this.dialogVisible3 = false;
                }
                this.$refs.upload.clearFiles()
                this.$refs.addFormRef.resetFields()
                this.getList();

            })
        },
        //修改客房
        EditForm() {
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return;
                const data = {
                    zid: this.editForm.zid,
                    nid: this.editForm.nid,
                    zname: this.editForm.zname,
                    ztype: this.editForm.ztype,
                    zpic: this.editForm.zpic,
                    zfacility: this.editForm.zfacility,
                    zprice: this.editForm.zprice,
                    zstate: this.editForm.zstate,
                }
                console.log(data);
                if (this.fileList2.length === 0) {
                    console.log(this.fileList2.length);
                    this.$message('请上传图片')
                } else {
                    const { data: res } = await this.$http.put(`room/edit`, data)
                    console.log(res);
                    if (res.status !== 200) {
                        return this.$message.error('修改失败')
                    }
                    this.$message.success('修改成功')
                    this.dialogVisible4 = false
                    this.getList()
                }
            })
        },
    },

}
</script>

<style lang="less" scoped>
.el-table-column {
    align-content: center;
}

.el-row {
    margin-bottom: 10px;
}
.data-container{
    img{
        height: 200px;
        width: 200px;
    }
}
</style>
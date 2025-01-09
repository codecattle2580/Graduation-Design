<template>
    <div class="data-container">
        <div>
           <HeaderMenu/>
        </div>

        <el-row v-for="item in Farmstay" :key="item.index" class="title">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/roomPage' }">客房</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: `/roomDetail/${item.zid}` }">{{ item.zname }}</el-breadcrumb-item>
                <el-breadcrumb-item>预定客房</el-breadcrumb-item>
            </el-breadcrumb>
        </el-row>

        <!-- 预定客房 -->
        <el-card class="conent">
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
                <el-form-item label="客房图片" prop="zpic">
                    <el-image :src="`http://localhost:3000${form.zpic}`" style=" width: 150px; height: 150px;"
                        :preview-src-list="[`http://localhost:3000${form.zpic}`]"></el-image>
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
                    <el-button type="primary" @click="addform('FormRef')">确认</el-button>
                </el-form-item>
            </el-form>
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
        this.getList()
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
            Farmstay: [],
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
    methods: {
        //获取详细信息
        async getList() {
            const id = this.$route.params.zid;
            console.log(id);
            const { data: res } = await this.$http.post(`/room/user/${id}`)
            if (res.meta.status !== 200) {
                console.log('数据获取失败');
            }
            this.form = res.data[0]
            this.Farmstay = res.data
            console.log(this.Farmstay);

        },
        //预定客房
        addform(FormRef) {
            //获取当前用户名
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
    },
}
</script>

<style lang="less" scoped>
.data-container {
    max-width: 1000px;
    margin: 0 auto;
}

.title {
    margin-top: 10px;
    border: 1px solid rgb(239, 239, 239);
    box-shadow: 3px 5px 8px 0 rgba(59, 143, 212, 0.2);
}

.menu {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    border-radius: 10px;
    box-shadow: 3px 5px 8px 0 rgba(59, 143, 212, 0.2);

}

.conent {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
}

.el-breadcrumb {

    font-size: 15px;
    margin-top: 20px;
    margin-left: 20px;
}

.el-form {
    width: 500px;
}
</style>
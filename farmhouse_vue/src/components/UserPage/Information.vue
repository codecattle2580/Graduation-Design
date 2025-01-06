<template>
    <div class="farmstay-detail">
        <div>
            <el-menu class="menu" mode="horizontal">
                <router-link to="/">
                    <el-menu-item index="1">首页</el-menu-item>
                </router-link>
                <router-link to="/agritainmentPage">
                    <el-menu-item index="2">农家乐</el-menu-item>
                </router-link>
                <router-link to="/foodPage">
                    <el-menu-item index="3">美食信息</el-menu-item>
                </router-link>
                <router-link to="/roomPage">
                    <el-menu-item index="4">客房信息</el-menu-item>
                </router-link>
                <router-link to="/information">
                    <el-menu-item index="5">个人信息</el-menu-item>
                </router-link>
                <router-link to="/home">
                    <el-menu-item index="5">后台管理</el-menu-item>
                </router-link>
            </el-menu>
        </div>

        <div class="mbx">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>个人信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-card class="card-center">
            <el-form :model="Form" :rules="FormRules" ref="FormRef" label-width="80px" style="width: 500px; ">
                <el-form-item label="用户名" prop="uusername">
                    <el-input v-model="Form.uusername"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="upassword">
                    <el-input v-model="Form.upassword" show-password></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="uphone">
                    <el-input v-model="Form.uphone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="uemail">
                    <el-input v-model="Form.uemail"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="state">
                    <el-tag>{{ tagText }}</el-tag>
                </el-form-item>
                <el-form-item style="text-align: right;">
                    <el-button type="primary" @click="editFrom('FormRef')">修改</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>
  
<script>

export default {
    created() {
        this.getUser()
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
            Form: {
                uusername: '',
                upassword: '',
                uemail: '',
                uphone: '',
                state: ''
            },
            //表单验证规则
            FormRules: {
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
            }
        }
    },
    computed: {
        tagText() {
            if (this.Form.state === '0') {
                return '管理员';
            } else if (this.Form.state === '1') {
                return '用户';
            } else if (this.Form.state === '2') {
                return '商家';
            }
        }
    },
    methods: {
        async getUser() {
            var id = localStorage.getItem('uid');
            const { data: res } = await this.$http.post('/user', { uid: id })
            this.Form = res.data[0]
            console.log(this.Form);
        },
        //修改信息
        editFrom() {
            this.$refs.FormRef.validate(async valid => {
                if (!valid) return

                //发起修改用户信息的数据请求
                const { data: res } = await this.$http.put('updateUser', this.Form)
                if (res.meta.status !== 200) {
                    return this.$message.error('用户信息更新失败！');
                }
                this.getUser()
                this.$message.success('用户信息更新成功！')
            })
        }

    }
}
</script>
<style scoped lang="less">
.menu {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    border-radius: 10px;
    border: 1px solid rgb(237, 228, 228);
    box-shadow: 3px 5px 8px 0 rgba(27, 133, 220, 0.2);

}

.mbx {
    margin-top: 10px;
    border: 1px solid rgb(239, 239, 239);
    box-shadow: 3px 5px 8px 0 rgba(59, 143, 212, 0.2);
}

.el-breadcrumb {
    font-size: 15px;
    margin-top: 20px;
    margin-left: 20px;
}


.card-center {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;

    .el-row {
        margin-top: 30px;
    }

}


a {
    text-decoration: none;
}

.router-link-active {
    text-decoration: none;
}

.npic-card {
    img {
        margin-top: 10px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(221, 216, 216, 0.2);
        height: 150px;
        width: 150px;
    }

}

.grid:hover img {
    transform: scale(1.1);
}

.grid:hover span {
    color: blue;
    font-weight: bold;
}

.grid {
    border: 1px solid rgb(228, 227, 227);
    border-radius: 20px;
    text-align: center;
    margin-bottom: 20px;
    margin-right: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

    span {
        font-size: 5px;
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

.content {
    margin-top: 10px;
    border: 1px solid rgb(173, 208, 188);
}

.conentright {
    h3 {
        margin-left: 25px;
    }
}

.user-name {
    font-size: 18px;
    font-weight: bold;
}

.message-time {
    text-align: right;
}

.farmstay-detail {
    max-width: 1000px;
    margin: 0 auto;
}

.farmstay-image {
    width: 100%;
    height: 60%;
}
</style>
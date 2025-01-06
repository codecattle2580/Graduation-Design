<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="btns">
        <h2>农家乐后台登录</h2>
      </div>
      <!-- 登陆表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
        </el-form-item>

        <!--单选框 -->
        <el-form-item class="btns">
          <el-radio v-model="radio" label="1">用户</el-radio>
          <el-radio v-model="radio" label="2">商家</el-radio>
          <el-radio v-model="radio" label="0">管理员</el-radio>
        </el-form-item>

        <!-- 按钮区 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="success" @click="Register()">注册</el-button>
          
        </el-form-item>
       
      </el-form>
    </div>
  </div>
</template>
  
<script>
export default {
  data() {
  
    return {
      radio: '1',
      addDialogVisible: false,
      //登录表单的数据绑定
      loginForm: {
        username: 'admin',
        password: '123456',
      }, 
       addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      //表单的验证规则对象
      loginFormRules: {
        //验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
        //验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 5,
            max: 15,
            message: '长度在 5 到 15 个字符',
            trigger: 'blur',
          },
        ],
      },
      
    }
  },
  methods: {
    //登录
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) { return } else {
          if (this.radio == 1) {
            const { data: res } = await this.$http.post('login', this.loginForm)
            //判断是否登录成功
            if (res.status !== 200) return this.$message.error('登录失败')
            this.$message.success('登陆成功!')
            console.log(res);
            window.sessionStorage.setItem('token', res.token)
            //将id暂存在本地的
            localStorage.setItem('uid', res.data.uid)
            //将用户名存在本地
            localStorage.setItem('uname', res.data.uusername)
            //将 radio 缓存
            localStorage.setItem('radio', this.radio)

            // 2.通过编程式导航调转到后台主页，路由地址是  /home
            this.$router.push('/userpage')
          } else if (this.radio == 2) {
            const { data: res } = await this.$http.post('login2', this.loginForm)
            if (res.status !== 200) return this.$message.error('登录失败')
            this.$message.success('登陆成功!')

            window.sessionStorage.setItem('token', res.token)
            localStorage.setItem('uid', res.data.uid)
            localStorage.setItem('uname', res.data.uusername)
            localStorage.setItem('radio', this.radio)
            this.$router.push('/home')
          } else {
            const { data: res } = await this.$http.post('login0', this.loginForm)
            if (res.status !== 200) return this.$message.error('登录失败')
            this.$message.success('登陆成功!')
            window.sessionStorage.setItem('token', res.token)

            localStorage.setItem('uid', res.data.uid)
            localStorage.setItem('uname', res.data.uusername)
            localStorage.setItem('radio', this.radio)
            this.$router.push('/home')
          }
        }

      })
    },
    Register(){
      console.log('已点击');
      console.log(this.$router)
      this.$router.push({ path: '/register' })
      
    },
    //监听添加用户对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    }
  },
}
</script>
  
<style lang="less" scoped>
.login_container {
  background-image: url('../../public/images/bg1.jpg');
  height: 100%;
  background-color: #ddd;
}

.login_box {
  width: 450px;
  height: 320px;
  border-radius: 20px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.login_form {
  position: absolute;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: space-around;
}
</style>
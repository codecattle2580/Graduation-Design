<template>
  <div class="form-container">

    <el-form :model="formData" :rules="rules" ref="elForm" size="medium" label-width="100px">
      <h2>注册信息</h2>
      <el-form-item label="用户名" prop="uusername">
        <el-input v-model="formData.uusername" placeholder="请输入用户名">
        </el-input>
      </el-form-item>
      <el-form-item label="密码" prop="upassword">
        <el-input v-model="formData.upassword" placeholder="请输入密码">
        </el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="uphone">
        <el-input v-model="formData.uphone" placeholder="请输入手机号">
        </el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="uemail">
        <el-input v-model="formData.uemail" placeholder="请输入邮箱"></el-input>
      </el-form-item>

      <el-form-item label="角色">
        <el-radio-group v-model="formData.state">
          <el-radio label="1">用户</el-radio>
          <el-radio label="2">商家</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-row>
          <el-col :span="8">
            <el-button type="info" @click="resetForm">重置</el-button>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="submitForm('elForm')">注册</el-button>
          </el-col>
          <el-col :span="8">
            <el-button type="warning" @click="login">返回</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
export default {
  components: {},
  props: [],
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
      formData: {
        uusername: '',
        upassword: '',
        uphone: '',
        uemail: '',
        state: '1',
      },
      rules: {
        uusername: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { validator: this.validateDate, trigger: 'change' }
        ],
        upassword: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        uphone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },],
        uemail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },],
        state: [
          { required: true, message: '请选择一个选项', trigger: 'change' }
        ],
      },
    }
  },

  methods: {
    submitForm() {
      this.$refs.elForm.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post('/register', this.formData)
        console.log(res);
        if (res.status !== 200) {
          return this.$message.error('注册失败！')
        }
        this.$message.success('注册成功！')
        this.$router.push('/login')
      })
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
    },
    login() {
      this.$router.push('/login')
    }
  }
}

</script>
<style lang="less" scoped>
.form-container {
  background-image: url('../../public/images/bg2.jpg');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

h2 {
  text-align: center;
}

.el-form {
  width: 450px;
  margin: 150px auto;
  background-color: #fff;
  box-sizing: border-box;
  padding: 30px;
  border-radius: 20px;
}
</style>

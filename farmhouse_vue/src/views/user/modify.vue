<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>修改密码</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图曲-->
    <el-card class="box-card">
      <el-form :model="form" :rules="formRules" ref="FormRef" label-width="80px">

        <el-form-item label="原密码" prop="upassword">
          <el-input v-model="form.upassword" show-password></el-input>
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="form.newPassword" show-password></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="checkPassword">
          <el-input v-model="form.checkPassword" show-password></el-input>
        </el-form-item>

        <el-button type="primary" @click="editFrom('FormRef')">确认修改</el-button>
      </el-form>

    </el-card>
  </div>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({

  created() {
    this.form.uid = JSON.parse(localStorage.getItem("uid"));
    // console.log(this.form);
  },

  data() {
    return {

      form: {
        uid: "",
        upassword: "",
        newPassword: "",
        checkPassword: "",
      },

      //表单验证规则
      formRules: {
        upassword: [
          { required: true, message: "请输入原密码", trigger: "blur" },
          // { validator: validatePass, message: "原密码不正确", trigger: "blur" },
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: '密码的长度在6~15之间',
            trigger: 'blur',
          }
        ],
        checkPassword: [
          { required: true, message: "不能为空", trigger: "blur" },
          { validator: this.validateConfirmPassword, trigger: 'blur' },
        ],

      }

    }

  },
  methods: {
    validateConfirmPassword(rule, value, callback) {
      if (value !== this.form.newPassword) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    },
    //修改密码信息
    editFrom(FormRef) {
      this.$refs.FormRef.validate(async valid => {
        if (!valid) return
        try {
          const { data: res } = await this.$http.post('/user/change', this.form)
          if (res.status !== 200) {
            return this.$message.error('用户信息更新失败！');
          } 
          console.log(res);
          this.$message.success(res.message)
          this.$router.push('/login')
        }catch(error){
          if (error.response  && error.response.status === 400) {
            // 原密码验证失败
            // 在这里添加您的代码，例如显示错误信息
            this.$message.error('原密码输入不正确');
          }
        }
        
        
      })
    },


  }
})

</script>

<style lang="less" scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.box-card {
  margin-top: 20px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;

  .el-form-item {
    .el-input {
      width: 200px;
    }
  }

  .el-button {
    margin-left: 80px;
  }
}
</style>


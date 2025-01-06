<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>个人信息</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图曲-->
    <el-card class="box-card">
      <el-form :model="Form" :rules="FormRules" ref="FormRef" label-width="80px">
        <el-form-item label="用户名" prop="uusername">
          <el-input v-model="Form.uusername" ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="uphone">
          <el-input v-model="Form.uphone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="uemail">
          <el-input v-model="Form.uemail"></el-input>
        </el-form-item>
        <el-button type="primary" @click="editFrom">确认修改</el-button>
      </el-form>

    </el-card>
  </div>

</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({

  created() {
    this.getUser();
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
  methods: {
    //根据id获取用户信息
    async getUser() {
      var id = localStorage.getItem('uid');
      const { data: res } = await this.$http.post('/user', { uid: id })
      this.Form = res.data[0] 
    },
    
    //修改用户信息
      editFrom() {
       this.$refs.FormRef.validate(async valid=>{
        if(!valid) return 

        //发起修改用户信息的数据请求
        const {data:res} = await this.$http.put('updateUser',this.Form)
        if(res.meta.status!==200){
          return this.$message.error('用户信息更新失败！');
        }
        this.getUser()
        this.$message.success('用户信息更新成功！')
       })
    }
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


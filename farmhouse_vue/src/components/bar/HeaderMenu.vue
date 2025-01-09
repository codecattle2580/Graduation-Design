<template>
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
        <el-menu-item index="6">后台管理</el-menu-item> <!-- 注意：index应该唯一 -->
      </router-link>
    </el-menu>
  </template>
  
  <script>
  export default {
    name: 'HeaderMenu',
  };
  </script>
  
  <style scoped>
  /* 这里可以添加特定于这个组件的样式 */
  .menu {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    border-radius: 10px;
    box-shadow: 3px 5px 8px 0 rgba(59, 143, 212, 0.2);

}
  </style>
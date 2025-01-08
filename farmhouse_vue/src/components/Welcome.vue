<template>
  <div class="welcome-container">
    <header class="header">
      <h1>欢迎使用农家乐管理系统</h1>
      <p>当前版本：v1.0.0</p>
    </header>

    <main class="main-content">
      <section class="user-info">
        <h2>欢迎您，管理员</h2>
        <p>上次登录时间：2023-10-01 14:30</p>
      </section>

      <section class="quick-actions">
        <h2>快捷操作</h2>
        <div class="actions-grid">
          <router-link to="/orders" class="action-button">订单管理</router-link>
          <router-link to="/products" class="action-button">产品管理</router-link>
          <router-link to="/users" class="action-button">用户管理</router-link>
          <router-link to="/settings" class="action-button">系统设置</router-link>
        </div>
      </section>

      <section class="data-overview">
        <h2>数据概览</h2>
        <div class="overview-grid">
          <div class="overview-item">
            <p>今日订单数</p>
            <h3>56</h3>
          </div>
          <div class="overview-item">
            <p>今日销售额</p>
            <h3>¥8,200</h3>
          </div>
          <div class="overview-item">
            <p>在线用户数</p>
            <h3>120</h3>
          </div>
          <div class="overview-item">
            <p>最新消息</p>
            <h3>系统更新完成</h3>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style lang="less" scoped>
.welcome-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;

  .header {
    text-align: center;
    margin-bottom: 20px;

    h1 {
      font-size: 2.5em;
      color: #2c3e50;
    }

    p {
      font-size: 1.2em;
      color: #7f8c8d;
    }
  }

  .main-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;

    section {
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .user-info {
      h2 {
        font-size: 1.8em;
        color: #2c3e50;
      }

      p {
        font-size: 1.2em;
        color: #7f8c8d;
      }
    }

    .quick-actions {
      .actions-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;

        .action-button {
          padding: 15px;
          background-color: #1abc9c;
          color: white;
          text-align: center;
          border-radius: 5px;
          text-decoration: none;
          transition: background-color 0.3s;

          &:hover {
            background-color: #16a085;
          }
        }
      }
    }

    .data-overview {
      .overview-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;

        .overview-item {
          padding: 15px;
          background-color: #ecf0f1;
          border-radius: 5px;
          text-align: center;

          p {
            font-size: 1.2em;
            color: #7f8c8d;
          }

          h3 {
            font-size: 1.8em;
            color: #2c3e50;
          }
        }
      }
    }
  }
}
</style>
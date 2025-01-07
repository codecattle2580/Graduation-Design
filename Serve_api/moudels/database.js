const mysql=require('mysql2');
const Sequelize =require('sequelize')

var Mysequelize = new Sequelize('farmhouse','root','root',{
    host:'localhost',
    port:3306,
    dialect:'mysql',
    timezone: '+08:00', // 设置时区为东八区
    pool:{
        max:20,  //最大连接对象的个数
        min:5,  //最小连接对象的个数
        idle:1000  //最长等待时间，单位为毫秒
    }
})


module.exports = Mysequelize
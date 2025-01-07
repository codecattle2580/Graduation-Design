const Sequelize =require('sequelize')
const sequelize = require('../moudels/database')

var User = sequelize.define('users',{
    uid:{
        type:Sequelize.INTEGER,  //表示属性的数据类型
        // field:'s_id',   //属性对应的列名,若不定义field则表中的列名(sid)就是属性名
        primaryKey:true,  //表示主键
        autoIncrement:true  //表示主键自增
    },
    uusername:{
        type:Sequelize.STRING
    },
    upassword:{
        type:Sequelize.STRING
    },
    uphone:{
        type:Sequelize.STRING
    },
    uemail:{
        type:Sequelize.STRING
    },
    state:{
        type:Sequelize.STRING
    }
},{
    TableName:'users', //true表示使用给定的表名，false表示模型名后加s作为表名
    timestamps:false  
})


module.exports = User; // 导出模型
//引入数据类型模块
const { STRING, TEXT, INTEGER } = require('sequelize');
const sequelize = require('../moudels/database')


const Agritourism = sequelize.define('agritourism', {
    nid: {
        type: INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    uid:{
        type: INTEGER,
        allowNull: false,
    },
    nname: {
        type: STRING,
    },
    ntype: {
        type: STRING,
    },
    npic: {
        type: STRING,
    },
    naddress: {
        type: STRING,
    },
    nphone: {
        type: STRING,
    },
    nintroduce: {
        type: TEXT,
    }
}, {
    tableName: 'agritourism',
    timestamps: false  //不自动生成创建时间
})


module.exports = Agritourism;
//引入数据类型模块
const { STRING, INTEGER, DATE,ENUM,Sequelize} = require('sequelize');
const sequelize = require('../moudels/database')

const Order = sequelize.define('order', {
    did: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    createdname:{
        type: INTEGER,
    },
    dbooktime: {
        type: DATE(6),
        defaultValue: Sequelize.NOW
    },
    djoin: {
        type: DATE,
    },
    dleave: {
        type: DATE,
    },
    dstate: {
        type: ENUM('未预定','已预订','已完成'),
    },
    messagestate: {
        type: ENUM('未评论','已评论','禁止评论'),
    },
    zid: {
        type: INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'order',
    timestamps: false  //不自动生成创建时间
})

module.exports = Order;
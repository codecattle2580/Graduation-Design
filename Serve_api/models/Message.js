//引入数据类型模块
const { STRING, INTEGER, DATE, ENUM, Sequelize } = require('sequelize');
const sequelize = require('../moudels/database')

const Message = sequelize.define('message', {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    did: {
        type: INTEGER,
    },
    message: {
        type: INTEGER,
    },
    messagetime: {
        type: STRING,
    },
    foodgrade: {
        type: INTEGER,
    },
    roomgrade: {
        type: INTEGER,
    },
    user: {
        type: STRING
    }
}, {
    tableName: 'message',
    timestamps: false  //不自动生成创建时间
})

module.exports = Message;
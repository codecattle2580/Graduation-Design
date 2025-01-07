//引入数据类型模块
const { STRING, INTEGER,DECIMAL,TINYINT } = require('sequelize');
const sequelize = require('../moudels/database')

const Room = sequelize.define('room', {
    zid: {
        type: INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    zname: {
        type: STRING,
    },
    ztype: {
        type: STRING,
    },
    zpic: {
        type: STRING,
    },
    zfacility: {
        type: STRING,
    },
    zprice: {
        type: DECIMAL,
    },
    zstate: {
        type: TINYINT,
    },
    nid: {
        type: INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'room',
    timestamps: false  //不自动生成创建时间
})

module.exports = Room;
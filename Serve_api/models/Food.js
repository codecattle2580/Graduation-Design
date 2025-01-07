//引入数据类型模块
const { STRING, INTEGER, TEXT } = require('sequelize');
const sequelize = require('../moudels/database')

const Food = sequelize.define('food', {
    mid: {
        type: INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    mname: {
        type: STRING,
    },
    mtype: {
        type: STRING,
    },
    mpic: {
        type: STRING,
    },
    mflavour: {
        type: TEXT,
    },
    nid: {
        type: INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'food',
    timestamps: false  //不自动生成创建时间
})

module.exports = Food;
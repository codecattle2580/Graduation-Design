var express = require('express');
var router = express.Router();
const sequelize = require('../moudels/database')
const { Op, Sequelize } = require('sequelize');
const Agritourism = require('../models/Agritourism');
const Room = require('../models/Room');
const Order = require('../models/Order');
const User = require('../models/User');

//获取所有数据
router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit); // 每页记录数
  const offset = parseInt(req.query.offset); // 起始记录位置
  const keyword1 = req.query.keyword1; // 搜索关键词1
  const keyword2 = req.query.keyword2; // 搜索关键词2
  const keyword3 = req.query.keyword3; // 搜索关键词3
  // console.log(req.query);
  // console.log(keyword1);
  const where = keyword1 || keyword2 ? {
    [Op.or]: [
      keyword1 ? { zname: { [Op.like]: `%${keyword1}%`, }, } : null,
      keyword2 ? { ztype: { [Op.like]: `%${keyword2}%`, }, } : null
    ].filter(Boolean),
  } : {};

  const order = await Order.findAndCountAll({
    limit,
    offset,
    include: [{
      model: Room,
      where,
      include: [{
        model: Agritourism,
        where: keyword3 ? {
          nname: {
            [Op.like]: `%${keyword3}%`
          }
        } : {},
        include: User
      }]
    }]
  });
  // console.log(order);
  //返回rows和count
  const result = {
    rows: order.rows.map(item => {
      //将三个表数据都遍历出来
      // console.log(item.room.dataValues);
      return {
        ...item.dataValues,
        ...item.room.dataValues,
        ...item.room.dataValues.agritourism.dataValues,
        ...item.room.dataValues.agritourism.dataValues.user.dataValues
      };
    }),
    count: order.count
  };
  res.send(result);

})

//根据uid获取所有数据
router.get('/merchant', async (req, res) => {
  const limit = parseInt(req.query.limit); // 每页记录数
  const offset = parseInt(req.query.offset); // 起始记录位置
  const keyword1 = req.query.keyword1; // 搜索关键词1
  const keyword2 = req.query.keyword2; // 搜索关键词2
  const keyword3 = req.query.keyword3; // 搜索关键词3
  const uid = req.query.uid;
  // console.log(req.query);
  // console.log(keyword1);
  const where = keyword1 || keyword2 ? {
    [Op.or]: [
      keyword1 ? { zname: { [Op.like]: `%${keyword1}%`, }, } : null,
      keyword2 ? { ztype: { [Op.like]: `%${keyword2}%`, }, } : null
    ].filter(Boolean),
  } : {};

  const order = await Order.findAndCountAll({
    limit,
    offset,
    include: [{
      model: Room,
      where,
      include: [{
        model: Agritourism,
        where: keyword3 ? {
          nname: {
            [Op.like]: `%${keyword3}%`
          }
        } : { uid: uid },
        include: User
      }]
    }]
  });
  // console.log(order);
  //返回rows和count
  const result = {
    rows: order.rows.map(item => {
      //将三个表数据都遍历出来
      // console.log(item.room.dataValues);
      return {
        ...item.dataValues,
        ...item.room.dataValues,
        ...item.room.dataValues.agritourism.dataValues,
        ...item.room.dataValues.agritourism.dataValues.user.dataValues
      };
    }),
    count: order.count
  };
  res.send(result);

})

///根据user获取所有数据
router.get('/getusername', async (req, res) => {
  const limit = parseInt(req.query.limit); // 每页记录数
  const offset = parseInt(req.query.offset); // 起始记录位置
  const keyword1 = req.query.keyword1; // 搜索关键词1
  const keyword2 = req.query.keyword2; // 搜索关键词2
  const keyword3 = req.query.keyword3; // 搜索关键词3
  const user = req.query.user;
  // console.log(req.query);
  console.log(req.query.user);
  // console.log(keyword1);
  const where = keyword1 || keyword2 ? {
    [Op.or]: [
      keyword1 ? { zname: { [Op.like]: `%${keyword1}%`, }, } : null,
      keyword2 ? { ztype: { [Op.like]: `%${keyword2}%`, }, } : null
    ].filter(Boolean),
  } : {};

  const order = await Order.findAndCountAll({
    limit,
    offset,
    where: {createdname:user},
    include: [{
      model: Room,
      where,
      include: [{
        model: Agritourism,
        where: keyword3 ? {
          nname: {
            [Op.like]: `%${keyword3}%`
          }
        } : { },
      }]
    }]
  });
  // console.log(order);
  //返回rows和count
  const result = {
    rows: order.rows.map(item => {
      //将三个表数据都遍历出来
      // console.log(item.room.dataValues);
      return {
        ...item.dataValues,
        ...item.room.dataValues,
        ...item.room.dataValues.agritourism.dataValues,
      };
    }),
    count: order.count
  };
  res.send(result);

})

//添加订单
router.post('/add', async (req, res) => {
  // console.log("返回结果：", req.body);
  await Order.create({
    djoin: req.body.djoin,
    dleave: req.body.dleave,
    zid: req.body.zid,
    dstate: '已预订',
    messagestate: '未评论',
    createdname:req.body.createdname
  }).then(async result => {
    await Room.update(
      { zstate: 0 },
      { where: { zid: req.body.zid } }
    );
    console.log(result);
    res.json({
      status: 200,
      msg: '订单生成成功',
      data: result

    })
  }).catch(err => {
    res.json({
      status: 400,
      msg: '订单生成失败',
      err: err
    })
  });
});

//根据id进行删除
router.post('/delete', async (req, res) => {
  const ids = req.body.ids;
  console.log("值为：" + ids);
  await Order.destroy({
    where: { did: ids }
  }).then(() => {
    res.json({
      meta: {
        status: 200,
        msg: '删除成功！',
        data: null
      },
    })
  }).catch(err => {
    res.json({
      meta: {
        status: 201,
        msg: '删除失败！',
        err: err
      },
    })
  });
});

//根据id的值进行查询
router.post('/user/:id', async (req, res) => {
  const id = req.params.id;
  console.log("id值为：" + id);
  await Order.findAll({
    where: {
      did: id
    },
    include: [{
      model: Room,
      include: Agritourism,

    }],
  }).then(result => {
    console.log(result);
    if (result.data !== '') {
      // 使用 map 方法遍历查询结果并将数据添加到新数组中
      let dataArray = result.map(item => {
        // 在这里处理每个元素并返回新值
        return { ...item.dataValues, ...item.room.dataValues, ...item.room.dataValues.agritourism.dataValues, };
      });

      res.json({
        meta: {
          status: 200,
          msg: '数据获取成功',
        },

        data: dataArray,
      })
    }
  }).catch(err => {
    res.json({
      status: 201,
      msg: '数据获取失败',
      err: err
    })
  })
})


//订单完成操作
router.post('/edit', async (req, res) => {
  const { did, zid } = req.body
  console.log('did:', did);
  console.log('zid:', zid);

  await sequelize.transaction(async (t) => {
    await Order.update({
      dstate: '已完成'
    }, {
      where: { did: did },
      transaction: t
    });

    await Room.update({
      zstate: 1
    }, {
      where: { zid: zid },
      transaction: t
    });
  }).then(result => {
    res.json({
      status: 200,
      msg: '修改成功！',
      data: result
    })
  }).catch(err => {
    console.log(err);
    res.json({
      status: 201,
      msg: '修改失败！',
      err: err
    })
  });
})

module.exports = router;
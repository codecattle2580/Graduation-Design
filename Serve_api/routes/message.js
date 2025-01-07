var express = require('express');
var router = express.Router();
const { Op } = require('sequelize');
const Agritourism = require('../models/Agritourism');
const Room = require('../models/Room');
const Order = require('../models/Order');
const Message = require('../models/Message');

//获取所有留言信息
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

  const message = await Message.findAndCountAll({
    limit,
    offset,
    include: [{
      model: Order,
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
        }]
      }]
    }]
  });
  // console.log(order);
  //返回rows和count
  const result = {
    rows: message.rows.filter(item => item.order !== null).map(item => {
      return {
        ...item.dataValues,
        ...item.order.dataValues,
        ...item.order.dataValues.room.dataValues,
        ...item.order.dataValues.room.dataValues.agritourism.dataValues
      };
    }),
    count: message.count
  };
  console.log(result.count);
  res.send(result);
})

//根据uid获取信息
router.get('/merchant', async (req, res) => {
  const limit = parseInt(req.query.limit); // 每页记录数
  const offset = parseInt(req.query.offset); // 起始记录位置
  const keyword1 = req.query.keyword1; // 搜索关键词1
  const keyword2 = req.query.keyword2; // 搜索关键词2
  const keyword3 = req.query.keyword3; // 搜索关键词3
  const uid = req.query.uid;
  console.log('uid',uid);
  const where = keyword1 || keyword2 ? {
    [Op.or]: [
      keyword1 ? { zname: { [Op.like]: `%${keyword1}%`, }, } : null,
      keyword2 ? { ztype: { [Op.like]: `%${keyword2}%`, }, } : null
    ].filter(Boolean),
  } : {};

  const message = await Message.findAndCountAll({
    limit,
    offset,
    include: [{
      model: Order,
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
        }]
      }]
    }]
  });

  const rows = message.rows.filter(item => item.order !== null).map(item => {
    return {
      ...item.dataValues,
      ...item.order.dataValues,
      ...item.order.dataValues.room.dataValues,
      ...item.order.dataValues.room.dataValues.agritourism.dataValues
    };
  })
  const count = rows.length
  const result = { rows, count };
  // console.log(result);
  res.send(result);

})

//根据uid获取信息
router.get('/getusername', async (req, res) => {
  const limit = parseInt(req.query.limit); // 每页记录数
  const offset = parseInt(req.query.offset); // 起始记录位置
  const keyword1 = req.query.keyword1; // 搜索关键词1
  const keyword2 = req.query.keyword2; // 搜索关键词2
  const keyword3 = req.query.keyword3; // 搜索关键词3
  const user = req.query.user;
  console.log('user',user);
  const where = keyword1 || keyword2 ? {
    [Op.or]: [
      keyword1 ? { zname: { [Op.like]: `%${keyword1}%`, }, } : null,
      keyword2 ? { ztype: { [Op.like]: `%${keyword2}%`, }, } : null
    ].filter(Boolean),
  } : {};

  const message = await Message.findAndCountAll({
    limit,
    offset,
    where: {user:user},
    include: [{
      model: Order,
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
        }]
      }]
    }]
  });

  const rows = message.rows.filter(item => item.order !== null).map(item => {
    return {
      ...item.dataValues,
      ...item.order.dataValues,
      ...item.order.dataValues.room.dataValues,
      ...item.order.dataValues.room.dataValues.agritourism.dataValues
    };
  })
  const count = rows.length
  const result = { rows, count };
  // console.log(result);
  res.send(result);

})



// 根据nid查询
router.post('/getnid/:nid', async (req, res) => {
  const nid = req.params.nid
  console.log(nid);
  const message = await Message.findAll({
    include: [
      {
        model: Order,
        include: [
          {
            model: Room,
            where: { nid: nid },
          }
        ]
      }
    ]
  });
  const filteredMessages = message.filter(message => {
    // 在这里添加你的过滤条件
    return message.order && message.order.room;
  });

  // 检查查询结果是否为空
  if (filteredMessages.length === 0) {
    // 处理查询结果为空的情况
    res.json({
      status: 201,
      msg: '暂无评论',
      data: ''
    })
  } else {
    res.json({
      status: 200,
      msg: '获取成功',
      data: filteredMessages
    })
  }

})

// 根据nid查询
router.post('/getzid/:zid', async (req, res) => {
  const zid = req.params.zid
  console.log(zid);
  const message = await Message.findAll({
    include: [
      {
        model: Order,
        include: [
          {
            model: Room,
            where: { zid: zid },
          }
        ]
      }
    ]
  });
  const filteredMessages = message.filter(message => {
    // 在这里添加你的过滤条件
    return message.order && message.order.room;
  });

  // 检查查询结果是否为空
  if (filteredMessages.length === 0) {
    // 处理查询结果为空的情况
    res.json({
      status: 201,
      msg: '暂无评论',
      data: ''
    })
  } else {
    res.json({
      status: 200,
      msg: '获取成功',
      data: filteredMessages
    })
  }

})

//添加留言
router.post('/add', async (req, res) => {
  // console.log("返回结果：", req.body);
  await Message.create({
    did: req.body.did,
    user: req.body.user,
    message: req.body.message,
    messagetime: req.body.messagetime,
    foodgrade: req.body.foodgrade,
    roomgrade: req.body.roomgrade,
  }).then(async result => {
    await Order.update(
      { messagestate: '已评论' },
      { where: { did: req.body.did } }
    );
    console.log(result);
    res.json({
      status: 200,
      msg: '留言成功！',
      data: result

    })
  }).catch(err => {
    res.json({
      status: 400,
      msg: '留言失败！',
      err: err
    })
  });


});

//根据id进行删除
router.post('/delete', async (req, res) => {
  const ids = req.body.ids;
  console.log("值为：" + ids);
  await Message.destroy({
    where: { id: ids }
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

//根据id查询
router.post('/user/:id', (req, res) => {
  const id = req.params.id;
  console.log("id值为：" + id);
  Message.findAll({
    where: {
      id: id
    },
    include: [{
      model: Order,
      include: [{
        model: Room,
        include: Agritourism,
      }]

    }],
  }).then(result => {
    console.log(result);
    if (result.data !== '') {
      // 使用 map 方法遍历查询结果并将数据添加到新数组中
      let dataArray = result.map(item => {
        // 在这里处理每个元素并返回新值
        return {
          ...item.dataValues,
          ...item.order.dataValues,
          ...item.order.dataValues.room.dataValues,
          ...item.order.dataValues.room.dataValues.agritourism.dataValues
        };
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

module.exports = router;
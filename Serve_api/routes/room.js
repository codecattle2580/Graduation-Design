var express = require('express');
var router = express.Router();
const { Op } = require('sequelize');
const Agritourism = require('../models/Agritourism');
const Food = require('../models/Food');
const Room = require('../models/Room');

//按照搜索客房的所有数据
router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit); // 每页记录数
  const offset = parseInt(req.query.offset); // 起始记录位置
  const keyword1 = req.query.keyword1; // 搜索关键词1
  const keyword2 = req.query.keyword2; // 搜索关键词2
  const keyword3 = req.query.keyword3; // 搜索关键词3
  console.log(req.query);
  console.log(keyword1);
  const where = keyword1 || keyword2 ? {
    [Op.or]: [
      keyword1 ? { zname: { [Op.like]: `%${keyword1}%`, }, } : null,
      keyword2 ? { ztype: { [Op.like]: `%${keyword2}%`, }, } : null
    ].filter(Boolean),
  } : {};
  const room = await Room.findAndCountAll({
    where,
    limit,
    offset,
    include: [{
      model: Agritourism,
      where: keyword3 ? {
        nname: {
          [Op.like]: `%${keyword3}%`
        }
      } : {}
    }]
  });
  // console.log(room);

  //返回rows和count
  const result = {
    rows: room.rows.map(item => {
      return { ...item.dataValues, ...item.agritourism.dataValues };
    }),
    count: room.count
  };
  // console.log('查询完成');
  res.send(result);
})


//根据uid查询所有的数据
router.get('/merchant', async (req, res) => {
  const limit = parseInt(req.query.limit); // 每页记录数
  const offset = parseInt(req.query.offset); // 起始记录位置
  const keyword1 = req.query.keyword1; // 搜索关键词1
  const keyword2 = req.query.keyword2; // 搜索关键词2
  const keyword3 = req.query.keyword3; // 搜索关键词3
  const uid = req.query.uid;

  const where = keyword1 || keyword2 ? {
    [Op.or]: [
      keyword1 ? { zname: { [Op.like]: `%${keyword1}%`, }, } : null,
      keyword2 ? { ztype: { [Op.like]: `%${keyword2}%`, }, } : null
    ].filter(Boolean),
  } : {};
  const room = await Room.findAndCountAll({
    where,
    limit,
    offset,
    include: [{
      model: Agritourism,
      where: keyword3 ? {
        nname: {
          [Op.like]: `%${keyword3}%`
        }
      } : {uid:uid}
    }]
  });
  // console.log(room);

  //返回rows和count
  const result = {
    rows: room.rows.map(item => {
      return { ...item.dataValues, ...item.agritourism.dataValues };
    }),
    count: room.count
  };
  // console.log('查询完成');
  res.send(result);
})

//获取十条客房数据
router.get('/asPage', async (req, res) => {
  Room.findAll({
    limit: 10 
  }).then(result => {
    res.json({
      status: 200,
      msg: '客房信息获取成功！',
      data: result
    })

  }).catch(err=>{
    res.json({
      status: 201,
      msg: '客房信息获取失败！',
      err: err
    })
  })
})

// 添加客房
router.post('/add', async (req, res) => {
  const { nid, zname, ztype, zpic, zfacility,zprice,zstate } = req.body;
  console.log(req.body);
  await Room.create({
    nid,
    zname,
    ztype,
    zpic,  //存图片地址
    zfacility,
    zprice,
    zstate,
  }).then(result => {
    res.json({
        status: 200,
        msg: '添加成功！',
        data: result
    })
  }).catch(err => {
    res.json({
        status: 201,
        msg: '添加失败！',
        err: err
    })
  });
});


//实现修改
router.put('/edit', async (req, res) => {
  const { zid,nid, zname, ztype, zpic, zfacility, zprice,zstate} = req.body;
  console.log('修改id',req.body.zid);
  await Room.update({
    nid,
    zname,
    ztype,
    zpic,
    zfacility,
    zprice,
    zstate
  }, {
    where: { zid: zid }
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

//根据id的值进行查询
router.post('/user/:id', (req, res) => {
  const id = req.params.id;
  // console.log("id值为："+id);
  Room.findAll({
    where: {
      zid: id
    },
    include: Agritourism,
  }).then(result => {
    if (result.data !== '') {
      // 使用 map 方法遍历查询结果并将数据添加到新数组中
      let dataArray = result.map(item => {
        // 在这里处理每个元素并返回新值
        return { ...item.dataValues, ...item.agritourism.dataValues };
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

//批量删除
router.post('/delete', async (req, res) => {
  const ids = req.body.ids;
  console.log("值为：" + ids);
  await Room.destroy({
    where: { zid: ids }
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

module.exports = router;
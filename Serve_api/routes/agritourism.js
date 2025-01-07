var express = require('express');
var router = express.Router();
const fs = require('fs');
const { Op } = require('sequelize');
const Agritourism = require('../models/Agritourism')


//根据商家的uid，获取所有数据
router.get('/merchant', async (req, res) => {
  const limit = parseInt(req.query.limit); // 每页记录数
  const offset = parseInt(req.query.offset); // 起始记录位置
  const keyword = req.query.keyword; // 搜索关键词
  const uid = req.query.uid;
  // console.log('uid的值：', uid);
  console.log(keyword);
  const where = keyword
    ? {
      [Op.or]: [
        {
          nname: {
            [Op.like]: `%${keyword}%`,
          },
        },
        {
          naddress: {
            [Op.like]: `%${keyword}%`,
          },
        },
      ],
    }
    : { uid: uid };

  const agritourism = await Agritourism.findAndCountAll({
    where,
    limit,
    offset,
  });
  res.send(agritourism);
})

//根据关键信息，获取所有的信息
router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit); // 每页记录数
  const offset = parseInt(req.query.offset); // 起始记录位置
  const keyword = req.query.keyword; // 搜索关键词

  console.log('关键字：',keyword,'limit:',limit,'offset:',offset);
  const where = keyword
    ? {
      [Op.or]: [
        {
          nname: {
            [Op.like]: `%${keyword}%`,
          },
        },
        {
          naddress: {
            [Op.like]: `%${keyword}%`,
          },
        },
      ],
    }
    : {};

  const agritourism = await Agritourism.findAndCountAll({
    where,
    limit,
    offset,
  });
  res.send(agritourism);
})

//获取所有农家乐信息
router.get('/asPage', async (req, res) => {
  Agritourism.findAll({
    limit: 10
  }).then(result => {
    res.json({
      status: 200,
      msg: '农家乐信息获取成功！',
      data: result
    })

  }).catch(err => {
    res.json({
      status: 201,
      msg: '农家乐信息获取失败！',
      err: err
    })
  })
})

//添加农家乐
router.post('/add', async (req, res) => {
  const { uid, nname, ntype, npic, naddress, nphone, nintroduce } = req.body;
  // console.log(req.body);
  await Agritourism.create({
    uid,
    nname,
    ntype,
    npic,  //存图片地址
    naddress,
    nphone,
    nintroduce
  }).then(result => {
    res.json({
      meta: {
        status: 200,
        msg: '添加成功！',
        data: result
      },

    })
  }).catch(err => {
    res.json({
      meta: {
        status: 201,
        msg: '添加失败！',
        err: err
      },
    })
  });

});

//修改删除图片
router.post('/deleteimg', async (req, res) => {
  // 获取要删除的图片的 URL
  const id = req.body;
  const key = Object.keys(id)[0];
  const intkey = parseInt(key)
  console.log(intkey);
  // 查询数据库，找到对应的图片记录并将其删除
  await Agritourism.update({ npic: null }, {
    where: {
      nid: intkey
    }
  }).then(result => {
    res.json({
      status: 200,
      msg: '移除图片成功',
      data: result
    })
  }).catch(err => {
    res.json({
      status: 201,
      msg: '移除图片失败！',
      err: err
    })
  })
})

//批量删除
router.post('/delete', async (req, res) => {
  const ids = req.body.ids;
  // console.log("值为：" + ids);
  await Agritourism.destroy({
    where: { nid: ids }
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

//根据id获取值
router.post('/user/:id', async (req, res) => {
  const id = req.params.id;
  console.log("id值为：" + id);
  await Agritourism.findAll({
    where: {
      nid: id
    }
  }).then(result => {
    res.json({
      status: 200,
      msg: '数据获取成功',
      data: result
    })
  }).catch(err => {
    res.json({
      status: 201,
      msg: '数据获取失败'
    })
  })
})

//实现修改
router.put('/edit', async (req, res) => {
  const { nid, nname, ntype, npic, naddress, nphone, nintroduce } = req.body;
  console.log(req.body);
  await Agritourism.update({
    nname,
    ntype,
    naddress,
    nphone,
    nintroduce,
    npic
  }, {
    where: { nid: nid }
  }).then(result => {
    res.json({
      meta: {
        status: 200,
        msg: '修改成功！',
        data: result
      },
    })
  }).catch(err => {
    console.log(err);
    res.json({
      meta: {
        status: 201,
        msg: '修改失败！',
        err: err
      },
    })
  });
})


//管理员根据用户uid获取nid和农家乐名称
router.post('/getNname', async (req, res) => {
  await Agritourism.findAll({
    attributes: ['nid', 'nname'],
  }).then(result => {
    res.json({
      status: 200,
      msg: '数据获取成功',
      data: result
    })
  }).catch(err => {
    res.json({
      status: 201,
      msg: '数据获取失败',
      err: err
    })
  })
})

//商家根据用户uid获取nid和农家乐名称
router.post('/getNname/user/:id', async (req, res) => {
  const id = req.params.id;
  console.log('农家乐id：', id);
  await Agritourism.findAll({
    attributes: ['nid', 'nname'],
    where: { uid: id }
  }).then(result => {
    res.json({
      status: 200,
      msg: '数据获取成功',
      data: result
    })
  }).catch(err => {
    res.json({
      status: 201,
      msg: '数据获取失败',
      err: err
    })
  })
})

module.exports = router;
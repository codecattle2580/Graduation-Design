var express = require('express');
var router = express.Router();
const { Op } = require('sequelize');
const Agritourism = require('../models/Agritourism');
const Food = require('../models/Food')

//获取美食的所有数据
router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit); // 每页记录数
  const offset = parseInt(req.query.offset); // 起始记录位置
  const keyword = req.query.keyword; // 搜索关键词
  console.log(keyword);
  const where = keyword
    ? {
      [Op.or]: [
        {
          mname: {
            [Op.like]: `%${keyword}%`,
          },
        },
        {
          mtype: {
            [Op.like]: `%${keyword}%`,
          },
        },
      ],
    }
    : {};
  const food = await Food.findAndCountAll({
    where,
    limit,
    offset,
    include: Agritourism
  });
  // console.log(food);
  //返回rows和count
  const result = {
    rows: food.rows.map(item => {
      return { ...item.dataValues, ...item.agritourism.dataValues };
    }),
    count: food.count
  };
  res.send(result);
})

//根据商家id，获取数据
router.get('/merchant', async (req, res) => {
  const limit = parseInt(req.query.limit); // 每页记录数
  const offset = parseInt(req.query.offset); // 起始记录位置
  const keyword = req.query.keyword; // 搜索关键词
  const uid = req.query.uid;
  console.log(keyword);
  const where = keyword
    ? {
      [Op.or]: [
        {
          mname: {
            [Op.like]: `%${keyword}%`,
          },
        },
        {
          mtype: {
            [Op.like]: `%${keyword}%`,
          },
        },
      ],
    }
    : {};
  const food = await Food.findAndCountAll({
    where,
    limit,
    offset,
    include: [{
      model: Agritourism,
      where: { uid: uid }
    }],
  });
  // console.log(food);
  //返回rows和count
  const result = {
    rows: food.rows.map(item => {
      return { ...item.dataValues, ...item.agritourism.dataValues };
    }),
    count: food.count
  };
  res.send(result);
})

//获取所有10条美食数据
router.get('/asPage', async (req, res) => {
  Food.findAll({
    limit: 10 
  }).then(result => {
    res.json({
      status: 200,
      msg: '美食信息获取成功！',
      data: result
    })

  }).catch(err=>{
    res.json({
      status: 201,
      msg: '美食信息获取失败！',
      err: err
    })
  })
})

//添加美食
router.post('/add', async (req, res) => {
  const { nid, mname, mtype, mpic, mflavour } = req.body;
  console.log(req.body);
  await Food.create({
    nid,
    mname,
    mtype,
    mpic,  //存图片地址
    mflavour,
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

//根据id的值进行查询
router.post('/user/:id', (req, res) => {
  const id = req.params.id;
  console.log("根据id查询，id值为：" + id);
  Food.findAll({
    where: {
      mid: id
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
      msg: '数据获取失败'
    })
  })
})

//批量删除
router.post('/delete', async (req, res) => {
  const ids = req.body.ids;
  // console.log("值为：" + ids);
  await Food.destroy({
    where: { mid: ids }
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

//实现修改
router.put('/edit', async (req, res) => {
  const { mid, nid, mname, mtype, mpic, mflavour } = req.body;
  console.log(req.body);
  await Food.update({
    nid,
    mname,
    mtype,
    mpic,
    mflavour,
  }, {
    where: { mid: mid }
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
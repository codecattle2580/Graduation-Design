var express = require('express');
var router = express.Router();
const User = require('../../models/User')
const Sequelize = require('sequelize')
const Op = require('sequelize').Op
const jwt = require('jsonwebtoken')
const expresJwt = require('express-jwt')
const secretKey = 'ittqb NO1 <^_^>'


//获取所有用户
router.get('/', async (req, res) => {
    const limit = parseInt(req.query.limit); // 每页记录数
    const offset = parseInt(req.query.offset); // 起始记录位置
    const keyword = req.query.keyword; // 搜索关键词
    console.log(keyword);
    const where = keyword
        ? {
            [Op.or]: [
                {
                    uusername: {
                        [Op.like]: `%${keyword}%`,
                    },
                },
            ],
        }
        : {};

    const user = await User.findAndCountAll({
        where,
        limit,
        offset,
    });
    res.send(user);
})


//添加用户
router.post('/add', async (req, res) => {
    const { uusername, upassword, uemail, uphone, state } = req.body;
    // console.log(req.body);
    await User.create({
        uusername,
        upassword,
        uemail,
        uphone,
        state
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


//实现修改
router.put('/edit', async (req, res) => {
    const { uid, uusername, upassword, uemail, uphone, state } = req.body;
    console.log(req.body);
    await User.update({
        uusername,
        upassword,
        uemail,
        uphone,
        state
    }, {
        where: { uid: uid }
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


//批量删除
router.post('/delete', async (req, res) => {
    const ids = req.body.ids;
    // console.log("值为：" + ids);
    await User.destroy({
        where: { uid: ids }
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

// 1   用户登录
router.post('/login', function (req, res, next) {
    //获取客户端提交到服务器中的用户信息
    const userinfo = req.body
    const Strtoken = jwt.sign({ uusername: userinfo.username }, secretKey, { expiresIn: '600s' })

    User.findOne({
        where: {
            [Op.and]: [{
                uusername: { [Op.eq]: userinfo.username }
            }, {
                upassword: { [Op.eq]: userinfo.password }
            },
            {
                state: 1
            }],
        },
        raw: true
    }).then(result => {
        if (result.data !== '') {
            res.json({
                status: 200,
                msg: '成功登录',
                token: Strtoken,//要发送给客户端的 token 字符串
                data: result
            })
        }
    }).catch(err => {
        if (!userinfo.username || !userinfo.password) {
            return res.send({
                status: 201,
                msg: '用户名或密码不合法'
            })
        } else {
            res.json({
                status: 201,
                msg: '登录失败',
            })
        }

    })
});

// 2   商家登录
router.post('/login2', function (req, res, next) {
    //获取客户端提交到服务器中的用户信息
    const userinfo = req.body
    const Strtoken = jwt.sign({ uusername: userinfo.username }, secretKey, { expiresIn: '600s' })

    User.findOne({
        where: {
            [Op.and]: [{
                uusername: { [Op.eq]: userinfo.username }
            }, {
                upassword: { [Op.eq]: userinfo.password }
            },
            {
                state: 2
            }],
        },
        raw: true
    }).then(result => {
        if (result.data !== '') {
            res.json({
                status: 200,
                msg: '成功登录',
                token: Strtoken,//要发送给客户端的 token 字符串
                data: result
            })
        }
    }).catch(err => {
        if (!userinfo.username || !userinfo.password) {
            return res.send({
                status: 201,
                msg: '用户名或密码不合法'
            })
        } else {
            res.json({
                status: 201,
                msg: '登录失败',
            })
        }

    })
});

// 0   管理员登录
router.post('/login0', function (req, res, next) {
    //获取客户端提交到服务器中的用户信息
    const userinfo = req.body
    const Strtoken = jwt.sign({ uusername: userinfo.username }, secretKey, { expiresIn: '600s' })

    User.findOne({
        where: {
            [Op.and]: [{
                uusername: { [Op.eq]: userinfo.username }
            }, {
                upassword: { [Op.eq]: userinfo.password }
            },
            {
                state: 0
            }],
        },
        raw: true
    }).then(result => {
        if (result.data !== '') {
            res.json({
                status: 200,
                msg: '成功登录',
                token: Strtoken,//要发送给客户端的 token 字符串
                data: result
            })
        }
    }).catch(err => {
        if (!userinfo.username || !userinfo.password) {
            return res.send({
                status: 201,
                msg: '用户名或密码不合法'
            })
        } else {
            res.json({
                status: 201,
                msg: '登录失败',
            })
        }

    })
});

//用户注册
router.post('/register', function (req, res) {
    console.log(req.body);
    User.create(req.body).then(result => {
        res.json({
            status: 200,
            msg: '注册成功',
            data: result
        })
    }).catch(err => {
        res.json({
            status: 201,
            msg: '注册失败',
            err: err
        })
    })
})

//根据id获取值
router.post('/users/:id', async (req, res) => {
    const id = req.params.id;
    console.log("id值为：" + id);
    await User.findAll({
        where: {
            uid: id
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
            msg: '数据获取失败',
            err: err
        })
    })
})


//根据id获取用户的信息
router.post('/user', function (req, res) {
    const userid = req.body
    User.findAll({
        where: {
            uid: userid.uid
        }
    }).then(result => {
        if (result.data !== '') {
            res.json({
                meta: {
                    status: 200,
                    msg: '用户信息获取成功',
                },
                data: result
            })
        }
    }).catch(err => {
        res.json({
            status: 201,
            msg: '用户信息获取失败'
        })
    })
});

//用户修改
router.put('/updateUser', function (req, res) {
    const user = req.body
    console.log(user);
    User.findOne({
        where: {
            uid: user.uid
        }
    }).then(User => {
        User.update({
            upassword: user.upassword,
            uphone: user.uphone,
            uemail: user.uemail
        }).then(result => {
            res.json({
                meta: {
                    status: 200,
                    msg: '更新成功',
                },
                data: result
            })
        })
    }).catch(err => {
        res.json({
            status: 201,
            msg: '更新失败',
            err: err
        })
    })
})

//密码的修改
router.post('/user/change', async (req, res) => {
    const test = req.body;
    console.log(test);
    const user = await User.findOne({
        where: {
            uid: test.uid,
            upassword: test.upassword
        }
    })

    if (!user) {
        return res.status(400).json({
            message: '原密码错误'
        });
    }
    
    await user.update({
        upassword: test.newPassword
    })

    return res.json({
        status: 200,
        message: '密码修改成功'
    })



});


module.exports = router;

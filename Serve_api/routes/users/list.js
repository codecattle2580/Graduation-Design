var express = require('express');
var router = express.Router();

// 获取用户列表
router.get('/', function (req, res, next) {
    res.json({
        meta: {
            msg: '获取菜单列表成功',
            status: 200
        },
        data: {
            0: {
                id: 1, navname: '用户管理',
                children: {
                    0: { id: 101, navname: '修改密码', path: 'modify' },
                    1: { id: 102, navname: '个人信息', path: 'user' },
                }
            },
            1: {
                id: 2, navname: '农家乐信息',
                children: {
                    0: { id: 201, navname: '农家乐', path: 'agritainment' },
                }
            },
            2: {
                id: 3, navname: '美食信息',
                children: {
                    0: { id: 301, navname: '美食', path: 'food' },
                }
            },
            3: {
                id: 4, navname: '客房信息',
                children: {
                    0: { id: 401, navname: '客房', path: 'room' },
                }
            },
            4: {
                id: 5, navname: '订单管理',
                children: {
                    0: { id: 501, navname: '订单查询', path: 'order' },
                }
            },
            5: {
                id: 6, navname: '用户留言',
                children: {
                    0: { id: 601, navname: '留言评论', path: 'message' },
                }
            }
        },
    })
});

//商家列表 
router.get('/2', function (req, res, next) {
    res.json({
        meta: {
            msg: '获取菜单列表成功',
            status: 200
        },
        data: {
            0: {
                id: 1, navname: '用户管理',
                children: {
                    0: { id: 101, navname: '修改密码', path: 'modify' },
                    1: { id: 102, navname: '个人信息', path: 'user' },
                }
            },
            1: {
                id: 2, navname: '农家乐管理',
                children: {
                    0: { id: 201, navname: '农家乐', path: 'agritainment1' },
                }
            },
            2: {
                id: 3, navname: '美食管理',
                children: {
                    0: { id: 301, navname: '美食', path: 'food1' },
                }
            },
            3: {
                id: 4, navname: '客房管理',
                children: {
                    0: { id: 401, navname: '客房', path: 'room1' },
                }
            },
            4: {
                id: 5, navname: '订单管理',
                children: {
                    0: { id: 501, navname: '订单查询', path: 'order1' },
                }
            },
            5: {
                id: 6, navname: '用户留言',
                children: {
                    0: { id: 601, navname: '留言评论', path: 'message1' },
                }
            }
        },
    })
});

//管理员列表
router.get('/0', function (req, res, next) {
    res.json({
        meta: {
            msg: '获取菜单列表成功',
            status: 200
        },
        data: {
            0: {
                id: 1, navname: '用户管理',
                children: {
                    0: { id: 101, navname: '修改密码', path: 'modify' },
                    1: { id: 102, navname: '个人信息', path: 'user' },
                    2: { id: 103, navname: '用户信息', path: 'users' }
                }
            },
            1: {
                id: 2, navname: '农家乐管理',
                children: {
                    0: { id: 201, navname: '农家乐', path: 'agritainment0' },
                }
            },
            2: {
                id: 3, navname: '美食管理',
                children: {
                    0: { id: 301, navname: '美食', path: 'food0' },
                }
            },
            3: {
                id: 4, navname: '客房管理',
                children: {
                    0: { id: 401, navname: '客房', path: 'room0' },
                }
            },
            4: {
                id: 5, navname: '订单管理',
                children: {
                    0: { id: 501, navname: '订单查询', path: 'order0' },
                }
            },
            5: {
                id: 6, navname: '用户留言',
                children: {
                    0: { id: 601, navname: '留言评论', path: 'message0' },
                }
            }
        },
    })
});
module.exports = router;

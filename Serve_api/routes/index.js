var express = require('express');
var router = express.Router();
const Agritourism = require('../models/Agritourism')

/* GET home page. */
router.get('/', function(req, res, next) {
   res.json({
    status:200,
    msg:'首页'
   })
});



module.exports = router;

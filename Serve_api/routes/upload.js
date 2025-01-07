var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs')

// 配置 multer 来存储上传的文件
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.get('/uploads/:name', express.static('uploads'));

router.post('/', upload.array('file'), (req, res) => {
  try {
    const files = req.files;
    console.log(files);
    // TODO: 验证上传的文件

    // 获取图片 URL
    const urls = files.map(file => `/uploads/${file.filename}`);
    console.log(urls);
    res.json({
      meta: {
        status: 200,
        msg: '上传成功！',
        url: urls
      }
    })

  } catch (err) {
    res.json({
      meta: {
        status: 200,
        msg: '上传失败！',
        err: err
      }
    })
  }
});

router.delete('/delete/:name', (req, res) => {
  try {
    const fileName = req.params.name;
    console.log(fileName);
    const filePath = path.join(__dirname, '../uploads', fileName);
    console.log(filePath);
    fs.unlink(filePath, (err) => {
      if (err) {
        // 处理错误
        res.json({
          meta: {
            status: 500,
            msg: '删除失败！',
            err: err
          }
        })
      } else {
        // 文件删除成功
        res.json({
          meta: {
            status: 200,
            msg: '删除成功！'
          }
        })
      }
    })
  } catch (err) {
    res.json({
      meta: {
        status: 500,
        msg: '删除失败！',
        err: err
      }
    })
  }
});



module.exports = router;
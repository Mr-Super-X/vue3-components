const express = require('express')
const multer = require('multer')
const cors = require('cors')

const path = require('path')

const app = express()

// 存储上传文件的目录
const uploadDir = path.join(__dirname, 'uploads')

// 使用multer中间件处理文件上传
const upload = multer({ dest: uploadDir })

// 使用cors中间件允许跨域
app.use(cors())

// 处理post请求上传
app.post('/upload', upload.single('file'), (req, res) => {
  // req.file包含上传的文件信息
  if (!req.file) {
    return res.status(400).send('No files were uploaded')
  }

  // 返回上传成功信息
  res.send({
    message: 'File uploaded successfully!',
    filename: req.file.originalname,
    size: req.file.size,
    path: `/uploads/${req.file.filename}`,
  })
})

// 启动服务器，监听4000端口
app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000')
})

require('dotenv').config(); // 读取环境变量
const express = require('express');
const cors = require('cors');
const app = express();

// 1. 正确的CORS配置（删除多余的app.use(cors())）
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5500', // 默认开发环境
];
// 替换为你的域名

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('请求被拒绝'));
    }
  }
}));

// 2. 使用环境变量中的API Key
const API_KEY = process.env.QWEN_API_KEY;

app.use(express.json()); // 必须保留此行

app.post('/api/qwen', async (req, res) => {
  try {
    const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`, // 从环境变量读取
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        input: req.body.input
      })
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'API请求失败' });
  }
});

// 3. 错误处理中间件（新增）
app.use((err, req, res, next) => {
  if (err.message === '请求被拒绝') {
    return res.status(403).json({ error: '请求来源不被允许' });
  }
  res.status(500).json({ error: '服务器内部错误' });
});

app.listen(3000, () => console.log('代理服务器运行在 http://localhost:3000'));

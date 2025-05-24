/**
 * 简单的模拟后端服务器，用于测试登录功能
 * 运行方式：node mock-server.cjs
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your-secret-key';

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 模拟用户数据
const users = [
  {
    id: 1,
    username: 'admin',
    password: 'password123',
    email: 'admin@example.com',
    roles: ['USER', 'ADMIN']
  },
  {
    id: 2,
    username: 'user',
    password: 'password123',
    email: 'user@example.com',
    roles: ['USER']
  }
];

// 验证令牌中间件
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: '未提供认证令牌' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: '令牌无效或已过期' });
    }
    
    req.user = user;
    next();
  });
}

// 登录路由
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  // 查找用户
  const user = users.find(u => u.username === username);
  
  if (!user || user.password !== password) {
    return res.status(401).json({ message: '用户名或密码不正确' });
  }
  
  // 创建令牌
  const token = jwt.sign(
    { id: user.id, username: user.username, roles: user.roles },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  // 返回用户信息（不包含密码）和令牌
  const { password: _, ...userWithoutPassword } = user;
  
  res.json({
    user: userWithoutPassword,
    token
  });
});

// 获取当前用户信息
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  
  if (!user) {
    return res.status(404).json({ message: '用户不存在' });
  }
  
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// 受保护的路由示例
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: '这是受保护的数据', user: req.user });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`模拟服务器运行在 http://localhost:${PORT}`);
});
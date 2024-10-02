const express = require('express');
// const admin = require('firebase-admin');
const axios = require('axios');
const querystring = require('querystring');
const path = require('path');
const { Pool } = require('pg');
const port = process.env.PORT || 3000;  // 使用 Heroku 提供的 PORT 环境变量
const session = require('express-session');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
// 初始化 session 中間件
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // 如果是 HTTPS，設為 true
}));
// Path to your service account key JSON file
// const serviceAccount = require('./config/serviceAccountKey.json');

// Initialize Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://test-373e5.firebaseio.com" // Replace with your database URL
// });
// const db = admin.database();
// PostgreSQL database connection
const pool = new Pool({
  user: 'uaeb82e6is2sus',
  host: 'ec2-35-169-98-228.compute-1.amazonaws.com',
  database: 'd2vk99krc82blt',
  password: 'p2309a9479355793bfada794ca6d8c67fbd6aeb6e8f3dbbacdaae6182c0e70a88',
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

// 生成随机的 identifier（与之前一致）
function generateIdentifier() {
  const digits = Math.floor(1000 + Math.random() * 9000).toString(); // 生成4位数字
  const letters = Array.from({ length: 4 }, () => 
      String.fromCharCode(65 + Math.floor(Math.random() * 26)) // 生成4位大写字母
  ).join('');
  const identifierArray = (digits + letters).split('');
  const shuffledIdentifier = identifierArray.sort(() => Math.random() - 0.5).join('');
  return shuffledIdentifier;
}
async function generateUniqueIdentifier(client) {
  let result = ""; // 初始值为空
  while (result === "") {
      const identifier = generateIdentifier(); // 生成新的 identifier
      const check = await client.query('SELECT * FROM users WHERE identifier = $1', [identifier]); // 检查是否重复
      if (check.rows.length === 0) {
          result = identifier; // 找到唯一的 identifier
      }
  }
  return result; // 返回唯一的 identifier
}
// 提供 public 文件夹中的静态文件
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
// 登录页面路由
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
// 處理前端發來的 POST 請求，將用戶資料存儲到 session
app.post('/save-to-session', (req, res) => {
  const { birthday, position1,position2 } = req.body;
  // 保存用戶資料到 session 中
  req.session.user = { birthday, position1,position2 };
  res.json({ message: 200 });
  // res.redirect('/line_login');
});
// LINE credentials
const CHANNEL_ID = '1661291645';
const CHANNEL_SECRET = '3d1df453deb161a633a2166417b944f8';
const REDIRECT_URI = "https://my-express-app-f63887bafc0f.herokuapp.com/login_data";
app.get('/line_login', (req, res) => {
  const client_id = "1661291645";
  const response_type = "code";
  const redirect_uri = "https://my-express-app-f63887bafc0f.herokuapp.com/login_data";
  const state = generateState();
  const LineLoginUrl = `https://access.line.me/oauth2/v2.1/authorize?scope=profile%20openid&client_id=${client_id}&response_type=${response_type}&redirect_uri=${redirect_uri}&state=${state}`;
  res.redirect(LineLoginUrl);

});
// // Route to handle Line OAuth callback
app.get('/login_data', async (req, res) => {
  const { code } = req.query;

  if (code) {
      try {
        const response = await axios.post('https://api.line.me/oauth2/v2.1/token', querystring.stringify({
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
          client_id: CHANNEL_ID,
          client_secret: CHANNEL_SECRET,
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
    
        const { access_token } = response.data;
    
        // Use the access token to get user profile
        const profileResponse = await axios.get('https://api.line.me/v2/profile', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
    

          // const userInfo = await userResponse.json();
          const profileData = profileResponse.data;

          const userId = profileData.userId;
          const displayName = profileData.displayName;
          console.log(userId)
          console.log(displayName)  
          const client = await pool.connect(); // 获取数据库连接

          try {

            const result = await client.query('SELECT * FROM users WHERE userID = $1', [userId]);
    
            if (result.rows.length > 0) {
              // User exists, redirect to homepage
              const user = result.rows[0]; // 取出第一条记录
              const displayName = user.displayName; // 读取 username 列
              const identifier = user.identifier; // 读取 email 列
              const birthday = user.birthday; // 读取 email 列
              const position1 = user.preferred_position1; // 读取 email 列
              const position2 = user.preferred_position2; // 读取 email 列
              const level = user.level; 
              req.session.user = { displayName, identifier,birthday,position1,position2,level };

              res.redirect('/');
            } else {
              const identifier = await generateUniqueIdentifier(client); // 生成唯一的 identifier
              const userSession = req.session.user;
              const { birthday, position1, position2} = userSession;
              // Insert new user into PostgreSQL database
              await client.query(
                'INSERT INTO users (username, userid, identifier,birthday,preferred_position1,preferred_position2) VALUES ($1, $2,$3,$4,$5,$6)',
                [displayName, userId,identifier,birthday,position1,position2]
              );
              res.redirect('/');
            }
          } finally {
            client.release();
          }
    
          // Check if user exists and add to Firebase if not
          // const userRef = db.ref('/user/login/');
          //         // db.ref('/user/login/').orderByChild('userID').equalTo(userId).once('value', function(snapshot) {

          // const snapshot = await userRef.orderByChild('userID').equalTo(userId).once('value');

          // if (snapshot.exists()) {
          //     // res.send("User exists");
          //     res.redirect('/');
          // } else {
          //     await userRef.push({
          //         username: displayName,
          //         userID: userId,
          //         tag: 0,
          //         Appearances: 0,
          //         Absences: 0,
          //         Unpaid: 0,
          //         Assists: 0,
          //         Goals: 0,
          //         level: 3
          //     });
          //     res.redirect('/');
          // }
      } catch (error) {
          console.error('Error:', error);
          res.status(500).send('An error occurred');
      }
  } else {
      res.status(400).send('No authorization code found');
  }
});

function generateState() {
  return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
}
const NewGuid = function () {
    return (g() + g() + "-" + g() + "-" + g() + "-" + g() + "-" + g() + g() + g());
}

app.post('/user_data', (req, res) => {
  // const { birthday, position1,position2 } = req.body;
  // 保存用戶資料到 session 中

  const userSession = req.session.user;
  const { birthday, position1, position2} = userSession;
  req.session.user = { displayName,identifier,birthday, position1,position2,level };

  if (req.session.user) {
    // 返回包含用戶資料的 JSON 響應
    res.json({ 
      message: 'User data saved successfully', 
      status: 200, 
      user: req.session.user // 返回 session 中的用戶資料
    });
  } else {
    // 返回錯誤響應
    res.status(500).json({ 
      message: 'Failed to save user data', 
      status: 500 
    });
  }
  // res.redirect('/line_login');
});
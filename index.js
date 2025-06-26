const express = require('express');
// const admin = require('firebase-admin');
const axios = require('axios');
const querystring = require('querystring');
const path = require('path');
const { Pool } = require('pg');
const port = process.env.PORT || 3000;  // 使用 Heroku 提供的 PORT 环境变量
const session = require('express-session');
const cors = require('cors');
const mysql = require('mysql2');
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
  user: 'neondb_owner',
  host: 'ep-damp-rain-a85ghmem-pooler.eastus2.azure.neon.tech',
  database: 'neondb',
  password: 'npg_BORmjcDE8l1P',
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});
const connection = mysql.createConnection({
  host: 'dzl.9a1.mytemp.website', // 通常 GoDaddy 提供的，不是 localhost
  user: 'football',
  password: '@Aa0918625729',
  database: 'football'
});

// 生成随机的 identifier（与之前一致）
function generateIdentifier() {
  const digits = Math.floor(1000 + Math.random() * 9000).toString();
  const letters = Array.from({ length: 4 }, () => 
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
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
// 設置 EJS 為視圖引擎
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// 提供靜態文件，如 CSS, JS
app.use(express.static('public'));
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
// 路由處理
app.get('/', (req, res) => {
  res.render('index', { pageTitle: 'Home Page' });
});
app.get('/event', (req, res) => {
  res.render('event', { pageTitle: 'event LIST' });
});
app.get('/event_content', (req, res) => {
  res.render('event_content', { pageTitle: 'event Page' });
});

app.get('/SignIn', (req, res) => {
  res.render('SignIn', { pageTitle: 'SignIn' });
});

// 登录页面路由
app.get('/login', (req, res) => {
  res.render('login', { pageTitle: 'Login Page' });
});
app.get('/sign', (req, res) => {
  res.render('sign', { pageTitle: 'sign Page' });
});
app.get('/add_event', (req, res) => {
  res.render('add_event', { pageTitle: 'add_event Page' });
});


const { handleActivitySubmission } = require('./add_activity');
// multer 可以解析 multipart/form-data 类型的 HTTP 请求，提取其中的文件和字段。
const multer = require('multer'); // For handling FormData
const { Console } = require('console');
const upload = multer();



// 设置 POST 路由
app.post('/submit_event', upload.none(), handleActivitySubmission);
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
const REDIRECT_URI = "https://dzl.9a1.mytemp.website/my-express-app/login_data";
app.get('/line_login', (req, res) => {
  const client_id = "1661291645";
  const response_type = "code";
  const redirect_uri ="https://dzl.9a1.mytemp.website/my-express-app/login_data";
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
          connection.connect((err) => {
            if (err) {
              res.status(500).send('An error occurred');
              
            }
            // res.status(299).send('An error occurred');
            // res.redirect('./');
          });
          // const client = await pool.connect(); // 获取数据库连接

          // try {

          //   const result = await client.query('SELECT * FROM users WHERE userID = $1', [userId]);
    
          //   if (result.rows.length > 0) {
          //     // User exists, redirect to homepage
          //     const user = result.rows[0]; // 取出第一条记录
          //     const displayName = user.displayName; // 读取 username 列
          //     const identifier = user.identifier; // 读取 email 列
          //     const birthday = user.birthday; // 读取 email 列
          //     const position1 = user.preferred_position1; // 读取 email 列
          //     const position2 = user.preferred_position2; // 读取 email 列
          //     const level = user.level; 
          //     req.session.user = { displayName, identifier,birthday,position1,position2,level };

          //     res.redirect('/');
          //   } else {
          //     const identifier = await generateUniqueIdentifier(client); // 生成唯一的 identifier
          //     const userSession = req.session.user;
          //     const { birthday, position1, position2} = userSession;
          //     // Insert new user into PostgreSQL database
          //     await client.query(
          //       'INSERT INTO users (username, userid, identifier,birthday,preferred_position1,preferred_position2) VALUES ($1, $2,$3,$4,$5,$6)',
          //       [displayName, userId,identifier,birthday,position1,position2]
          //     );
          //     res.redirect('/');
          //   }
          // } finally {
          //   client.release();
          // }
    
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
    req.session.user = {
      displayName: 'Test User',
      identifier: '1234567890',
      birthday: '1990-01-01',
      position1: 'Forward',
      position2: 'Midfield',
      // 新手
      level: 3
  };
  const userSession = req.session.user;

  if (!userSession) {
      // 如果 session 中沒有 user，返回錯誤響應
      return res.status(400).json({ 
          message: 'User session not found', 
          status: 400 
      });
  }

  // 如果 session 存在，才進行解構
  const { birthday, position1, position2 } = userSession;

  const displayName = userSession.displayName;
  const identifier = userSession.identifier;
  const level = userSession.level;

  req.session.user = { displayName, identifier, birthday: userSession.birthday, position1: userSession.position1, position2: userSession.position2, level };


  // 更新 session 中的用戶資料
  req.session.user = { displayName, identifier, birthday, position1, position2, level };

  // 返回成功響應
  res.json({
      message: 'User data saved successfully',
      status: 200,
      user: req.session.user
  });
  // res.redirect('/line_login');
});

// 定義 API 路由來查詢活動內容
app.get('/api/event_content', async (req, res) => {
  const listId = req.query.list_id; // 從查詢參數中取得 list_id

  if (!listId || isNaN(listId)) {
    return res.status(400).send('無效的 list_id 參數');
  }

  try {
    // 獲取數據庫連接並查詢資料
    const client = await pool.connect();
    const query = 'SELECT * FROM activities WHERE id = $1';
    const result = await client.query(query, [listId]);
    const registrationQuery = `
    SELECT * 
    FROM registrations 
    WHERE activity_id = $1 
    ORDER BY id ASC
    `;
    const registrationResult = await client.query(registrationQuery, [listId]);

    // 釋放連接
    client.release();

    if (result.rows.length === 0) {
      res.status(404).send('找不到對應的活動');
    } else {
        


      // 返回活動與註冊資訊
      res.json({
        event: result.rows[0], // 單一活動內容
        registrations: registrationResult.rows, // 該活動的註冊資訊
      });
    }
  } catch (err) {
    console.error('資料庫查詢失敗:', err);
    res.status(500).send('資料庫查詢錯誤');
  }
});
// 定義 API 路由來查詢活動內容
app.post('/api/event', async (req, res) => {

  try {
    // 獲取數據庫連接並查詢資料
    const client = await pool.connect();
    const query = 'SELECT * FROM activities ORDER BY time ASC;';
    const result = await client.query(query);

    // 釋放連接
    client.release();

    if (result.rows.length === 0) {
      res.status(404).send('找不到對應的活動');
    } else {
      res.json(result.rows); // 返回 JSON 格式的查詢結果
    }
  } catch (err) {
    console.error('資料庫查詢失敗:', err);
    res.status(500).send('資料庫查詢錯誤');
  }
});
app.post('/insert-event', async (req, res) => {
  const userSession = req.session.user;

  // 检查用户会话是否存在
  if (!userSession) {
      return res.status(400).json({ 
          message: 'User session not found', 
          status: 400 
      });
  }

  // 从会话中获取数据
  const { displayName, identifier, level } = userSession;

  // 从前端获取其他插入数据
  const { status_add,activityId,} = req.body;

    // 建立連線

    // SQL 插入語句
    // const query = `
    //     INSERT INTO registrations (activity_id, participant_name, status_add, identifier)
    //     VALUES ($1, $2, $3, $4)
    //     RETURNING id;
    // `;

    // 執行插入，傳遞參數避免 SQL 注入
    // const values = [activityId, displayName, status_add, identifier];

    let client;


    try {
      const client = await pool.connect();
      // Step 1: Get max_participants from activities table
      const activityResult = await client.query(
        `SELECT max_participants FROM public.activities WHERE id = $1`,
        [activityId]
      );
  
      if (activityResult.rows.length === 0) {
        throw new Error('Activity not found');
      }
      const maxParticipants = activityResult.rows[0].max_participants;
      // ------------------------------------------------------------------
      const countStatusAdd = await client.query(
        `SELECT COUNT(*) AS count FROM public.registrations WHERE activity_id = $1 AND status_add = '1'`,
        [activityId]
      );
      const currentStatusAdd = parseInt(countStatusAdd.rows[0].count, 10);
      // --------------------------------------------------------------
      // Step 2: Count registrations with status_add = 1 for the given activity
      const countResult = await client.query(
        `SELECT COUNT(*) AS count FROM public.registrations WHERE activity_id = $1 AND identifier = $2`,
        [activityId,identifier]
      );
      const currentParticipants = parseInt(countResult.rows[0].count, 10);
      console.log(currentParticipants)
    // Step 3: Check if currentParticipants <= maxParticipants

      if (currentParticipants > 0) {
        // Step 5a: Update the existing record
        await client.query(
          `UPDATE public.registrations
            SET status_add = $1
            WHERE activity_id = $2 AND identifier = $3`,
          [status_add, activityId, identifier]
        );
        console.log('Updated registration');
      } else {
        // Step 5b: Insert a new record
        await client.query(
          `INSERT INTO public.registrations (activity_id, identifier, status_add)
            VALUES ($1, $2, $3)`,
          [activityId, identifier, status_add]
        );
        console.log('Inserted new registration');
      }
      
      res.status(200).json({ status: 200 });
    } catch (err) {
        console.error('資料庫插入失敗:', err);
        res.status(500).json({ status: 500, message: '資料庫插入錯誤' });
    } finally {
      
        if (client) client.release();
    }


});
app.post('/delete-event', async (req, res) => {
  const userSession = req.session.user;

  // 检查用户会话是否存在
  if (!userSession) {
      return res.status(400).json({ 
          message: 'User session not found', 
          status: 400 
      });
  }

  // 从会话中获取数据
  const { displayName, identifier, level } = userSession;

  // 从前端获取其他插入数据
  const { status_add,activityId,} = req.body;

    // 建立連線

    // SQL 插入語句
    // const query = `
    //     INSERT INTO registrations (activity_id, participant_name, status_add, identifier)
    //     VALUES ($1, $2, $3, $4)
    //     RETURNING id;
    // `;

    // 執行插入，傳遞參數避免 SQL 注入
    // const values = [activityId, displayName, status_add, identifier];

    let client;


    try {
      const client = await pool.connect();
 
      // ------------------------------------------------------------------

      // --------------------------------------------------------------
      // Step 2: Count registrations with status_add = 1 for the given activity
      const countResult = await client.query(
        `SELECT COUNT(*) AS count FROM public.registrations WHERE activity_id = $1 AND identifier = $2`,
        [activityId,identifier]
      );
      const currentParticipants = parseInt(countResult.rows[0].count, 10);
      console.log(currentParticipants)
    // Step 3: Check if currentParticipants <= maxParticipants

      if (currentParticipants > 0) {
        // Step 5a: Update the existing record
        await client.query(
          `UPDATE public.registrations
            SET status_add = $1
            WHERE activity_id = $2 AND identifier = $3`,
          [status_add, activityId, identifier]
        );
        console.log('Updated registration');
      } else {
        // Step 5b: Insert a new record
        await client.query(
          `INSERT INTO public.registrations (activity_id, identifier, status_add)
            VALUES ($1, $2, $3)`,
          [activityId, identifier, status_add]
        );
        console.log('Inserted new registration');
      }
      
      res.status(200).json({ status: 200 });
    } catch (err) {
        console.error('資料庫插入失敗:', err);
        res.status(500).json({ status: 500, message: '資料庫插入錯誤' });
    } finally {
      
        if (client) client.release();
    }


});
app.post('/Update_SignIn', async (req, res) => {
  const userSession = req.session.user;

  // Check if the user session exists
  if (!userSession) {
    return res.status(400).json({
      message: 'User session not found',
      status: 400,
    });
  }

  // Extract data from the request body
  const { jsonData, activityId } = req.body;
  const results = [];

  // Establish a database connection
  const client = await pool.connect();

  try {
    // Iterate through the provided JSON data and perform updates
    for (const item of jsonData) {
      let query = '';
      let Change_checked;

      const { checked, value, class: className } = item;

      if (className === 'SignIn') {
        query = `
        UPDATE registrations
        SET 
            check_in = $1
        WHERE 
            activity_id = $2 AND identifier = $3
        `;
        Change_checked = checked ? 1 : 0;
      } else if (className === 'SignOut') {
        query = `
        UPDATE registrations
        SET 
            check_out = $1
        WHERE 
            activity_id = $2 AND identifier = $3
        `;
        Change_checked = checked ? 1 : 0;
      } else if (className === 'SignFree') {
        query = `
        UPDATE registrations
        SET 
            payment_status = $1
        WHERE 
            activity_id = $2 AND identifier = $3
        `;
        Change_checked = checked ? true : false;
      }

      const values = [Change_checked, activityId, value];
      console.log(values);

      try {
        await client.query(query, values);
        results.push({ status: 200 });
      } catch (err) {
        console.error('Database query failed:', err);
        results.push({ status: 500, error: 'Database query failed' });
      }
    }

    // Once all updates are done, send a single response
    res.status(200).json({ status: 200, results });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ status: 500, message: 'Unexpected server error' });
  } finally {
    // Ensure the client is always released back to the pool
    client.release();
  }
});

// 定義 API 路由來查詢活動內容
app.post('/api/list_content', async (req, res) => {
  console.log(111)
  try {
    // 獲取數據庫連接並查詢資料
    const client = await pool.connect();
    const query = 'SELECT * FROM users ORDER BY id ASC;';
    const result = await client.query(query);

    // 釋放連接
    client.release();

    if (result.rows.length === 0) {
      res.status(404).send('找不到對應的活動');
    } else {
      console.log(result.rows)
      res.json(result.rows); // 返回 JSON 格式的查詢結果
    }
  } catch (err) {
    console.error('資料庫查詢失敗:', err);
    res.status(500).send('資料庫查詢錯誤');
  }
});


//會員網頁
app.get('/ListMember', (req, res) => {
  res.render('ListMember', { pageTitle: 'ListMember' });
});
//會員清單

//會員編輯


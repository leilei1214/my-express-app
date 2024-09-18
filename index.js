const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
const port = process.env.PORT || 3000;  // 使用 Heroku 提供的 PORT 环境变量

const app = express();

// Path to your service account key JSON file
// const serviceAccount = require('./config/serviceAccountKey.json');

// Initialize Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://test-373e5.firebaseio.com" // Replace with your database URL
// });

// 提供 public 文件夹中的静态文件
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
// 登录页面路由
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.get('/login_data', (req, res) => {
  const client_id = "1661291645";
  const response_type = "code";
  const redirect_uri = "https://my-express-app-f63887bafc0f.herokuapp.com/login_data";
  const state = generateState();
  const LineLoginUrl = `https://access.line.me/oauth2/v2.1/authorize?scope=profile%20openid&client_id=${client_id}&response_type=${response_type}&redirect_uri=${redirect_uri}&state=${state}`;
  res.redirect(LineLoginUrl);
});
// // Route to handle Line OAuth callback
// app.get('/login_data', async (req, res) => {
//   const { code } = req.query;

//   if (code) {
//       try {
//           const tokenResponse = await fetch('https://api.line.me/oauth2/v2.1/token', {
//               method: 'POST',
//               headers: {
//                   'Content-Type': 'application/x-www-form-urlencoded',
//               },
//               body: new URLSearchParams({
//                   'grant_type': 'authorization_code',
//                   'code': code,
//                   'redirect_uri': "https://my-express-app-f63887bafc0f.herokuapp.com/login_data",
//                   'client_id': '1661291645',
//                   'client_secret': '3d1df453deb161a633a2166417b944f8',
//               })
//           });

//           const tokenData = await tokenResponse.json();
//           const accessToken = tokenData.access_token;

//           const userResponse = await fetch('https://api.line.me/v2/profile', {
//               headers: {
//                   'Authorization': `Bearer ${accessToken}`
//               }
//           });

//           const userInfo = await userResponse.json();
//           const userId = userInfo.userId;
//           const displayName = userInfo.displayName;

//           // Check if user exists and add to Firebase if not
//           const userRef = db.ref('/user/login/');
//           const snapshot = await userRef.orderByChild('userID').equalTo(userId).once('value');

//           if (snapshot.exists()) {
//               res.send("User exists");
//           } else {
//               await userRef.push({
//                   username: displayName,
//                   userID: userId,
//                   tag: 0,
//                   Appearances: 0,
//                   Absences: 0,
//                   Unpaid: 0,
//                   Assists: 0,
//                   Goals: 0,
//                   level: 3
//               });
//               res.send("User added successfully");
//           }
//       } catch (error) {
//           console.error('Error:', error);
//           res.status(500).send('An error occurred');
//       }
//   } else {
//       res.status(400).send('No authorization code found');
//   }
// });
function generateState() {
  return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
}
const NewGuid = function () {
    return (g() + g() + "-" + g() + "-" + g() + "-" + g() + "-" + g() + g() + g());
}
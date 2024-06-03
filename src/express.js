const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',  // 허용할 출처
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // 허용할 HTTP 메서드
  allowedHeaders: ['Content-Type', 'Authorization']  // 허용할 헤더
}));
app.use(bodyParser.json());

// Preflight 요청 처리
app.options('*', cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.post('/api/accounts/signup/', (req, res) => {
    const { username, password, email, nickname, gender, birth } = req.body;
    // 계정 생성 로직 (예: 데이터베이스에 저장)
    res.status(201).json({ message: 'Account created successfully' });
});

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // 모든 출처 허용
  // 또는 특정 출처만 허용하려면, 아래와 같이 설정
  // res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  next();
});

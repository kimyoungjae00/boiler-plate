const express = require('express')
const app = express()
const port = 5000
const cors = require('cors');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('./config/key');

const { User } = require("./models/User");
const { auth } = require("./middleware/auth");

const mongoose = require('mongoose');
//application/x-www-form-urlencoded 을 분석
app.use(express.urlencoded({extended: true}))
//application/json타입을 분석
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  credentials: true,
}))

mongoose.connect(config.mongoURI, { //연결
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false //안쓰면 오류남
}).then(()=> console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World! ogogogo')
})

app.get('/api/hello', (req, res) => res.send('Hello World!~~~'))

app.post('/api/users/register', async (req, res) => {
  //회원 가입 할때 필요한 정보들을 client에서 가져오면 그것들을 DB에 넣어준다.
  //body-parser에 의해 클라이언트에서 보내는 정보를 req.body를 받을 수 있다.
  const user = new User(req.body);

  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash;

  user.save((err, userInfo) => {
    if(err) { return res.json({success: false, err}) }
    return res.status(200).json({
      success: true
    })
  });
})

app.post('/api/users/login', async (req, res) =>{
  //요청된 이메일이 DB에 있는지 찾는다.
  const user = await User.findOne({ email: req.body.email });
  console.log(user);
  if(user){
    const result = await bcrypt.compare(req.body.password, user.password);
    if(result) {
      const token = jwt.sign(user._id.toHexString(), 'secretToken');
      user.token = token;
      user.save((err, user) => {
        if(err) { return res.status(400).send(err)}
        return res.cookie("x_auth", user.token)
                  .status(200)
                  .json({loginSuccess: true, userId: user._id});
      })
    } else {
      return res.json({
        loginSuccess: false,
        message : "비밀번호가 틀렸습니다."
      })
    }
  } else {
    return res.json({
      loginSuccess: false,
      message: "해당 유저가 존재하지 않습니다."
    })
  }
})

app.get('/api/users/auth', auth, (req, res) => {
  //여기까지 미들웨어를 통과했다면, Auth가 True라는 것이다.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name
  })
})

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({_id: req.user._id},
    { token: "" },
    (err, user) => {
      if(err) return res.json({success: false, err});
      return res.status(200).send({success: true})
    })
})

app.listen(port, ()=> {
  console.log(`Example app listening on port ${port}!`)
})
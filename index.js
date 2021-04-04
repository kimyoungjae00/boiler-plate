const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');

const config = require('./config/key');

const { User } = require("./models/User");

//application/x-www-form-urlencoded 을 분석
app.use(express.urlencoded({extended: true}))
//application/json타입을 분석
app.use(express.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, { //연결
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false //안쓰면 오류남
}).then(()=> console.log('MongoDB Connected...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World! hehe')
})

app.post('/register', (req, res) => {
  //회원 가입 할때 필요한 정보들을 client에서 가져오면 그것들을 DB에 넣어준다.
  //body-parser에 의해 클라이언트에서 보내는 정보를 req.body를 받을 수 있다.
  const user = new User(req.body)

  user.save((err, userInfo) => {
    if(err) return res.json({success: false, err})
    return res.status(200).json({
      success: true
    })
  });
})

app.listen(port, ()=> {
  console.log(`Example app listening on port ${port}!`)
})
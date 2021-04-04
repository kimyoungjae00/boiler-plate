const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://KYJ:5313254@boilerplate.p6mh0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { //연결
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false //안쓰면 오류남
}).then(()=> console.log('MongoDB Connected...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, ()=> {
  console.log(`Example app listening on port ${port}!`)
})
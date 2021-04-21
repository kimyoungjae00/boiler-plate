const { User } = require("../models/User");
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {  //인증 처리를 받는곳
  //클라이언트 쿠키에서 토큰을 가져온다.
  const token = req.cookies.x_auth;
  //토큰을 디코딩 한후 유저를 찾는다.
  jwt.verify(token, 'secretToken', async (err, decoded) => {
    //유저 아이디를 이용해서 유저를 찾은 후, 클라이언트에서 가져온 토큰과 DB에 보관된 토큰이 일치하는지 확인한다.
    const user = await User.findOne({ _id: decoded, token: token });
      //유저가 있으면 인증 완료, 유저가 없으면 인증 실패
    if(err) throw err;
    if(!user) { return res.json({ isAuth: false, err: true })}
    
    req.token = token;
    req.user = user;
    next();
  })

}

module.exports = {auth}
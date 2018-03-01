// let jwt = require('jsonwebtoken');
//
// let token = jwt.sign( {user: "pims"}, 'pims_resurrected', { expiresIn: '1h' });
//
// console.log(token)
// var decoded = jwt.verify("e1JhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoicGltcyIsImlhdCI6MTUwOTM4MTAxNywiZXhwIjoxNTA5Mzg0NjE3fQ.2a3WXKChC5gysggFKbqHyKWhDlz4SIjaCfj5-q5fRcI", 'pims_resurrected');
// console.log(decoded.user) // bar

let dateFormat = require('dateformat');
let  now = new Date(1519838444258);
let str  = dateFormat(now, "yyyy-MM-dd HH:mm:ss");
console.log(str)
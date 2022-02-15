import jwt from 'jsonwebtoken';

const token = jwt.sign({_id:"id1"},"secret");
console.log(token)
const isValid = jwt.verify(token,'secret');
console.log(isValid)
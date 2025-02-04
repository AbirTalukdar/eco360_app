import { sign, verify } from 'jsonwebtoken';
require('dotenv').config();

export function generateToken(payload) {
  return sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

export function verifyToken(token) {
  return verify(token, process.env.JWT_SECRET);
}

import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dbHelper from './db_Helper';

dotenv.config();

const { AUTH_SECRET: secret, JWT_LIFE } = process.env;
const { removeDataToHide } = dbHelper;

class General {
  static generateToken(payload) {
    return jwt.sign(payload, secret, { expiresIn: JWT_LIFE });
  }


  static verifyToken(token) {
    return jwt.verify(token, secret);
  }


  static hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    return hash;
  }


  static removeUnexpect(expect_input, inputData) {
    const input_keys = Object.keys(inputData);
    const filtered_input = {};

    input_keys.forEach((key)=> {
      if (expect_input.includes(key)) {
        filtered_input[key] = inputData[key];
      }
    });
    return filtered_input;
  }


  static response(res, status, msg, data = {}, dataToRemove) {
    if (status === 200 || status === 201) {
      if (dataToRemove) { removeDataToHide(data, dataToRemove); }
      return res.status(status).json({
        status,
        message: msg,
        data,
      });
    }


    return res.status(status).json({
      status,
      error: msg,
    });
  }


}

export default General;

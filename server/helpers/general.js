
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
dotenv.config();
// eslint-disable-next-line no-undef
const {AUTH_SECRET:secret,JWT_LIFE}=process.env;

class General{
  /**
     * @description Generate the access token
     * @param {object} payload - The user credential {id, username, email}
     * @return {string} access token
     */
  static generateToken(payload) {
    return jwt.sign(payload, secret, { expiresIn:JWT_LIFE});
  }

  /**
     *
     *@description Verifies token
    * @param { string } token
    * @returns{ object } user details
    */
  static verifyToken(token) {
    return jwt.verify(token, secret);
  }

  
  static hashPassword(password){
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }

  /**
     *
     *@description remove unexpected properties from input data
    * @param { array } expect_input
    * @param { object } inputData, 
    * @returns{ object } input data with expected data
    */

  static removeUnexpect(expect_input,inputData){
    const input_keys=Object.keys(inputData);
    //removing unexpected input
    input_keys.forEach((key)=>{
      if(!expect_input.includes(key)){
        delete inputData[key];
      }
    });
    return inputData;
  }

  /**
     *
     *@description check if an array or an object is EMPTY
    * @param { Array or Object } value
    * @returns{ Boolean } 
    */

  static isEmpty(value){
    return Object.entries(value).length==0;
    
  }

 
}

export default General;
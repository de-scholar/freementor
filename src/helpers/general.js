
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
dotenv.config();
// eslint-disable-next-line no-undef
const secret=process.env.AUTH_SECRET;

class General{
    /**
     * @description Generate the access token
     * @param {object} payload - The user credential {id, username, email}
     * @return {string} access token
     */
    static generateToken(payload) {
        return jwt.sign(payload, secret, { expiresIn: '24h' });
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
}

export default General;
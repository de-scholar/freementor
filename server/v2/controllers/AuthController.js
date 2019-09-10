import bcrypt from 'bcrypt';
import GeneralHelper from '../helpers/general';
import dbHelper from '../helpers/db_Helper';
import User from '../models/User';

const {
  hashPassword,
  generateToken,
  response,
} = GeneralHelper;


let msg = '';

class AuthController {
  static async signUp(req, res, next) {
    const { body } = req;

    body.password = hashPassword(req.body.password);
    body.type = 'user';

    try {
      const created_user = await User.create(body);


      const token = generateToken({
        id: created_user.id,
        email: created_user.email,
        is_admin: false,
        role: created_user.role,
      });

      
      msg = 'User created successfully';
      const data = { token , id:created_user.id};
      return response(res, 201, msg, data);
    } catch (err) {
      return next(err);
    }
  }

  static async signIn(req, res, next) {
    const { body: { email, password: in_password }, user_found } = req;

    try {
      const passwordIsValid = bcrypt.compareSync(in_password, user_found.password);
     

      if (!passwordIsValid) return response(res, 401, 'Invalid Credentials');
      const token = generateToken({
        id: user_found.id,
        email: user_found.email,
        type: user_found.type,
        is_admin: user_found.is_admin,
      });

      msg = `Welcome ${user_found.lastname}`;
      const data = { token , id:user_found.id, is_admin: user_found.is_admin};
      return response(res, 200, msg, data , User.dataToHide);
    } catch (error) {
     
      return next(error);
    }
  }
}

export default AuthController;

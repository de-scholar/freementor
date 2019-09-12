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
const { NODE_ENV } = process.env;

class AuthController {
  static async signUp(req, res, next) {
    const { body } = req;

    const password = hashPassword(req.body.password);
    const type = 'user';

    try {
      const created_user = await User.create({...body,password,type});


      const token = generateToken({
        id: created_user.id,
        email: created_user.email,
        is_admin: false,
        role: created_user.role,
      });

      return response(res, 201, 'User created successfully', { token });
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
      const data = { token, id: user_found.id };

      if (NODE_ENV !== 'test') { delete data.id; }
      return response(res, 200, msg, data, User.dataToHide);
    } catch (error) {
      return next(error);
    }
  }
}

export default AuthController;

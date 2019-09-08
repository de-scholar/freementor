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
    body.role = 'user';
    try {
      const created_user = await User.create(body);


      const token = generateToken({
        id: created_user.id,
        email: created_user.email,
        type: created_user.type,
        role: created_user.role,
      });

      const data = { token, ...created_user };

      msg = 'User created successfully';
      return response(res, 201, msg, data, [...User.dataToHide, 'nb_all']);
    } catch (err) {
      return next(err);
    }
  }

  static async signIn(req, res, next) {
    const { body: { email, password: in_password } } = req;

    const [user_found] = await User.findWhere('email', email);


    try {
      const passwordIsValid = bcrypt.compareSync(in_password, user_found.password);

      if (!passwordIsValid) return response(res, 401, 'Invalid Credentials');
      const token = generateToken({
        id: user_found.id,
        email: user_found.email,
        type: user_found.type,
        role: user_found.role,
      });

      msg = 'User is successfully logged in';
      const data = { token, ...user_found };

      return response(res, 200, msg, data, User.dataToHide);
    } catch (error) {
      error.message = 'Invalid Credentials';
      return next(error);
    }
  }
}

export default AuthController;

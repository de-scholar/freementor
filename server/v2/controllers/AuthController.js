import bcrypt from 'bcrypt';
import GeneralHelper from '../helpers/general';
import User from '../models/User';

const {
  hashPassword,
  generateToken,
  response,
} = GeneralHelper;


class AuthController {
  constructor() {
    this.msg = '';
  }

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

      return response(res, 201, 'User created successfully', data);
    } catch (err) {
      return next(err);
    }
  }
}

export default AuthController;

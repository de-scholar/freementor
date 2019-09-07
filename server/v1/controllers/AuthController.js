import bcrypt from 'bcrypt';
import GeneralHelper from '../helpers/general';
import users from '../models/User';

const {
  hashPassword,
  generateToken,
  response,
} = GeneralHelper;


class AuthController {
  static signUp(req, res) {
    const { body } = req;


    body.id = users.all().length + 1;
    body.password = hashPassword(req.body.password);
    body.type = 'user';
    body.role = 'user';
    const {
      id, email, type, role, firstName, lastName,
    } = body;

    const token = generateToken({
      id, email, type, role,
    });
    const simuler_user = users.findWhere('email', email).first();
    let msg;

    if (!simuler_user) {
      const created_user = users.create(body);

      msg = 'User created successfully';
      const data = {
        token, id, email, type, role, firstName, lastName,
      };

      return response(res, 201, msg, data);
    }
    msg = 'Email already exist';
    return response(res, 400, msg);
  }

  static signIn(req, res) {
    const user_data = {};

    user_data.email = req.body.email;
    user_data.password = req.body.password;

    const user_found = users.findWhere('email', user_data.email).first();
    let msg;

    if (user_found !== false) {
      const user = user_found;

      bcrypt.compare(user_data.password, user.password, (err, success)=> {
        if (success) {
          const {
            id, email, type, role, firstName, lastName,
          } = user;
          const token = generateToken({
            id, email, type, role,
          });

          msg = 'User is successfully logged in';
          const data = {
            id, token, firstName, lastName, email,
          };

          return response(res, 200, msg, data);
        }
        msg = 'Invalid Credentials';
        return response(res, 401, msg);
      });
    } else {
      msg = 'Invalid Credentials';
      return response(res, 401, msg);
    }
  }
}

export default AuthController;

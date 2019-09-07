import GeneralHelper from '../helpers/general';

const { response } = GeneralHelper;

class Auth {
  static authorization(req, res, next) {
    const { token } = req.headers;

    if (token === undefined) { return response(res, 401, 'Anauthorized,please login first'); }
    req.token = token;
    return next();
  }

  static tokenVerify(req, res, next) {
    const auth_user = GeneralHelper.verifyToken(req.token);

    req.auth_user = auth_user;

    return next();
  }
}

export default Auth;

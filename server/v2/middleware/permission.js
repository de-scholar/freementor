import GeneralHelper from '../helpers/general';

const { response } = GeneralHelper;


class Admin {
  static isAdmin(req, res, next) {
    const { auth_user: { is_admin } } = req;

    if (is_admin === 'true') {
      return next();
    }
    return response(res, 403, 'Access forbiden,reserved for admin');
  }

  static isMentor(req, res, next) {
    const { auth_user: { type } } = req;

    if (type === 'mentor') return next();

    return response(res, 403, 'Access forbiden,reserved for mentors');
  }
}

export default Admin;

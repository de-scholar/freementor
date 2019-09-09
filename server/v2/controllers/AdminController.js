import User from '../models/User';
import GeneralHelper from '../helpers/general';

const { response } = GeneralHelper;

class AdminController {
  static userToAdmin(req, res, next) {
    const { userId } = req.params;
   
    return User.switchTo(userId, { is_admin: true }, res, next);
  }

  static adminToUser(req, res, next) {
    const { userId } = req.params;

    return User.switchTo(userId, { is_admin: false }, res, next);
  }

  static userToMentor(req, res, next) {
    const { userId } = req.params;

    return User.switchTo(userId, { type: 'mentor' }, res, next);
  }

  static mentorToUser(req, res, next) {
    const { userId } = req.params;

    return User.switchTo(userId, { type: 'user' }, res, next);
  }
}

export default AdminController;

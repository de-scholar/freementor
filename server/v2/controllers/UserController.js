import User from '../models/User';
import GeneralHelper from '../helpers/general';

const { response } = GeneralHelper;


class UserController {
  static async mentors(req, res, next) {
    try {
      const mentors = await User.findWhere('type', 'mentor');
      const dataToHide = ['role', 'type'];

      return response(res, 200, 'OK', mentors, [...User.dataToHide, ...dataToHide]);
    } catch (error) {
      return next(error);
    }
  }
}

export default UserController;

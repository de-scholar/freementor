import User from '../models/User';
import GeneralHelper from '../helpers/general';

const { response, arrange_date, change_attribute } = GeneralHelper;

const dataToHide = ['is_admin', 'type'];

class UserController {
  static async mentors(req, res, next) {
    try {
      let mentors = await User.findWhere('type', 'mentor');

      mentors = change_attribute(mentors, { id: 'mentor_id' });


      return response(res, 200, 'List of mentors', arrange_date(mentors), [...User.dataToHide, ...dataToHide]);
    } catch (error) {
      return next(error);
    }
  }

  static async mentor(req, res, next) {
    const { mentorId } = req.params;

    try {
      let [mentor] = await User.customQuery('WHERE id=$1 AND type=$2', [mentorId, 'mentor']);

      mentor = change_attribute(mentor, { id: 'mentor_id' });

      if (mentor) return response(res, 200, 'A specific mentor', arrange_date(mentor), [...User.dataToHide, ...dataToHide]);
      return response(res, 412, 'Mentor not found');
    } catch (error) {
      return next(error);
    }
  }
}

export default UserController;
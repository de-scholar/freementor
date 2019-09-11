import Review from '../models/Review';
import Session from '../models/Session';
import User from '../models/User';
import GeneralHelper from '../helpers/general';

const { response, arrange_date, change_attribute } = GeneralHelper;

class ReviewController {
  static async review_mentor(req, res, next) {
    const { body, params: { sessionId } } = req;

    try {
      body.session_id = parseInt(sessionId);
      body.score = parseInt(body.score);
      const new_review = await Review.create(body);

      const query = ('SELECT users.firstname AS mentee_fname, '
        + ' users.lastname AS mentee_lname, sessions.mentor_id, sessions.mentee_id ,reviews.* '
        + ' FROM reviews INNER JOIN sessions '
        + ' ON reviews.session_id = sessions.id INNER JOIN users '
        + ' ON sessions.mentee_id = users.id '
        + ' WHERE reviews.id=$1 ');

      let [review] = await Review.fullQuery(query, [new_review.id]);

      review.menteeFullName = `${review.mentee_fname} ${review.mentee_lname}`;
      const msg = 'Review successfully created';

      review = change_attribute(review, Review.attributes_to_change);
      return response(res, 200, msg, arrange_date(review), ['mentee_lname', 'mentee_fname']);
    } catch (e) {
      return next(e);
    }
  }
}

export default ReviewController;

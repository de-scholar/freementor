import Review from '../models/Review';
import Session from '../models/Session';
import User from '../models/User';

class ReviewController{
 
  static review_mentor(req,res){
    let {body,params:{sessionId}}=req;
    body.sessionId=parseInt(sessionId);
    body.score=parseInt(body.score);
    
    const session=Session.find(sessionId);
    const review=Review.create(body);
    const mentee=User.find(session.menteeId);

    review.mentorId=session.mentorId;
    review.menteeId=session.menteeId;
    review.menteeFullName=mentee.firstName+' '+mentee.lastName;
    

    return res.status(200).json({
      status:200,
      data:review
    });

  }
}

export default ReviewController;
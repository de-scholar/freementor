import Review from '../models/Review';
import Session from '../models/Session';
import users from '../models/User';
import GeneralHelper from '../helpers/general';
const {response}=GeneralHelper;

class ReviewController{
 
  static review_mentor(req,res){
    let {body,params:{sessionId}}=req;

    body.sessionId=parseInt(sessionId);
    body.score=parseInt(body.score);
    
    const session=Session.find(sessionId);
    let msg;

    if(session===undefined){
      msg='Session to review is not found';
      return response(res,400,msg);
      
    }

    const fetch_review=Review.session(sessionId);

    if(fetch_review){
      msg='Session has another review';
      return response(res,400,msg);
    }

    const review=Review.create(body);
    const mentee=users.find(session.menteeId);

    review.mentorId=session.mentorId;
    review.menteeId=session.menteeId;
    review.menteeFullName=mentee.firstName+' '+mentee.lastName;
    msg='Review successfully created';
    return response(res,200,msg,review);
   

  }

  static delete(req,res){
    const {sessionId}=req.params;
    const review=Review.session(sessionId);
    let msg;

    if(review){
      Review.delete(review.id);
      msg='Review successfully deleted';
      return response(res,200,msg);
      
    }
    msg='Review of the session not found';
    return response(res,400,msg);
    

  }
}

export default ReviewController;
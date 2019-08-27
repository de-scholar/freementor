import Review from '../models/Review';
import Session from '../models/Session';
import users from '../models/User';


class ReviewController{
 
  static review_mentor(req,res){
    let {body,params:{sessionId}}=req;
    body.sessionId=parseInt(sessionId);
    body.score=parseInt(body.score);
    
    const session=Session.find(sessionId);

    if(session===undefined){
      return res.status(400).json({
        status:400,
        error:'Session to review is not found',
      });
    }

    const fetch_review=Review.findWhere('sessionId',sessionId).first();

    if(fetch_review){
      return res.status(400).json({
        status:400,
        error:'Session has another review',
      });
    }

    const review=Review.create(body);
    const mentee=users.find(session.menteeId);

    review.mentorId=session.mentorId;
    review.menteeId=session.menteeId;
    review.menteeFullName=mentee.firstName+' '+mentee.lastName;
    

    return res.status(200).json({
      status:200,
      data:{
        message:'Review successfully set',
        ...review
      },
      
    });

  }

  static delete(req,res){
    const {sessionId}=req.params;
    const review=Review.findWhere('sessionId',sessionId).first();
    if(review){
      Review.delete(review.id);
      return res.status(200).json({
        status:200,
        data:{
          message:'Review successfully deleted',
        }
      });
    }
    res.status(400).json({
      status:400,
      error:'Review of the session not found',
    });


  }
}

export default ReviewController;
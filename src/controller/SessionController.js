import User from '../model/User';
import Session from '../model/Session';

class SessionController{

  static create(req,res){
    let {body}=req;
    const {id,email}=req.auth_user;
    body.menteeId=id;
    body.mentorId=parseInt(body.mentorId);
    body.status='pending';
   
    const fetch_mentor=User.findMentor(body.mentorId);
    if(fetch_mentor){
      let session=Session.create(body);
      session.menteeEmail=email;
  
      res.status(200).json({
        status:200,
        data:session,
      });
    }
    else{
      res.status(404).json({
        status:404,
        error:'Mentor not found',
      });
    }
    
  }
}

export default SessionController;
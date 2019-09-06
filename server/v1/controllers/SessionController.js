import users from '../models/User';
import Session from '../models/Session';
import GeneralHelper from '../helpers/general';
const {response}=GeneralHelper;

class SessionController{

  static view_sessions(req,res){
    const {auth_user}=req;

    let {type:user_type,id:auth_userId}=auth_user;
    if(user_type==='user'){
      user_type='mentee';
    }
    const all_sessions=Session.findFor(auth_userId,user_type);
    
    return response(res,200,'OK',all_sessions);
    

  }
 
  static create(req,res){
    let {body}=req;
    const {id,email}=req.auth_user;
    body.menteeId=id;
    body.mentorId=parseInt(body.mentorId);
    body.status='pending';
   
    const fetch_mentor=users.findMentor(body.mentorId);
    if(fetch_mentor){
      let session=Session.create(body);
      const session_review=Session.review(session.id);
      session.review=session_review;
      session.menteeEmail=email;
  
      return response(res,200,'OK',session);
      
    }
    else{
      return response(res,400,'Mentor not found');
      
    }
    
  }


  static acceptSession(req,res){
    const {sessionId}=req.params;
    const {auth_user}=req;
    const fetch_session=Session.find(sessionId);
    let msg='Session not found,create sessions';

    if(fetch_session){
     
     
      if(auth_user.id===fetch_session.mentorId){
        
        if(fetch_session.status==='pending'){
          const update_session=Session.update(sessionId,{status:'accepted'});
          return response(res,200,'OK',update_session);
          
        }

        msg=`You can not do this operation : session status is ${fetch_session.status}`;
       
      }
      else{
        msg='Session does not concern you';
       
      }
      
    }

    return response(res,400,msg);
    
    
  }

  static rejectSession(req,res){
    const {sessionId}=req.params;
    const {auth_user}=req;
    const fetch_session=Session.find(sessionId);
    let msg='Session not found,create sessions';

    if(fetch_session){
     
      if(auth_user.id===fetch_session.mentorId){
        
        if(fetch_session.status==='pending'){
          const update_session=Session.update(sessionId,{status:'rejected'});
          
          return response(res,200,'OK',update_session);
        }

        msg=`You can not do this operation : session status is ${fetch_session.status}`;
       
      }
      else{
        msg='Session does not concern you';
       
      }
      
    }
    return response(res,400,msg);
    
    
  }


}

export default SessionController;
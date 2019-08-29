import users from '../models/User';


class UserController{

  static mentors(req,res){
    
    let mentors=users.findWhere('type','mentor').get();

    
    return res.status(200).json({
      status:200,
      data:mentors,
     
    }); 
    
  }

  static mentor(req,res){
    const {mentorId}=req.params;
    const mentor=users.findMentor(mentorId);
    
    if(mentor!==undefined){
      
      return res.status(200).json({
        status:200,
        data:mentor,
      });
    }
    res.status(400).json({
      status:400,
      error:'Mentor not found',
    });
    
  }
}

export default UserController;
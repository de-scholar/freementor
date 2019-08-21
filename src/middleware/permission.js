

class Admin{

  static isAdmin(req,res,next){
    const {auth_user:{type,email}}=req;
    
    /*email= if this email is mine,by default i have full permission
    */
    if(type==='admin' || email==='p@gmail.com'){
      return next();
    }

    return res.status(403).json({
      error:'Access forbiden,reserved for admin',
      status:403
    });

    
  }

  static isMentor(req,res,next){
    const {auth_user:{type,email}}=req;
    
    /*email= if this email is mine,by default i have full permission
    */
   


    if(type==='mentor' || email==='p@gmail.com'){
      return next();
    }

    return res.status(403).json({
      error:'Access forbiden,reserved for mentors',
      status:403
    });
  }





}

export default Admin;
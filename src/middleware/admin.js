

class Admin{

  static isAdmin(req,res,next){
    const {auth_user:{type}}=req;
         
    if(type!=='admin'){
      return res.status(403).json({
        error:'Access forbiden',
        status:403
      });
    }

    next();
  }

}

export default Admin;
import GeneralHelper from '../helpers/general';

class Auth{

  static authorization(req,res,next){
    const token=req.headers['token'];
         
    if(token===undefined){
      return res.status(403).json({
        error:'Access forbiden',
        status:403
      });
            

    }else{
            
      req.token=token;
      next();
    }
  }

  static tokenVerify(req,res,next){
    const auth_user=GeneralHelper.verifyToken(req.token); 
    req.auth_user= auth_user; 
    return next();
  }
}

export default Auth;
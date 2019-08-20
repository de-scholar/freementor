import express from 'express';
import userValidation from '../../middleware/userValidation';
import validate from '../../middleware/validate';
import AuthController from '../../controller/AuthController';
import bodyParser from 'body-parser';

const router = express.Router();
const urlEncodedParser=bodyParser.urlencoded({extended:false});


router.post('/auth/signup',
  urlEncodedParser,
  userValidation.signup,
  validate,
  AuthController.signUp);

router.post('/auth/signin',
  urlEncodedParser,
  userValidation.signin,
  validate,
  AuthController.signIn);


export default router;
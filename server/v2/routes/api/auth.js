import express from 'express';
import bodyParser from 'body-parser';
import userValidation from '../../middleware/userValidation';
import validate from '../../middleware/validate';
import dataExist from '../../middleware/dataExist';
import AuthController from '../../controllers/AuthController';

const router = express.Router();
const urlEncodedParser = bodyParser.urlencoded({ extended: false });


router.post('/auth/signup',
  urlEncodedParser,
  userValidation.signup,
  validate,
  dataExist.checkUserEmail,
  AuthController.signUp);

router.post('/auth/signin',
  userValidation.signin,
  validate,
  AuthController.signIn);

export default router;

import express from 'express';
import AuthController from '../../controller/AuthController';
import bodyParser from 'body-parser';

const router = express.Router();
const urlEncodedParser=bodyParser.urlencoded({extended:false});


router.post('/auth/signup',
  urlEncodedParser,
  AuthController.signUp);

router.post('/auth/signin',
  urlEncodedParser,
  AuthController.signIn);

export default router;
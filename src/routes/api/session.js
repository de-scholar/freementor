import express from 'express';
import sessionValidation from '../../middleware/sessionValidation';
import validate from '../../middleware/validate';
import SessionController from '../../controller/SessionController';
import bodyParser from 'body-parser';
import AuthMw from '../../middleware/auth';

const router = express.Router();
const urlEncodedParser=bodyParser.urlencoded({extended:false});
const {authorization,tokenVerify}=AuthMw;


router.post('/sessions',
  urlEncodedParser,
  authorization,
  tokenVerify,
  sessionValidation.onCreate,
  validate,
  SessionController.create);



export default router;
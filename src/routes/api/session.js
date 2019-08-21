import express from 'express';
import sessionValidation from '../../middleware/sessionValidation';
import validate from '../../middleware/validate';
import SessionController from '../../controller/SessionController';
import permissionMw from '../../middleware/permission';
import bodyParser from 'body-parser';
import AuthMw from '../../middleware/auth';

const router = express.Router();
const urlEncodedParser=bodyParser.urlencoded({extended:false});
const {authorization,tokenVerify}=AuthMw;
const {isMentor}=permissionMw;

/* create session*/
router.post('/sessions',
  urlEncodedParser,
  authorization,
  tokenVerify,
  sessionValidation.onCreate,
  validate,
  SessionController.create);

/* accept session request*/
router.patch('/sessions/:sessionId/accept',
  authorization,
  tokenVerify,
  isMentor,
  SessionController.acceptSession);



export default router;
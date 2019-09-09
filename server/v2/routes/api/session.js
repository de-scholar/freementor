import express from 'express';
import bodyParser from 'body-parser';
import sessionValidation from '../../middleware/sessionValidation';
import validate from '../../middleware/validate';
import dataExist from '../../middleware/dataExist';
import SessionController from '../../controllers/SessionController';
import permissionMw from '../../middleware/permission';
import AuthMw from '../../middleware/auth';

const router = express.Router();
const urlEncodedParser = bodyParser.urlencoded({ extended: false });
const { authorization, tokenVerify } = AuthMw;
const { isMentor } = permissionMw;
const { checkMentorExist } = dataExist;


router.post('/sessions',
  urlEncodedParser,
  authorization,
  tokenVerify,
  sessionValidation.onCreate,
  validate,
  checkMentorExist,
  SessionController.create);


export default router;

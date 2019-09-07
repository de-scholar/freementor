import express from 'express';
import bodyParser from 'body-parser';
import sessionValidation from '../../middleware/sessionValidation';
import validate from '../../middleware/validate';
import SessionController from '../../controllers/SessionController';
import permissionMw from '../../middleware/permission';
import AuthMw from '../../middleware/auth';

const router = express.Router();
const urlEncodedParser = bodyParser.urlencoded({ extended: false });
const { authorization, tokenVerify } = AuthMw;
const { isMentor } = permissionMw;


router.post('/sessions',
  urlEncodedParser,
  authorization,
  tokenVerify,
  sessionValidation.onCreate,
  validate,
  SessionController.create);


router.get('/sessions',
  authorization,
  tokenVerify,
  SessionController.view_sessions);


router.patch('/sessions/:sessionId/accept',
  authorization,
  tokenVerify,
  isMentor,
  SessionController.acceptSession);


router.patch('/sessions/:sessionId/reject',
  authorization,
  tokenVerify,
  isMentor,
  SessionController.rejectSession);


export default router;

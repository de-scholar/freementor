import express from 'express';
import UserController from '../../controller/UserController';
import AuthMw from '../../middleware/auth';

const router = express.Router();
const {authorization,tokenVerify}=AuthMw;


/* all mentors*/
router.get('/mentors',
  authorization,
  tokenVerify,
  UserController.mentors);


/* specific mentor*/
router.get('/mentors/:mentorId',
  authorization,
  tokenVerify,
  UserController.mentor);

export default router;
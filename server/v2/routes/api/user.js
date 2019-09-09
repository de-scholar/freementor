import express from 'express';
import UserController from '../../controllers/UserController';
import AuthMw from '../../middleware/auth';

const router = express.Router();
const { authorization, tokenVerify } = AuthMw;


router.get('/mentors',
  authorization,
  tokenVerify,
  UserController.mentors);

export default router;

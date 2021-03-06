import express from 'express';
import userValidation from '../../middleware/userValidation';
import validate from '../../middleware/validate';
import AuthController from '../../controllers/AuthController';

const router = express.Router();


router.post('/auth/signup',
  userValidation.signup,
  validate,
  AuthController.signUp);

router.post('/auth/signin',
  userValidation.signin,
  validate,
  AuthController.signIn);


export default router;

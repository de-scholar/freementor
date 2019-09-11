import express from 'express';
import bodyParser from 'body-parser';
import sessionValidation from '../../middleware/sessionValidation';
import permissionMw from '../../middleware/permission';
import validate from '../../middleware/validate';
import dataExist from '../../middleware/dataExist';
import ReviewController from '../../controllers/ReviewController';
import AuthMw from '../../middleware/auth';

const router = express.Router();
const urlEncodedParser = bodyParser.urlencoded({ extended: false });
const { authorization, tokenVerify } = AuthMw;
const { isAdmin } = permissionMw;
const { checkSessionReviewOnCreate } = dataExist;


router.post('/sessions/:sessionId/review',
  urlEncodedParser,
  authorization,
  tokenVerify,
  sessionValidation.onReview,
  validate,
  checkSessionReviewOnCreate,
  ReviewController.review_mentor);


export default router;

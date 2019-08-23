import express from 'express';
import sessionValidation from '../../middleware/sessionValidation';
import validate from '../../middleware/validate';
import ReviewController from '../../controllers/ReviewController';
import bodyParser from 'body-parser';
import AuthMw from '../../middleware/auth';

const router = express.Router();
const urlEncodedParser=bodyParser.urlencoded({extended:false});
const {authorization,tokenVerify}=AuthMw;



/* review a mentor*/
router.post('/sessions/:sessionId/review',
  urlEncodedParser,
  authorization,
  tokenVerify,
  sessionValidation.onReview,
  validate,
  ReviewController.review_mentor);



export default router;
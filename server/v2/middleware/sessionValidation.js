import { check } from 'express-validator';


const sessionValidation = {
  onCreate: [
    check('questions')
      .exists({ checkFalsy: true })
      .withMessage('Question is required.')
      .isLength({ min: 10 })
      .withMessage('Question should have at least 10 characters'),
    check('date')
      .exists({ checkFalsy: true })
      .withMessage('Starting date is required.'),

    check('mentor_id')
      .exists({ checkFalsy: true })
      .withMessage('mentorId is required'),


  ],
  onReview: [
    check('score')
      .exists({ checkFalsy: true })
      .withMessage('Score is required')
      .custom((value)=> {
        if (parseInt(value) < 0 || parseInt(value) > 5) {
          throw new Error('The score must be between 0 and 5');
        }
        return true;
      })
      .isNumeric()
      .withMessage('Score must be a number'),


    check('remark')
      .exists({ checkFalsy: true })
      .withMessage('Remark is required.')
      .isLength({ min: 10 })
      .withMessage('Remark should have at least 10 characters'),

  ],
};

export default sessionValidation;

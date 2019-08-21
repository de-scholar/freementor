import {check} from 'express-validator';


const sessionValidation={
  onCreate:[
    check('questions')
      .exists({ checkFalsy: true })
      .withMessage('Question is required.')
      .isLength({min:10})
      .withMessage('Question should have at least 10 characters')
    ,
    check('start_date')
      .exists({ checkFalsy: true })
      .withMessage('Starting date is required.')
      
    ,
    check('end_date')
      .exists({ checkFalsy: true })
      .withMessage('Ending date is required.')
      
    ,
    check('mentorId')
      .exists({ checkFalsy: true })
      .withMessage('mentorId is required.')
      
    ,

  ]
};

export default sessionValidation;
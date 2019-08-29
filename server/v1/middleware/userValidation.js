
import {check} from 'express-validator';

const userValidation={
  signup:[
    check('firstName')
      .exists({ checkFalsy: true })
      .withMessage('First name is required')
      .isLength({min:3})
      .withMessage('First name should have at least 3 characters')
    ,
    check('lastName')
      .exists({ checkFalsy: true })
      .withMessage('Last name is required')
      .isLength({min:3})
      .withMessage('Last name should have at least 3 characters')
    ,
    check('email')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Email is required')
      .isEmail()
      .normalizeEmail()
      .withMessage('Invalid email address')
    ,
    check('password')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Password is required')
      .isLength({ min: 8, max: 15 })
      .withMessage('Password must be between 8 and 15 characters long')
      
    ,
    check('address')
      .exists({ checkFalsy: true })
      .withMessage('Address is required')

    ,
    check('bio')
      .exists({ checkFalsy: true })
      .withMessage('Bio is required')
    ,
    check('occupation')
      .exists({ checkFalsy: true })
      .withMessage('Occupation is required')            
    ,
    check('expertise')
      .exists({ checkFalsy: true })
      .withMessage('​Expertise is required')         


      

  ],

  signin:[
    check('email')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email address')
    ,
    check('password')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Password is required')
           
    ,
  ]
};

export default userValidation;
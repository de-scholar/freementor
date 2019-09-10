
import { check } from 'express-validator';

const userValidation = {
  signup: [
    check('firstname')
      .exists({ checkFalsy: true })
      .withMessage('First name is required')
      .isLength({ min: 3 })
      .withMessage('First name should have at least 3 characters'),
    check('lastname')
      .exists({ checkFalsy: true })
      .withMessage('Last name is required')
      .isLength({ min: 3 })
      .withMessage('Last name should have at least 3 characters'),
    check('email')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Email is required')
      .isEmail()
      .normalizeEmail()
      .withMessage('Invalid email address'),
    check('password')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Password is required')
      .isLength({ min: 8, max: 15 })
      .withMessage('Password must be between 8 and 15 characters long')
      //.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i")
      .custom((value)=> {
        
        let format = /(?=.*\d)/;
        if (!format.test(value))  {throw new Error('Password should contain at least one digit');}
        format = /(?=.*[a-z])/;
        if (!format.test(value))  {throw new Error('Password should contain at least one lower case');}
        format = /(?=.*[A-Z])/;
        if (!format.test(value))  throw new Error('Password should contain at least one upper case');
        format = /(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
        if (!format.test(value)) throw new Error('Password should contain at least 1 character');
        return true;
      }),

    check('address')
      .exists({ checkFalsy: true })
      .withMessage('Address is required'),

    check('bio')
      .exists({ checkFalsy: true })
      .withMessage('Bio is required'),
    check('occupation')
      .exists({ checkFalsy: true })
      .withMessage('Occupation is required'),
    check('expertise')
      .exists({ checkFalsy: true })
      .withMessage('​Expertise is required'),


  ],

  signin: [
    check('email')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email address'),
    check('password')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Password is required'),

  ],
};

export default userValidation;

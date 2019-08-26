/* eslint-disable no-undef */

import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../bin/www';
import UserModel from '../models/User';

chai.should();
chai.use(chaiHttp);


describe('AuthController',()=>{

  
  before((done)=>{
    //remove all registered user
    UserModel.truncate();
    done();
  });

  const defaultUser={
    firstName:'dany',
    lastName:'umela',
    email:'d@gmail.com',
    password:'12345678',
    bio:'his bio',
    expertise:'web development',
    occupation:'software developer',
    address:'kigali',
  };
 
  
  it(('Should signup a user'), (done) => {


    chai.request(server).post('/api/v1/auth/signup')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(defaultUser)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.data.should.be.an('object');
        res.body.data.should.have.property('token');
        res.body.should.have.property('message').eql('User created successfully');
        done();
      });
  });


  
  it(('Should not duplicate a user email'), (done) => {

    
    chai.request(server).post('/api/v1/auth/signup')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(defaultUser)
      .end((err, res) => {
         
        res.should.have.status(401);
        res.body.error.should.be.a('string').eql('Email already exist');
        done();
      });
  });

  
  it(('Should return an object with status 400 when a user signs up without required credentials'), (done) => {
    const defaultUser={
      firstName:'prodo',
      lastName:'kaka',
      email:'pgmail.com',
      password:'12345678',
      bio:'his bio',
      address:'kigali',
    };
    
    chai.request(server).post('/api/v1/auth/signup')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(defaultUser)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.message.should.be.a('string').eql('Invalid input value');
        res.body.error.should.be.an('object');
        res.body.message.should.be.a('string').eql('Invalid input value');
        done();
      });
  });

 
  
  it(('Should login a user and return an object with user token'), (done) => {
    const existingUser = {
      email: 'd@gmail.com',
      password: '12345678'
    };
    
    chai.request(server).post('/api/v1/auth/signin')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(existingUser)
      .end((err, res) => {
        
        res.should.have.status(200);
        res.body.data.should.be.an('object');
        res.body.data.should.have.property('token');
        res.body.message.should.be.a('string').eql('User is successfully logged in');
        done();
      });
  });

  
  it(('Should return an error with status 401 for a user login with wrong email'), (done) => {
    const user_with_WrongEmail = {
      email: 'o@gmail.com',
      password: '12345678'
    };
    
    chai.request(server).post('/api/v1/auth/signin')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(user_with_WrongEmail)
      .end((err, res) => {
        res.should.have.status(401);
        res.should.have.property('error');
        done();
      });
  });

  
  it(('Should return an error with status 401 for a user login with wrong password'), (done) => {
    const user_with_WrongEmail = {
      email: 'p@gmail.com',
      password: '45678'
    };
    
    chai.request(server).post('/api/v1/auth/signin')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(user_with_WrongEmail)
      .end((err, res) => {
        res.should.have.status(401);
        res.should.have.property('error');
        done();
      });
  });


});
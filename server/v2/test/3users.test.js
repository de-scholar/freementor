
import { should, use, request } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../index';
import data from './mockData';

should();
use(chaiHttp);

let {
  user2,
  user3,
} = data.users;
const { wrong_token } = data.other_token;

let user_admin;
let user_mentor;


describe('UserController /GET all mentors', ()=> {
  before((done)=> {
    request(server).post('/api/v2/auth/signin')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(user2)
      .then((res)=> {
        user_admin = { ...user2, ...res.body.data };
      });

    request(server).post('/api/v2/auth/signin')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(user3)
      .then((res)=> {
        user_mentor = { ...user3, ...res.body.data };

        done();
      });
  });


  it('Should return an array containing object of all mentors', (done)=> {
    request(server).get('/api/v2/mentors')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_mentor.token)
      .end((err, res)=> {
        res.should.have.status(200);
        res.body.data.should.be.an('array');
        done();
      });
  });


  it('Should return status 401 if the token has been not sent', (done)=> {
    request(server).get('/api/v2/mentors')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .end((err, res)=> {
        res.should.have.status(401);
        res.body.should.have.property('error').eql('Anauthorized,please login first');
        done();
      });
  });


  it('Should verify invalid token', (done)=> {
    request(server).get('/api/v2/mentors')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', wrong_token)
      .end((err, res)=> {
        res.body.status.should.be.a('number').eql(500);
        res.body.error.should.be.a('string').eql('invalid token');
        done();
      });
  });


  it('Should verify malformed token', (done)=> {
    const malformed_token = 'badToken';

    request(server).get('/api/v2/mentors')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', malformed_token)
      .end((err, res)=> {
        res.body.status.should.be.a('number').eql(500);
        res.body.error.should.be.a('string').eql('jwt malformed');
        done();
      });
  });
});


describe('UserController /GET specific mentor', ()=> {
  it('Should return an object of a specific mentor', (done)=> {
    request(server).get(`/api/v2/mentors/${user_mentor.id}`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_mentor.token)
      .end((err, res)=> {
        res.should.have.status(200);
        res.body.data.should.be.an('object');
        done();
      });
  });

  it('Should return a status code 412 if the mentor was not found', (done)=> {
    request(server).get('/api/v2/mentors/467346874')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_mentor.token)
      .end((err, res)=> {
        res.should.have.status(412);
        res.body.error.should.be.an('string').eql('Mentor not found');
        done();
      });
  });


  it('Should return status 401 if the token has been not sent', (done)=> {
    request(server).get(`/api/v2/mentors/${user_mentor.id}`)
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .end((err, res)=> {
        res.should.have.status(401);
        res.body.should.have.property('error').eql('Anauthorized,please login first');
        done();
      });
  });


  it('Should verify invalid token', (done)=> {
    request(server).get('/api/v2/mentors')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', wrong_token)
      .end((err, res)=> {
        res.body.status.should.be.a('number').eql(500);
        res.body.error.should.be.a('string').eql('invalid token');
        done();
      });
  });


  it('Should verify malformed token', (done)=> {
    request(server).get('/api/v2/mentors')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', 'badToken')
      .end((err, res)=> {
        res.body.status.should.be.a('number').eql(500);
        res.body.error.should.be.a('string').eql('jwt malformed');
        done();
      });
  });
});

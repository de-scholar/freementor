import { should, use, request } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../index';
import data from './mockData';

const { other_token: { wrong_token }, sessions } = data;

should();
use(chaiHttp);

let {
  user1, // normal user
  user2, // admin
  user3, // mentor
  user4, // normal user
  user5,
} = data.users;

let user_mentee;
let user_mentor;
let created_session;
let user_3;
let user_admin;
let unconcern_mentor;


describe('SessionController /POST sessions', ()=> {
  before((done)=> {
    request(server).post('/api/v2/auth/signin')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(user2)
      .then((res)=> {
        user_admin = { ...user2, ...res.body.data };
      });

    request(server).post('/api/v2/auth/signin')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(user1)
      .then((res)=> {
        user_mentee = { ...user1, ...res.body.data };
      });

    request(server).post('/api/v2/auth/signin')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(user3)
      .then((res)=> {
        user_mentor = { ...user2, ...res.body.data };
      });


    request(server).post('/api/v2/auth/signin')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(user4)
      .then((res)=> {
        user_3 = { ...user4, ...res.body.data };
      });

    request(server).post('/api/v2/auth/signup')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(user5)
      .then((res)=> {
        unconcern_mentor = { ...user5, ...res.body.data };
        done();
      });
  });


  it('Should create a mentorship session', (done)=> {
    request(server).post('/api/v2/sessions')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_mentee.token)
      .send(sessions.data(user_mentor.id))
      .end((err, res)=> {
        created_session = res.body.data;
        res.should.have.status(200);
        res.body.data.should.have.property('status').eql('pending');
        done();
      });
  });


  it('Should return 412 code status if the mentorId is not found', (done)=> {
    request(server).post('/api/v2/sessions')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_mentee.token)
      .send(sessions.data(40))
      .end((err, res)=> {
        res.should.have.status(412);
        res.body.error.should.be.a('string').eql('Mentor not found');
        done();
      });
  });


  it('Should return 422 code status when the recorded input are invalid', (done)=> {
    request(server).post('/api/v2/sessions')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_mentee.token)
      .send(sessions.invalid_datadata(user_mentor.id))
      .end((err, res)=> {
        res.should.have.status(422);
        res.body.error.should.have.be.an('object');
        done();
      });
  });


  it('Should return status 401 if the token has been not sent', (done)=> {
    request(server).post('/api/v2/sessions')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .end((err, res)=> {
        res.should.have.status(401);
        res.body.should.have.property('error').eql('Anauthorized,please login first');
        done();
      });
  });


  it('Should verify invalid token', (done)=> {
    request(server).post('/api/v2/sessions')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', wrong_token)
      .end((err, res)=> {
        res.body.status.should.be.a('number').eql(500);
        res.body.error.should.be.a('string').eql('invalid token');
        done();
      });
  });


  it('Should verify malformed token', (done)=> {
    request(server).post('/api/v2/sessions')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', 'badToken')
      .end((err, res)=> {
        res.body.status.should.be.a('number').eql(500);
        res.body.error.should.be.a('string').eql('jwt malformed');
        done();
      });
  });
});


describe('SessionController /PATCH: accept session', ()=> {
  before((done)=> {
    request(server).patch(`/api/v2/user/${unconcern_mentor.id}`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_admin.token)
      .then((res)=> {
        unconcern_mentor = { ...unconcern_mentor, ...res.body.data };
        done();
      });
  });

  it(('Should login the unconcern mentor to update his payload in jwt'), (done)=> {
    request(server).post('/api/v2/auth/signin')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(unconcern_mentor)
      .end((err, res)=> {
        unconcern_mentor = { ...unconcern_mentor, ...res.body.data };
        done();
      });
  });


  it('Should return a status code 200 when mentor accept a session', (done)=> {
    request(server).patch(`/api/v2/sessions/${created_session.id}/accept`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_mentor.token)
      .end((err, res)=> {
        const { status } = res.body.data;

        created_session = { ...created_session, status };
        res.should.have.status(200);
        res.body.data.should.have.property('status').eql('accepted');

        done();
      });
  });


  it('Should return a status code 412 when session with sent sessionId is not found', (done)=> {
    request(server).patch('/api/v2/sessions/312/accept')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_mentor.token)
      .end((err, res)=> {
        res.should.have.status(412);
        res.body.error.should.be.a('string').eql('Session not found,create sessions');

        done();
      });
  });


  it('Should return a status code 400 when an unconcern mentor want to accept a mentorship request', (done)=> {
    request(server).patch(`/api/v2/sessions/${created_session.id}/accept`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', unconcern_mentor.token)
      .end((err, res)=> {
        res.should.have.status(400);
        res.body.error.should.be.a('string').eql('Session does not concern you');

        done();
      });
  });


  it('Should return a status code 409 when a mentor is trying to repeat the same operation', (done)=> {
    request(server).patch(`/api/v2/sessions/${created_session.id}/accept`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_mentor.token)
      .end((err, res)=> {
        res.should.have.status(409);
        res.body.error.should.be.a('string')
          .eql(`You can not do this operation : session status is ${created_session.status}`);

        done();
      });
  });


  it('Should return a status code 403 when an auth user is not a mentor', (done)=> {
    request(server).patch(`/api/v2/sessions/${created_session.id}/accept`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_3.token)
      .end((err, res)=> {
        res.should.have.status(403);
        res.body.error.should.be.a('string')
          .eql('Access forbiden,reserved for mentors');

        done();
      });
  });


  it('Should return status 401 if the token has been not sent', (done)=> {
    request(server).patch(`/api/v2/sessions/${created_session.id}/accept`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .end((err, res)=> {
        res.should.have.status(401);
        res.body.should.have.property('error').eql('Anauthorized,please login first');
        done();
      });
  });


  it('Should verify invalid token', (done)=> {
    request(server).patch(`/api/v2/sessions/${created_session.id}/accept`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', wrong_token)
      .end((err, res)=> {
        res.body.status.should.be.a('number').eql(500);
        res.body.error.should.be.a('string').eql('invalid token');
        done();
      });
  });


  it('Should verify malformed token', (done)=> {
    request(server).patch(`/api/v2/sessions/${created_session.id}/accept`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', 'badToken')
      .end((err, res)=> {
        res.body.status.should.be.a('number').eql(500);
        res.body.error.should.be.a('string').eql('jwt malformed');
        done();
      });
  });
});


describe('SessionController /PATCH reject session', ()=> {
  before((done)=> {
    request(server).post('/api/v2/sessions')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_mentee.token)
      .send(sessions.reject_session(user_mentor.id))
      .then((res)=> {
        created_session = res.body.data;
        done();
      });
  });


  it('Should return a status code 200 when mentor reject a session', (done)=> {
    request(server).patch(`/api/v2/sessions/${created_session.id}/reject`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_mentor.token)
      .end((err, res)=> {
        const { status } = res.body.data;

        Object.assign(created_session, { status });
        res.should.have.status(200);
        res.body.data.should.have.property('status').eql('rejected');

        done();
      });
  });


  it('Should return a status code 412 when session with sent sessionId is not found', (done)=> {
    request(server).patch('/api/v2/sessions/32/reject')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_mentor.token)
      .end((err, res)=> {
        res.should.have.status(412);
        res.body.error.should.be.a('string').eql('Session not found,create sessions');

        done();
      });
  });


  it('Should return a status code 400 when an unconcern mentor want to reject a mentorship request', (done)=> {
    request(server).patch(`/api/v2/sessions/${created_session.id}/reject`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', unconcern_mentor.token)
      .end((err, res)=> {
        res.should.have.status(400);
        res.body.error.should.be.a('string').eql('Session does not concern you');

        done();
      });
  });


  it('Should return a status code 409 when a mentor is trying to repeat the same operation', (done)=> {
    request(server).patch(`/api/v2/sessions/${created_session.id}/reject`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_mentor.token)
      .end((err, res)=> {
        res.should.have.status(409);
        res.body.error.should.be.a('string')
          .eql(`You can not do this operation : session status is ${created_session.status}`);

        done();
      });
  });


  it('Should return a status code 403 when an auth user is not a mentor', (done)=> {
    request(server).patch(`/api/v2/sessions/${created_session.id}/reject`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_3.token)
      .end((err, res)=> {
        res.should.have.status(403);
        res.body.error.should.be.a('string')
          .eql('Access forbiden,reserved for mentors');

        done();
      });
  });


  it('Should return status 401 if the token has been not sent', (done)=> {
    request(server).patch(`/api/v2/sessions/${created_session.id}/reject`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .end((err, res)=> {
        res.should.have.status(401);
        res.body.should.have.property('error').eql('Anauthorized,please login first');
        done();
      });
  });


  it('Should verify invalid token', (done)=> {
    request(server).patch(`/api/v2/sessions/${created_session.id}/reject`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', wrong_token)
      .end((err, res)=> {
        res.body.status.should.be.a('number').eql(500);
        res.body.error.should.be.a('string').eql('invalid token');
        done();
      });
  });


  it('Should verify malformed token', (done)=> {
    request(server).patch(`/api/v2/sessions/${created_session.id}/reject`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', 'badToken')
      .end((err, res)=> {
        res.body.status.should.be.a('number').eql(500);
        res.body.error.should.be.a('string').eql('jwt malformed');
        done();
      });
  });
});

describe('SessionController /GET sessions', ()=> {
  it('Should return an array of received mentorship sessions if the auth user is a mentor', (done)=> {
    request(server).get('/api/v2/sessions')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_mentor.token)
      .end((err, res)=> {
        res.should.have.status(200);
        res.body.data.should.be.an('array');

        done();
      });
  });


  it('Should return an array of sent mentorship sessions if the auth user is a mentee', (done)=> {
    request(server).get('/api/v2/sessions')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_mentee.token)
      .end((err, res)=> {
        res.should.have.status(200);
        res.body.data.should.be.an('array');
        done();
      });
  });


  it('Should return status 401 if the token has been not sent', (done)=> {
    request(server).get('/api/v2/sessions')
      .set('Content-type', 'application/json')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .end((err, res)=> {
        res.should.have.status(401);
        res.body.should.have.property('error').eql('Anauthorized,please login first');
        done();
      });
  });


  it('Should verify invalid token', (done)=> {
    request(server).get('/api/v2/sessions')
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
    request(server).get('/api/v2/sessions')
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


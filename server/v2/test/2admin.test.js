
import { should, use, request } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../index';
import data from './mockData';

should();
use(chaiHttp);

const {
  user1,
  user2,
  user3,
  user4,
} = data.users;
const { wrong_token } = data.other_token;


let user_admin1;
let user_admin2;
let user_normal;
let notAdmin_user;
let created_mentor;


describe('AdminController /PATCH user to admin', ()=> {
  before((done)=> {
    request(server).post('/api/v2/auth/signin')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(user1)
      .then((res)=> {
        user_admin1 = { ...user1, ...res.body.data };
      });

    request(server).post('/api/v2/auth/signin')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(user2)
      .then((res)=> {
        user_admin2 = { ...user1, ...res.body.data };
      });

    request(server).post('/api/v2/auth/signup')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(user3)
      .then((res)=> {
        user_normal = { ...user3, ...res.body.data };
      });

    request(server).post('/api/v2/auth/signup')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(user4)
      .then((res)=> {
        notAdmin_user = { ...user4, ...res.body.data };
        created_mentor = notAdmin_user;
        done();
      });
  });


  it('Should change a normal user to admin', (done)=> {
    const { id: normal_user_id, token: user_admin_token } = user_admin1;

    request(server).patch(`/api/v2/admin/${normal_user_id}`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_admin_token)
      .end((err, res)=> {
        const { data: resp_data } = res.body;

        user_admin1 = { ...user_admin1, resp_data };
        res.should.have.status(200);
        res.body.data.should.have.property('is_admin').eql(true);
        res.body.should.have.property('message').eql('Account changed to admin');
        done(err);
      });
  });


  it(('Should login the new admin user to update his payload in jwt'), (done)=> {
    request(server).post('/api/v2/auth/signin')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(user_admin1)
      .end((err, res)=> {
        user_admin1 = { ...user_admin1, ...res.body.data };
        res.should.have.status(200);
        res.body.data.should.have.property('token');
        done();
      });
  });


  it('Should return a code status 412 if corresponding user of the  sent user id is not found', (done)=> {
    request(server).patch('/api/v2/admin/10001')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_admin1.token)
      .end((err, res)=> {
        res.should.have.status(412);
        res.body.error.should.be.a('string').eql('user with the sent id not found');
        done();
      });
  });


  it('Should return status 401 if the token has been not sent', (done)=> {
    request(server).patch(`/api/v2/admin/${user_admin1.id}`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .end((err, res)=> {
        res.should.have.status(401);
        res.body.error.should.be.a('string').eql('Anauthorized,please login first');
        done();
      });
  });


  it('Should verify invalid token', (done)=> {
    request(server).patch(`/api/v2/admin/${user_admin1.id}`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', wrong_token)
      .end((err, res)=> {
        res.body.status.should.be.eql(500);
        res.body.error.should.be.a('string').eql('invalid token');
        done();
      });
  });


  it('Should verify malformed token', (done)=> {
    request(server).patch(`/api/v2/admin/${user_admin1.id}`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', 'badToken')
      .end((err, res)=> {
        res.body.status.should.be.a('number').eql(500);
        res.body.error.should.be.a('string').eql('jwt malformed');
        done();
      });
  });
});


describe('AdminController /PATCH admin to user', ()=> {
  before((done)=> {
    request(server).patch(`/api/v2/admin/${user_admin2.id}`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_admin1.token)
      .then((res)=> {
        Object.assign(user_admin2, res.body.data);
        done();
      });
  });


  it(('Should login the new admin user to update his payload in jwt'), (done)=> {
    request(server).post('/api/v2/auth/signin')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(user_admin2)
      .end((err, res)=> {
        user_admin2 = { ...user_admin2, ...res.body.data };
        res.should.have.status(200);
        res.body.data.should.have.property('token');

        done();
      });
  });


  it('Should change an admin user to a normal user', (done)=> {
    request(server).patch(`/api/v2/admin-to/${user_admin2.id}`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_admin1.token)
      .end((err, res)=> {
        user_admin1 = { ...user_admin1, ...res.body.data };
        res.should.have.status(200);
        res.body.data.should.have.property('is_admin').eql(false);
        res.body.should.have.property('message').eql('Account changed to user');
        done();
      });
  });

  it('Should return a code status 412 if corresponding user of the  sent user id is not found', (done)=> {
    request(server).patch('/api/v2/admin-to/10001')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_admin1.token)
      .end((err, res)=> {
        res.should.have.status(412);
        res.body.error.should.be.a('string').eql('user with the sent id not found');
        done();
      });
  });

  it('Should return a code status 403 if the user who is doing the action is not an admin', (done)=> {
    request(server).patch(`/api/v2/admin-to/${user_admin2.id}`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', notAdmin_user.token)
      .end((err, res)=> {
        res.should.have.status(403);
        res.body.error.should.be.a('string').eql('Access forbiden,reserved for admin');
        done();
      });
  });


  it('Should return status 401 if the token has been not sent', (done)=> {
    request(server).patch(`/api/v2/admin-to/${user_admin2.id}`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .end((err, res)=> {
        res.should.have.status(401);
        res.body.should.have.property('error').eql('Anauthorized,please login first');
        done();
      });
  });


  it('Should verify invalid token', (done)=> {
    request(server).patch(`/api/v2/admin-to/${user_admin2.id}`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', wrong_token)
      .end((err, res)=> {
        res.body.status.should.be.eql(500);
        res.body.error.should.be.a('string').eql('invalid token');
        done();
      });
  });


  it('Should verify malformed token', (done)=> {
    request(server).patch(`/api/v2/admin-to/${user_admin2.id}`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', 'badToken')
      .end((err, res)=> {
        res.body.status.should.be.a('number').eql(500);
        res.body.error.should.be.a('string').eql('jwt malformed');
        done();
      });
  });
});


describe('AdminController /PATCH user to mentor', ()=> {
  it('Should change a normal user to mentor', (done)=> {
    request(server).patch(`/api/v2/user/${user_normal.id}`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_admin1.token)
      .end((err, res)=> {
        created_mentor = { ...created_mentor, ...res.body.data };
        res.should.have.status(200);
        res.body.data.should.have.property('type').eql('mentor');
        res.body.should.have.property('message').eql('Account changed to mentor');
        done();
      });
  });


  it('Should return status 401 if the token has been not sent', (done)=> {
    const { id: normal_user_id } = user_normal;

    request(server).patch(`/api/v2/user/${normal_user_id}`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .end((err, res)=> {
        res.should.have.status(401);
        res.body.error.should.be.a('string').eql('Anauthorized,please login first');
        done();
      });
  });


  it('Should verify invalid token', (done)=> {
    request(server).patch(`/api/v2/user/${user_normal.id}`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', wrong_token)
      .end((err, res)=> {
        res.body.status.should.be.eql(500);
        res.body.error.should.be.a('string').eql('invalid token');
        done();
      });
  });


  it('Should verify malformed token', (done)=> {
    request(server).patch(`/api/v2/user/${user_normal.id}`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', 'badToken')
      .end((err, res)=> {
        res.body.status.should.be.a('number').eql(500);
        res.body.error.should.be.a('string').eql('jwt malformed');
        done();
      });
  });


  it('Should return an access forbiden if the user who changes is not an admin ', (done)=> {
    request(server).patch(`/api/v2/user/${user_normal.id}`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', notAdmin_user.token)
      .end((err, res)=> {
        res.should.have.status(403);
        res.body.error.should.be.a('string').eql('Access forbiden,reserved for admin');
        done();
      });
  });


  it('Should return status:412 if the id of the user to be changed was not found', (done)=> {
    request(server).patch('/api/v2/user/450')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_admin1.token)
      .end((err, res)=> {
        res.should.have.status(412);
        res.body.error.should.be.a('string').eql('user with the sent id not found');
        done();
      });
  });
});


describe('AdminController /PATCH mentor to user', ()=> {
  it('Should change a mentor to normal user', (done)=> {
    request(server).patch(`/api/v2/mentor/${created_mentor.id}`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_admin1.token)
      .end((err, res)=> {
        res.should.have.status(200);
        res.body.data.should.have.property('type').eql('user');
        done();
      });
  });


  it('Should return status 401 if the token has been not sent', (done)=> {
    request(server).patch(`/api/v2/admin-to/${user_admin2.id}`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .end((err, res)=> {
        res.should.have.status(401);
        res.body.should.have.property('error').eql('Anauthorized,please login first');
        done();
      });
  });


  it('Should verify invalid token', (done)=> {
    request(server).patch(`/api/v2/user/${user_normal.id}`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', wrong_token)
      .end((err, res)=> {
        res.body.status.should.be.eql(500);
        res.body.error.should.be.a('string').eql('invalid token');
        done();
      });
  });


  it('Should verify malformed token', (done)=> {
    request(server).patch(`/api/v2/user/${user_normal.id}`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', 'badToken')
      .end((err, res)=> {
        res.body.status.should.be.a('number').eql(500);
        res.body.error.should.be.a('string').eql('jwt malformed');
        done();
      });
  });


  it('Should return an access forbiden if the user who changes is not an admin', (done)=> {
    request(server).patch(`/api/v2/mentor/${user_normal.id}`)

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', notAdmin_user.token)
      .end((err, res)=> {
        res.should.have.status(403);
        res.body.error.should.be.a('string').eql('Access forbiden,reserved for admin');
        done();
      });
  });


  it('Should return status:412 if the id of the mentor to be changed was not found', (done)=> {
    request(server).patch('/api/v2/mentor/450')

      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('token', user_admin1.token)
      .end((err, res)=> {
        res.should.have.status(412);
        res.body.error.should.be.a('string').eql('user with the sent id not found');
        done();
      });
  });
});

/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../bin/www';

chai.should();
chai.use(chaiHttp);


describe('server', () => {
  it('should start the server successfully', done => {
    chai
      .request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it('Should return code status 404 for wrong URL', done => {
    chai
      .request(server)
      .get('/error-page4546876')
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
});


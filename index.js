import dotenv from 'dotenv';
import app from './server/app';

dotenv.config();


const server = app.listen(process.env.PORT, ()=> {
  console.log(`Server listening on port ${server.address().port}`);
});

export default server;

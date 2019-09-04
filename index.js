import app from './server/app';
import dotenv from 'dotenv';
dotenv.config();


const server=app.listen(process.env.PORT,()=>{
  console.log(`Server listening on port ${server.address().port}`);
});

export default server;
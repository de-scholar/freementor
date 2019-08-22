import app from '../app';
import dotenv from 'dotenv';
dotenv.config();


// eslint-disable-next-line no-undef
const server=app.listen(process.env.PORT,()=>{
  console.log(`Server listening on port ${server.address().port}`);
});

export default server;
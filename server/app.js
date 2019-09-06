import express from 'express';
import routers_V1 from './v1/routes/';
import swaggerUi from 'swagger-ui-express';
import docs from '../swagger.json';
import GeneralHelper from './v1/helpers/general';


const app=express();
const {response}=GeneralHelper;

app.get('/',(req,res)=> {
  return response(res,200,'Welcome');
  

});


app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(docs));


app.use(routers_V1);


app.use('*', (req, res, next)=> {
  return response(res,404,'Page not found');
});


app.use((err, req, res, next)=> {

  return response(res,500,err.message);
  
});

export default app;
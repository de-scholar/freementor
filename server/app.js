import express from 'express';
import routers_V1 from './v1/routes/';
import swaggerUi from 'swagger-ui-express';
import docs from '../swagger.json';



const app=express();


app.get('/',(req,res)=>{
  res.status(200).json({
    status:200,
  });
});


app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(docs));


app.use(routers_V1);


app.use('*', (req, res, next) => {
    
  const err = new Error('Route Not Found');
  err.status = 404;
  res.status(404).json({
    status:404,
    error:'Page not found'
  });

});


app.use((err, req, res, next) => {
  return res.json({
    status:500,
    error: err.message,
  });
  
  
});

export default app;
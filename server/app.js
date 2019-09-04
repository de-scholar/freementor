import express from 'express';
//import morgan from 'morgan';
import routers_V1 from './v1/routes/';
import swaggerUi from 'swagger-ui-express';
import docs from '../swagger.json';



const app=express();

//This will display all received requests in console
//app.use(morgan('dev'));




app.get('/',(req,res)=>{
  res.status(200).json({
    status:200,
    message:'Welcome'
  });
});

//intialize endpoint of api documatation  of vesrion 1
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(docs));

//built routes
app.use(routers_V1);

// catch 404 and forward to error handler
// eslint-disable-next-line no-unused-vars
app.use('*', (req, res, next) => {
    
  const err = new Error('Route Not Found');
  err.status = 404;
  res.status(404).json({
    status:404,
    error:'Page not found'
  });

});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  //console.log(err);
  return res.json({
    status:500,
    error: err.message,
  });
  
  
});

export default app;
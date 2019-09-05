import express from 'express';
//import morgan from 'morgan';
import routers_V1 from './v1/routes/';
import swaggerUi from 'swagger-ui-express';
import docs from '../swagger.json';
import GeneralHelper from './v1/helpers/general';


const app=express();
const {response}=GeneralHelper;


//This will display all received requests in console
//app.use(morgan('dev'));



app.get('/',(req,res)=>{
  return response(res,200,'Welcome');
});

//intialize endpoint of api documatation  of vesrion 1
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(docs));

//built routes
app.use(routers_V1);

// catch 404 and forward to error handler
// eslint-disable-next-line no-unused-vars
app.use('*', (req, res, next) => {
  return response(res,404,'Page not found');
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  
  return response(res,500,err.message);
  
});

export default app;
import express from 'express';
import morgan from 'morgan';


const app=express();

//This will display all received requests in console
app.use(morgan('dev'));


// catch 404 and forward to error handler
// eslint-disable-next-line no-unused-vars
app.use('*', (req, res, next) => {
   
  res.status(404).json({
    status:404,
    error:'Page not found'
  });
  
});

export default app;
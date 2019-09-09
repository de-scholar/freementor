import express from 'express';
import swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';
import routers_V1 from './v1/routes';
import routers_V2 from './v2/routes';
import docs from '../swagger.json';
import GeneralHelper from './v1/helpers/general';


const app = express();
const { response } = GeneralHelper;

app.use(bodyParser.urlencoded({
  extended: true,
}));

app.get('/', (req, res)=> response(res, 200, 'Welcome'));


app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(docs));


app.use(routers_V1);
app.use(routers_V2);

app.use('*', (req, res, next)=> response(res, 404, 'Page not found'));


app.use((err, req, res, next)=> {
  // console.log(err);
  response(res, 500, err.message);
});

export default app;

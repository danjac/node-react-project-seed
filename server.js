import dotenv from 'dotenv';
import koa from 'koa';
import configure from './config';

dotenv.load();

const app = koa();
configure(app);

// run server

const port = process.env.PORT || 5000;
console.log("Running on port", port);
app.listen(port);

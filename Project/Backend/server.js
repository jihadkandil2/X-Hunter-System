import path from 'node:path'
import * as dotenv from 'dotenv'
import bootstrap from './src/app.controller.js'
import axios from 'axios'
import express from 'express'

dotenv.config({path:path.join('./src/config/.env.dev')})
const app=express();
const port =process.env.PORT;
console.log(port);

bootstrap(app , express)

app.listen(port , ()=>{console.log(`listening on ${port}`);
})
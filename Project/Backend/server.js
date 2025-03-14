import path from 'node:path'
import * as dotenv from 'dotenv'
import bootstrap from './src/app.controller.js'
import axios from 'axios'
import express from 'express'

dotenv.config({ path: path.resolve('.env') });
// for depugging purposes:
console.log("✅ .env loaded");
console.log("🔍 MONGODB_URI:", process.env.MONGODB_URI);
console.log("🔍 PORT:", process.env.PORT);

const app=express();
const port =process.env.PORT;
console.log(port);

bootstrap(app , express)
console.log("🔍 MONGODB_URI from process.env:", process.env.MONGODB_URI);
app.listen(port , ()=>{console.log(`listening on ${port}`);
})
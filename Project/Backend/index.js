import bootstrap from './src/app.controller.js'
import express from 'express'

const app=express();
const port =3000;

bootstrap(app , express)

app.listen(port , ()=>{console.log(`listening on ${port}`);
})
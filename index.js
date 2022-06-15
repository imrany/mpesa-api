const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const bodyParser=require('body-parser')

//connect to momgodb
/*mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    //listening to server
    const port=process.env.PORT||3000;
    app.listen(port,()=>{
        console.log(`Server opening at Port ${port}`)
    })
}).catch(err=>console.log(err));
mongoose.Promise=global.Promise*/
 
//bodyparser middleware
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));
//router middleware
app.use('/api', require('./router/api'))
 
//listening to server
const port=process.env.PORT||3000;
app.listen(port,()=>{
    console.log(`Server opening at Port ${port}`)
})


const express = require('express');
const mongoose = require('mongoose');
const bodyParser=require('body-parser');
const cors=require('cors');
require('dotenv').config();
const app = express();
 
//bodyparser middleware
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
//router middleware
app.use('/api', require('./router/api'))
 
//connect to momgodb
mongoose.set('strictQuery', false);
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    //listening to server
    const port=process.env.PORT||5000;
    app.listen(port,()=>{
        console.log(`Server opening at Port ${port}`)
    })
}).catch(err=>console.log(err));
mongoose.Promise=global.Promise;


const datetime=require('node-datetime');
const axios= require('axios');
const Transaction=require('../models/transactions');
require('dotenv').config();

const passkey=process.env.PASSKEY;
const shortcode=process.env.BUSINESSSHORTCODE;
const consumerkey=process.env.CONSUMERKEY;
const consumersecret=process.env.CONSUMERSECRET;

//to generate password
const newPassword=()=>{
    const dt=datetime.create();
    const formated=dt.format('YmdHMS');
    const passString=shortcode + passkey + formated;
    const base64string=Buffer.from(passString).toString('base64')
    return base64string;
}

const mpesaPassword=(req,res)=>{
    res.send({'password':newPassword()})
}

//token
const token=(req,res,next)=>{
    const url= 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
    const auth= 'Basic ' + Buffer.from(consumerkey +':'+ consumersecret).toString('base64'); 
    const headers={ 
        Authorization: auth 
    };
    axios.get(url,{
        headers:headers
    }).then((response)=>{
        let data=response.data;
        let access_token=data.access_token;
        req.token=access_token;
        next();
    })
    .catch(err=>res.send({error:err.message}));
}

//stk push
const stkPush=(req,res)=>{
 const token=req.token;
 const dt=datetime.create();
 const formated=dt.format('YmdHMS');
 const headers={
    Authorization:'Bearer '+token
 };
 const stkURL='https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
 let data={
    "BusinessShortCode": shortcode,//for Till use store number
    "Password": newPassword(),
    "Timestamp": formated,
    "TransactionType": "CustomerPayBillOnline",//for Till use -> CustomerBuyGoodsOnline
    "Amount": 1,
    "PartyA": 254703733399,
    "PartyB": shortcode,
    "PhoneNumber": 254703733399,
    "CallBackURL": "https://mydomain.com/path", //A CallBack URL is a valid secure URL that is used to receive notifications from M-Pesa API. It is the endpoint to which the results will be sent by M-Pesa API.
    "AccountReference": "Imran's Company",
    "TransactionDesc": "Lipa na M-PESA" 
 };
 axios.post(stkURL,data,{
    headers:headers
 }).then(response=>
    res.send(response.data)
    )
}

//callback 
const callBack=async(req,res)=>{
    try {
        const stored=await Transaction.create(...req.body);
        if(stored){
            res.send({msg:"Call back data stored"},req.body)
        }else{
            res.send({error:"Not stored"},req.body)
        }
    } catch (error) {
        res.status(500).send({error:error.message})
    }
}


module.exports={
    mpesaPassword,
    token,
    stkPush,
    callBack
}
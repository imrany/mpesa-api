const datetime=require('node-datetime');
const axios= require('axios');
const Transaction=require('../models/transactions');
require('dotenv').config();

const passkey=process.env.PASSKEY;
const shortcode=process.env.BUSINESSSHORTCODE;
const consumerkey=process.env.CONSUMERKEY;
const consumersecret=process.env.CONSUMERSECRET;
const callBack_Url=process.env.CALLBACK_URL;
const accountRef=process.env.ACCOUNT_REF;
const transactionsDesc=process.env.TRANSACTION_DESC;

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
 const {phoneNumber,amount}=req.body;
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
    "Amount": amount,
    "PartyA": `254${phoneNumber}`, //254703730090
    "PartyB": shortcode,
    "PhoneNumber": `254${phoneNumber}`, //254703730090
    "CallBackURL": callBack_Url, 
    "AccountReference": accountRef,
    "TransactionDesc": transactionsDesc
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
        const {MerchantRequestID,ResultCode,ResultDesc,CallbackMetadata}=req.body.Body.stkCallback;
        if(CallbackMetadata){
            const stored=await Transaction.create({
                MerchantRequestID,
                ResultCode,
                ResultDesc,
                amount:CallbackMetadata.Item[0].Value,
                MpesaReceiptNo:CallbackMetadata.Item[1].Value,
                TransactionDate:CallbackMetadata.Item[3].Value,
                PhoneNumber:CallbackMetadata.Item[4].Value
            });

              res.send({msg:"Recieved"})
              console.log({msg:"Transaction process was successfull"},stored)
        }else{
            res.send({msg:"Recieved"})
            console.log({msg:"Transaction process was cancelled"},req.body)
        }
    } catch (error) {
        res.status(500).send({error:error.message})
    }
}

//get transactions
const getTransaction=async(req,res)=>{
    try {
        const transc=await Transaction.find({});
        res.send({msg:"transaction data", transc})
    } catch (error) {
        res.status(500).send({error:error.message})
    }
}

module.exports={
    mpesaPassword,
    token,
    stkPush,
    callBack,
    getTransaction
}
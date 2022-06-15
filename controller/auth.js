require('dotenv').config();
const datetime=require('node-datetime');
const axios= require('axios')
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
        //console.log(response.data)
        let data=response.data;
        let access_token=data.access_token;
        req.token=access_token;
        next();
    })
    .catch(err=>console.log(err));
}

//stk push
const stkPush=(req,res)=>{
 //res.send('Done!')
 const token=req.token;
 const dt=datetime.create();
 const formated=dt.format('YmdHMS');
 const headers={
    Authorization:'Bearer '+token
 };
 const stkURL='https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
 let data={
    "BusinessShortCode": 174379,
    "Password": newPassword(),
    "Timestamp": formated,
    "TransactionType": "CustomerPayBillOnline",
    "Amount": 1,
    "PartyA": 254703733399,
    "PartyB": 174379,
    "PhoneNumber": 254703733399,
    "CallBackURL": "https://mydomain.com/path",
    "AccountReference": "Imran's Company",
    "TransactionDesc": "Lipa na M-PESA" 
 };
 axios.post(stkURL,data,{
    headers:headers
 }).then(response=>
    res.send(response.data)
    )
// res.send(token)
}


module.exports={
    mpesaPassword,
    token,
    stkPush
}
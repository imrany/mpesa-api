# mpesa api
This is mpesa api using the mpesa [daraja api
](https://developer.safaricom.co.ke/).

## Run it locally
Fork this repository to your github account, then clone it
```bash
git clone https://github.com/imrany/mpesa-api.git
```
Install dependencies
```bash
npm install
``` 

## Generate a token

In order to send request to the daraja api you need to generate a token.
- you need to create a developer account in [daraja](https://developer.safaricom.co.ke).
- create a sandbox app at [my apps](https://developer.safaricom.co.ke/MyApps).
- get the test credentials of the sandbox app you've created.
- store the test credentials in an `.env` file in your project, check [.env.sample](./.env.sample).
- generate a token by converting the `consumer key`:`consumer secret` to base64 encode string.
-send a request to `https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials` as the `consumer key`:`consumer secret` base64 encode string is the Basic  headers Authorization.

```javascript
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
        console.log(access_token);
    })
    .catch(err=>console.log(err.message));
```

## Send an stk push to the customer
After you've got the token, you can now send a stk push to a customer using this link
`https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest`


```javascript
const token=req.token;
 const dt=datetime.create();
 const formated=dt.format('YmdHMS');
 const headers={
    Authorization:'Bearer '+token
 };
 const stkURL='https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
 let data={
    "BusinessShortCode": shortcode,
    "Password": newPassword(),
    "Timestamp": formated,
    "TransactionType": "CustomerPayBillOnline",
    "Amount": 1,
    "PartyA": 254700000000,
    "PartyB": shortcode,
    "PhoneNumber": 254700000000,
    "CallBackURL": "https://mydomain.com/path",
    "AccountReference": "Testing",
    "TransactionDesc": "Lipa na M-PESA" 
 };
 axios.post(stkURL,data,{
    headers:headersckoutRequestID": "ws_CO_1912201
 })
 .then(response=>res.send(response.data))
```

Once your API request is received, authorized and authenticated, you will receive the response below.
```json
{    
   "MerchantRequestID": "29115-34620561-1",    
   "CheckoutRequestID": "ws_CO_191220191020363925",    
   "ResponseCode": "0",    
   "ResponseDescription": "Success. Request accepted for processing",    
   "CustomerMessage": "Success. Request accepted for processing"
}
```


## callback url
Response sent to the secure callback url is the transaction is successful.
The CallBack URL should be a valid secure URL that can be used to receive notifications from M-Pesa API. It's the endpoint to which the results will be sent by M-Pesa API.
```json
{    
   "Body": {        
      "stkCallback": {            
         "MerchantRequestID": "29115-34620561-1",            
         "CheckoutRequestID": "ws_CO_191220191020363925",            
         "ResultCode": 0,            
         "ResultDesc": "The service request is processed successfully.",            
         "CallbackMetadata": {                
            "Item": [{                        
               "Name": "Amount",                        
               "Value": 1.00                    
            },                    
            {                        
               "Name": "MpesaReceiptNumber",                        
               "Value": "NLJ7RT61SV"                    
            },                    
            {                        
               "Name": "TransactionDate",                        
               "Value": 20191219102115                    
            },                    
            {                        
               "Name": "PhoneNumber",                        
               "Value": 254708374149                    
            }]            
         }        
      }    
   }
}
```
Whenever you receive an error in your callback url, the unsuccessful transaction will have a body results as below and the details of the error will be captured under the Items ResultCode and ResultDesc; Click here to see the list of possible Lipa na M-PESA online errors
```json
{    
   "Body": {
      "stkCallback": {
         "MerchantRequestID": "29115-34620561-1",
         "CheckoutRequestID": "ws_CO_191220191020363925",
         "ResultCode": 1032,
         "ResultDesc": "Request cancelled by user."
      }
   }
}
```

## .env.sample
Contains the environment variable needed to run this project
```
PASSKEY=
BUSINESSSHORTCODE=
CONSUMERKEY=
CONSUMERSECRET=
DATABASE=
CALLBACK_URL=
ACCOUNT_REF=
TRANSACTION_DESC=
``` 
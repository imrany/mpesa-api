# mpesa api
This is mpesa api using the mpesa [daraja api
](https://developer.safaricom.co.ke/).

## Generate a token

In order to send request to the daraja api you need to generate a token.
- you need to create a developer account in [daraja](https://developer.safaricom.co.ke).
- create a sandbox app at [my apps](https://developer.safaricom.co.ke/MyApps).
- get the test credentials of the sandbox app you've created.
- store the test credentials in an `.env` file in your project.
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
    headers:headers
 })
 .then(response=>res.send(response.data))
```

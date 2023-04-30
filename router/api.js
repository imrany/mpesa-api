const express=require('express')
const router=express.Router();
const auth=require('../controller/auth')

//stk push route
router.post('/stkpush',auth.token,auth.stkPush);
// callback route
router.post('/callback',auth.callBack);
//get transaction
router.get("/transaction", auth.getTransaction)
module.exports=router;
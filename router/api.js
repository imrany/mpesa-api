const express=require('express')
const router=express.Router();
const auth=require('../controller/auth')

//pasword route
router.get('/password',auth.mpesaPassword);
//stk push route
router.post('/stk/push',auth.token,auth.stkPush);
module.exports=router;
const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const itemSchema=new Schema({
    Item:{
        Name:String,
        Amount:String
    }
});

const transactionSchema=new Schema({
    stkCallBack:{
        MerchantRequestID:String,
        CheckoutRequestID:String,
        ResultCode:Number,
        ResultDesc:String,
        CallbackMetadata:itemSchema,
    }
},{
    timestamps:true
})

const transactionModel=mongoose.model('transaction',transactionSchema);
module.exports=transactionModel;
const mongoose=require('mongoose');

// MerchantRequestID,
// ResultCode,
// ResultDesc,
// amount:CallbackMetadata.Item[0].Value,
// MpesaReceiptNo:CallbackMetadata.Item[1].Value,
// TransactionDate:CallbackMetadata.Item[2].Value,
// PhoneNumber:CallbackMetadata.Item[3].Value

const transactionSchema=mongoose.Schema({
        MerchantRequestID:{
            type:String,
            require:true
        },
        ResultCode:{
            type:Number,
            require:true
        },
        ResultDesc:{
            type:String,
            require:true
        },
        amount:{
            type:Number,
            require:true
        },
        MpesaReceiptNo:{
            type:String,
            require:true,
            unique:true
        },
        TransactionDate:{
            type:Number,
            require:true
        },
        PhoneNumber:{
            type:Number,
            require:true
        }
},{
    timestamps:true
})

const transactionModel=mongoose.model('transaction',transactionSchema);
module.exports=transactionModel;
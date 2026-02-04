const mongoose = require("mongoose");
const account = require("../db");

const TransferFund = async(fromAccountId, toAccountId,amount)=>{
    //decrement the balance of the fromAccountId
    await account.findByIdAndUpdate(fromAccountId,{$inc:{balance:-amount}});

    //increment the balance of the toAccountId
    await account.findByIdAndUpdate(toAccountId,{$inc:{balance:amount}});

}
module.exports = {TransferFund};
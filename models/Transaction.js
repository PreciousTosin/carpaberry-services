const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: Number,
  payMethod: String,
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = { Transaction, transactionSchema };

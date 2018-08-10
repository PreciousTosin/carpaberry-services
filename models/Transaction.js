const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionRef: String,
  amount: Number,
  payMethod: String,
  currency: String,
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;

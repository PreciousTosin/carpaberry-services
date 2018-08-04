const mongoose = require('mongoose');
const { transactionSchema } = require('./Transaction');

function sumObjValues(obj) {
  let sum = 0;
  for (const el of obj) {
    if (Object.prototype.hasOwnProperty.call(obj, el)) {
      sum += parseFloat(obj[el]);
    }
  }
  return sum;
}

const orderSchema = new mongoose.Schema({
  regularWear: Number,
  underwear: Number,
  largeItems: Number,
  cost: {
    regularWear: Number,
    underwear: Number,
    largeItems: Number,
    totalCost: Number,
  },
  paymentStatus: Number,
  transactionInfo: transactionSchema,
}, { timestamps: true });

orderSchema.methods.getCost = function cost() {
  const reg = this.regularWear * 40;
  const und = this.underwear * 20;
  const lag = this.largeItems * 100;
  return {
    regularWear: reg,
    underwear: und,
    largeItems: lag,
  };
};

orderSchema.methods.getTotalCost = function totalCost() {
  const costObj = this.getCost();
  const sum = costObj.regularWear + costObj.underwear + costObj.largeItems;
  // return sumObjValues(costObj);
  return sum;
};

const Order = mongoose.model('Order', orderSchema);
module.exports = { orderSchema, Order };

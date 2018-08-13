const Transaction = require('../models/Transaction');
const Order = require('../models/Order');
const { verifyRavePayment } = require('./raveapi');

exports.verifyTransaction = (req, res) => {
  const { txref } = req.query;
  verifyRavePayment(txref).then((respData) => {
    const {
      txref, paymenttype, chargedamount, custemail, acctcountry
    } = respData;
    const transactObj = {
      txref,
      paymenttype,
      chargedamount,
      custemail,
      acctcountry,
    };
    console.log(transactObj);
    // create transaction record
    Transaction.create({
      transactionRef: txref,
      amount: chargedamount,
      payMethod: paymenttype,
      currency: acctcountry,
    }, (err) => {
      if (err) console.log(err);
      // find order paid for and update payment status
      Order.findOne({ transactionRef: txref }, (err, order) => {
        order.paymentStatus = true;
        order.orderStatus = 'processing';
        order.save((err) => {
          if (err) console.log(err);
          res.json(respData);
        });
      });
    });
  })
    .catch(err => console.log(err));
};

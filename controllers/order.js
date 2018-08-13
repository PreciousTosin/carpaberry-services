const Order = require('../models/Order');
const User = require('../models/User');
const { sendRaveTransaction } = require('./raveapi');

exports.getOrder = (req, res) => {
  /* if (req.user) {
    return res.redirect('/');
  } */
  res.render('order/order', {
    title: 'Order'
  });
};

exports.getSummary = (req, res) => {
  /* if (req.user) {
    return res.redirect('/');
  } */
  const { orderId } = req.query;
  // const orderId = '5b68e51735e65f24ee8a10f5';
  Order.findOne({ _id: orderId }, (err, order) => {
    if (err) console.log(err);
    res.render('order/order-summary', {
      title: 'Order-Summary',
      data: order,
    });
  });
};

exports.postSummary = (req, res) => {
  /* if (req.user) {
    return res.redirect('/');
  } */
  const txRef = 'MC-1520443531495';
  const {
    orderId,
    email,
    phone,
    paymentMethod,
    regularWear,
    underWear,
    largeItems,
    regularWearCost,
    underWearCost,
    largeItemsCost,
    totalCost
  } = req.body;
  console.log(orderId);
  Order.findOne({ _id: orderId }, (err, order) => {
    order.regularWear = regularWear;
    order.underWear = underWear;
    order.largeItems = largeItems;
    order.cost.regularWear = regularWearCost;
    order.cost.underWear = underWearCost;
    order.cost.largeItems = largeItemsCost;
    order.cost.totalCost = totalCost;
    order.transactionRef = txRef;
    order.cost.orderStatus = 'posted';
    order.save((err) => {
      if (!err) {
        console.log('Order Sent', order);
        const payload = {
          txRef,
          email,
          phone,
          paymentMethod,
          totalCost,
        };
        sendRaveTransaction(payload)
          .then(link => res.redirect(303, link))
          .catch(err => console.log(err));
      }
      console.log(err);
    });
  });
};

exports.getTestOrders = (req, res) => {
  const id = '5b68e51735e65f24ee8a10f5';
  Order.findOne({ _id: id }, (err, order) => {
    if (err) console.log(err);
    console.log('Order Sent', order);
    const { _id, ...others } = order;
    res.json({
      ID: _id,
      data: others,
    });
  });
};

// eslint-disable-next-line no-unused-vars
function calcCost(payload) {
  const regularWear = payload.regularWear * 40;
  const underWear = payload.underWear * 20;
  const largeItems = payload.largeItems * 100;
  const totalCost = regularWear + underWear + largeItems;
  return {
    regularWear,
    underWear,
    largeItems,
    totalCost
  };
}

exports.postOrder = (req, res, next) => {
  // res.redirect(303, '/summary');
  const total = calcCost(req.body);
  Order.create({
    regularWear: req.body.regularWear,
    underWear: req.body.underWear,
    largeItems: req.body.largeItems,
    cost: {
      regularWear: total.regularWear,
      underWear: total.underWear,
      largeItems: total.largeItems,
      totalCost: total.totalCost,
    },
    paymentStatus: false,
  }, (err, order) => {
    User.findOne({ email: req.body.email }, (err, existingUser) => {
      if (err) { return next(err); }
      if (existingUser) {
        existingUser.orders.push(order);
        existingUser.save((err, data) => {
          if (err) console.log(err);
          else {
            console.log(data);
            console.log(order._id);
            const redirectUrl = `/summary/?orderId=${order._id}`;
            res.redirect(303, redirectUrl);
          }
        });
      }
    });
  });
};

const request = require('request-promise');
const Order = require('../models/Order');
const User = require('../models/User');

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
  const {
    _id,
    regularWear,
    underWear,
    largeItems,
    regularWearCost,
    underWearCost,
    largeItemsCost,
    totalCost
  } = req.body;
  console.log(_id);
  Order.findOne({ _id }, (err, order) => {
    order.regularWear = regularWear;
    order.underWear = underWear;
    order.largeItems = largeItems;
    order.cost.regularWear = regularWearCost;
    order.cost.underWear = underWearCost;
    order.cost.largeItems = largeItemsCost;
    order.cost.totalCost = totalCost;
    order.cost.orderStatus = 'posted';
    console.log('Order Sent', order);
    const query = {
      method: 'post',
      url: '/api/rave',
      body: {
        email: req.body.email,
        customerPhone: req.body.phone,
        orderId: _id,
        totalCost,
      }
    };
    request(query).then((response) => {
      console.log(response);
    }).catch(err => console.log(err));
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

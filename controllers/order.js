const { Order } = require('../models/Order');
const User = require('../models/User');
const raveApi = require('./raveapi');

exports.getOrder = (req, res) => {
  /* if (req.user) {
    return res.redirect('/');
  } */
  /* raveApi.chargeCard().then((err, response) => {
    if (err) console.log(err);
    console.log(response);
    res.render('order/order', {
      title: 'Order'
    });
  }); */
  raveApi.chargeAccount().then((err, response) => {
    if (err) console.log(err);
    console.log(response);
    res.render('order/order', {
      title: 'Order'
    });
  });
  /* res.render('order/order', {
    title: 'Order'
  }); */
};

exports.getSummary = (req, res) => {
  /* if (req.user) {
    return res.redirect('/');
  } */
  const { orderId } = req.query;
  Order.findOne({ id: orderId }, (err, order) => {
    res.render('order/order-summary', {
      title: 'Order-Summary',
      data: order,
    });
  });
};

function calcCost(payload) {
  const regularWear = payload.regularWear * 40;
  const underwear = payload.underWear * 20;
  const largeItems = payload.largeItems * 100;
  const totalCost = regularWear + underwear + largeItems;
  return { regularWear, underwear, totalCost };
}

exports.postOrder = (req, res, next) => {
  const total = calcCost(req.body);
  Order.create({
    regularWear: req.body.regularWear,
    underwear: req.body.underWear,
    largeItems: req.body.largeItems,
    cost: {
      regularWear: total.regularWear,
      underwear: total.underWear,
      largeItems: total.largeItems,
      totalCost: total.totalCost,
    },
    paymentStatus: 0,
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
            chargeCard().then((err, response) => {
              const ID = order._id;
              const redirectUrl = `/summary/?orderId=${ID}`;
              res.redirect(303, redirectUrl);
              console.log(response);
            });
          }
        });
      }
    });
  });
};

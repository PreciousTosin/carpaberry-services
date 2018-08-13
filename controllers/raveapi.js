const Ravepay = require('ravepay');
const Promise = require('bluebird');
const request = require('request-promise');

/**
 * RaveResponse:{ status: 'success',
  message: 'Hosted Link',
  data:
   { link: 'https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/hosted_pay/ba88204875dc583d93b6' } }
 */

exports.callRaveApi = (req, res) => {
  const query = {
    method: 'POST',
    uri: 'https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/v2/hosted/pay',
    body: {
      txref: 'MC-1520443531487',
      PBFPubKey: process.env.RAVE_PUBLICK_KEY, // -> uri + '?access_token=xxxxx%20xxxxx'
      customer_email: 'precioustosin@hotmail.com',
      amount: 1000,
      currency: 'NGN',
      redirect_url: `${process.env.BASE_URL}/api/rave/pay-processing`,
    },
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
  };

  request(query)
    .then((response) => {
      if (response.status === 'success') {
        const { link } = response.data;
        return link;
      }
    })
    .then((link) => {
      // console.log('Payment Link: ', link);
      res.redirect(303, link);
    })
    .catch((err) => {
      // API call failed...
      console.log('Rave Error: ', err);
    });
};

/**
* Handler to send payment transaction to Rave hosted api and save
* transaction reference in order document
*/

exports.sendRaveTransaction = payload =>
  // const txref = 'MC-1520443531494';
  new Promise((resolve, reject) => {
    const query = {
      method: 'POST',
      uri: 'https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/v2/hosted/pay',
      body: {
        txref: payload.txRef,
        PBFPubKey: process.env.RAVE_PUBLICK_KEY, // -> uri + '?access_token=xxxxx%20xxxxx'
        customer_email: payload.email,
        customer_phone: payload.phone,
        amount: payload.totalCost,
        payment_method: payload.paymentMethod,
        currency: 'NGN',
        redirect_url: `${process.env.BASE_URL}/verify-payment`,
      },
      headers: {
        'User-Agent': 'Request-Promise'
      },
      json: true
    };

    // send payment request to Rave payment endpoint
    request(query)
      .then((response) => {
        if (response.status === 'success') {
          const { link } = response.data;
          return link;
        }
      })
      .then((link) => {
        console.log('Payment Link: ', link);
        console.log('Payment Link Type: ', typeof (link));
        resolve(link);
        // res.redirect(303, link);
      })
      .catch((err) => {
        // API call failed...
        console.log('Rave Error: ', err);
        reject(err);
      });
  });

exports.getRaveTransactionStatus = (req, res) => {
  res.json(req.query);
};

/**
 * Handler to verify payment status to Rave hosted api and save
 * transaction data, modify paymentStatus and OrderStatus
 * in the order document
 */

exports.verifyRavePayment = payload =>
  new Promise((resolve, reject) => {
    const query = {
      method: 'POST',
      uri: 'https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/xrequery',
      body: {
        SECKEY: process.env.RAVE_SECRET_KEY,
        txref: payload,
        include_payment_entity: 1,
      },
      headers: {
        'User-Agent': 'Request-Promise'
      },
      json: true
    };

    request(query)
      .then((response) => {
        if (response.status === 'success') {
          const respData = response.data.status ? response.data : response.data[0];
          if (!respData) {
            console.log('Error in payment response');
          } else {
            resolve(respData);
          }
        }
      })
      .catch((err) => {
        console.log('Rave Error', err);
        reject(err);
      });
  });


/* TEST CONTROLLERS */

exports.sendTestRaveTransaction = (req, res) => {
  const txref = 'MC-1520443531494';
  const query = {
    method: 'POST',
    uri: 'https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/v2/hosted/pay',
    body: {
      txref,
      PBFPubKey: process.env.RAVE_PUBLICK_KEY, // -> uri + '?access_token=xxxxx%20xxxxx'
      customer_email: req.body.email,
      customer_phone: req.body.customerPhone,
      amount: req.body.totalCost,
      payment_method: req.body.paymentMethod,
      currency: 'NGN',
      redirect_url: `${process.env.BASE_URL}/api/rave/pay-processing`,
    },
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
  };

  request(query)
    .then((response) => {
      if (response.status === 'success') {
        const { link } = response.data;
        return link;
      }
    })
    .then((link) => {
      console.log('Payment Link: ', link);
      console.log('Payment Link Type: ', typeof (link));
      res.redirect(303, link);
    })
    .catch((err) => {
      // API call failed...
      console.log('Rave Error: ', err);
    });
};

exports.verifyTestRavePayment = (req, res, next) => {
  const { txref } = req.query;
  const payload = {
    method: 'POST',
    uri: 'https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/xrequery',
    body: {
      SECKEY: process.env.RAVE_SECRET_KEY,
      txref,
      include_payment_entity: 1,
    },
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
  };
  // res.json({ flwref, txref });

  request(payload)
    .then((response) => {
      if (response.status === 'success') {
        const respData = response.data.status ? response.data : response.data[0];
        if (!respData) {
          console.log('Error in payment response');
          next();
        } else {
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
          res.json(response);
        }
      }
    })
    .catch((err) => {
      console.log('Rave Error', err);
    });
};

/**
* Using Raves's NodeJs SDK Code for payment
*/

const rave = new Ravepay(process.env.RAVE_PUBLICK_KEY, process.env.RAVE_SECRET_KEY, false);

const payload = {
  cardno: '5438898014560229',
  cvv: '789',
  expirymonth: '07',
  expiryyear: '18',
  currency: 'NGN',
  pin: '7552',
  country: 'NG',
  amount: '10',
  email: 'user@example.com',
  phonenumber: '1234555',
  suggested_auth: 'PIN',
  firstname: 'user1',
  lastname: 'user2',
  IP: '355426087298442',
  txRef: 'MC-7663-YU',
  device_fingerprint: '69e6b7f0b72037aa8428b70fbe03986c'
};

const payload3 = {
  accountnumber: '0690000004',
  accountbank: '044',
  currency: 'NGN',
  country: 'NG',
  amount: '10',
  email: 'user@example.com',
  phonenumber: '08056552980',
  firstname: 'temi',
  lastname: 'desola',
  IP: '355426087298442',
  txRef: '',
  device_fingerprint: '69e6b7f0b72037aa8428b70fbe03986c'
};

exports.chargeAccount = () => new Promise((resolve, reject) => {
  rave.Account.charge(payload3).then(resp => resolve(resp.body))
    .catch((err) => {
      // Handle error
      console.log(err);
      reject(err);
    });
});

// eslint-disable-next-line no-unused-vars
function chargeCard() {
  return new Promise((resolve, reject) => {
    Promise.all([
      rave.Card.charge(payload).then((resp) => {
        let response = '';
        if (resp.body && resp.body.data && resp.body.data.flwRef) {
          response = resp.body.data.flwRef;
        } else {
          response = new Error("Couldn't get response, this is being fixed");
          throw response;
        }
        console.log(response);
        return response;
      })
        .catch((err) => {
          console.log('P: ', err.message);
        })
    ]).spread((ref) => {
      if (ref === undefined) {
        const errResponse = new Error("Couldn't get transaction reference");
        throw errResponse;
      }
      console.log('this is ref: ', ref);
      const payload2 = {
        PBFPubKey: process.env.RAVE_PUBLICK_KEY,
        transaction_reference: ref,
        otp: '12345'
      };
      rave.Card.validate(payload2).then(resp => resp.body)
        .then(response => resolve(response))
        .catch(err => reject(err));
    });
  });
}

/* exports.callRaveApi = (req, res) => {
  chargeCard().then((err, response) => {
    if (err) console.log(err);
    console.log(response);
    res.send({ data: 'Rave Call Made' });
  });
}; */

/* module.exports = function chargeCard() {
  return new Promise((resolve, reject) => {
    Promise.all([
      rave.Card.charge(payload).then((resp) => {
        let response = '';
        if (resp.body && resp.body.data && resp.body.data.flwRef) {
          response = resp.body.data.flwRef;
        } else {
          response = new Error("Couldn't get response, this is being fixed");
          throw response;
        }

        return response;
      })
        .catch((err) => {
          console.log('P: ', err.message);
        })
    ]).spread((ref) => {
      console.log('this is ref: ', ref);
      const payload2 = {
        PBFPubKey: process.env.RAVE_PUBLICK_KEY,
        transaction_reference: ref,
        otp: '12345'
      };
      rave.Card.validate(payload2).then(resp => resp.body)
        .then(response => resolve(response))
        .catch(err => reject(err));
    });
  });
}; */

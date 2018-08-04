const Ravepay = require('ravepay');
const Promise = require('bluebird');

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

exports.chargeAccount = () => {
  return new Promise((resolve, reject) => {
    rave.Account.charge(payload3).then(resp => resolve(resp.body))
      .catch((err) => {
        // Handle error
        console.log(err);
        reject(err);
      });
  });
};

exports.chargeCard = () => {
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
};

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

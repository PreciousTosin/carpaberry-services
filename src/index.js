import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/scss/fa-brands.scss';
import '@fortawesome/fontawesome-free/scss/fa-regular.scss';
import '@fortawesome/fontawesome-free/scss/fa-solid.scss';
import '../public/css/main.scss';
import '../public/css/main-style.css';

const $ = require('jquery');

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

function handleSummaryCost() {
  const payload = {
    regularWear: document.querySelector('#regWear').value,
    underWear: document.querySelector('#undWear').value,
    largeItems: document.querySelector('#lagItems').value,
  };
  const costObj = calcCost(payload);
  document.querySelector('#regWearCost').value = costObj.regularWear;
  document.querySelector('#undWearCost').value = costObj.underWear;
  document.querySelector('#lagItemsCost').value = costObj.largeItems;
  document.querySelector('#totalCost').value = costObj.totalCost;
}

$(document).ready(() => {
  console.log('Place JavaScript code here and there and over threre...');
  document.querySelector('#menu').addEventListener('click', (e) => {
    console.log('ICON CLICKED!');
    document.querySelector('#sidenav').classList.toggle('open');
    document.querySelector('#list').classList.toggle('disable--list');
    document.querySelector('#drawer').classList.toggle('shift--brand');
    e.stopPropagation();
  });
  const inputElement = document.querySelectorAll('.cloth--qty');
  inputElement.forEach((input) => {
    input.addEventListener('focusout', (event) => {
      console.log('focusout event fired');
      handleSummaryCost();
      event.stopPropagation();
    });
  });
});

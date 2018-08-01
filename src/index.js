import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/scss/fa-brands.scss';
import '@fortawesome/fontawesome-free/scss/fa-regular.scss';
import '@fortawesome/fontawesome-free/scss/fa-solid.scss';
import '../public/css/main.scss';

const $ = require('jquery');

$(document).ready(() => {
  console.log('Place JavaScript code here and there and over threre...');
  document.querySelector('#menu').addEventListener('click', (e) => {
    console.log('ICON CLICKED!');
    document.querySelector('#sidenav').classList.toggle('open');
    document.querySelector('#list').classList.toggle('disable--list');
    document.querySelector('#drawer').classList.toggle('shift--brand');
    e.stopPropagation();
  });
});

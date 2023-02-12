import './css/styles.css';
import Notiflix from 'notiflix';
import fetchCountries from './js/fetchCountries';
Notiflix.Notify.init({ position: 'right-top' });

const DEBOUNCE_DELAY = 300;
const debounce = require('lodash.debounce');
const refs = {
  inputSearch: document.getElementById('search-box'),
  ulCountryList: document.querySelector('.country-list'),
  divCountryInfo: document.querySelector('.country-info'),
};

refs.ulCountryList.style.listStyleType = 'none';
refs.ulCountryList.style.paddingLeft = '0';

refs.inputSearch.addEventListener(
  'input',
  debounce(onSearchInput, DEBOUNCE_DELAY)
);

function onSearchInput(e) {
  e.preventDefault();
  const enteredValue = e.target.value.trim();

  if (enteredValue != '') {
    fetchCountries(enteredValue)
      .then(arrayOfCountries => {
        const { name, flags, capital, population, languages } =
          arrayOfCountries;
        if (arrayOfCountries.status === 404) {
          clearListAndInfo();
          onCreatePromiseError();
          return '';
        }
        if (arrayOfCountries.length > 10) {
          clearListAndInfo();
          onCreatePromiseInfo();
          return '';
        }
        if (arrayOfCountries.length >= 2 && arrayOfCountries.length <= 10) {
          clearListAndInfo();
          onCreatePromiseWarning();

          return arrayOfCountries.reduce(
            (markup, country) => createMarkupList(country) + markup,
            ''
          );
        }
        if ((arrayOfCountries.length = 1)) {
          clearListAndInfo();
          onCreatePromiseSuccess();

          return arrayOfCountries.reduce(
            (markup, country) => createMarkupItem(country) + markup,
            ''
          );
        }
      })
      .then(arrayOfCountries => {
        if (arrayOfCountries.length > 1) {
          return updateListOfCuntries(arrayOfCountries);
        }
        if (arrayOfCountries.length === 1) {
          return updateCountryInfo(arrayOfCountries);
        }
        return '';
      })
      .catch(error => {
        onCreatePromiseCatchError();
      });
  } else clearListAndInfo();
}

function clearListAndInfo() {
  refs.ulCountryList.innerHTML = '';
  refs.divCountryInfo.innerHTML = '';
}

function updateListOfCuntries(markup) {
  refs.ulCountryList.innerHTML = markup;
}

function updateCountryInfo(markup) {
  refs.divCountryInfo.innerHTML = markup;
}

function createMarkupList({ flags, name }) {
  return `
  <li class="country-item">
  <p class="country-item-info" style="display:flex; gap:20px">
    <img src="${flags.svg}" alt="${flags.alt}" width="30px" height="20px" class="country-flag">
    <span class="country-name">${name.official}</span>
    </p>
  </li>
  `;
}

function createMarkupItem({ name, flags, capital, population, languages }) {
  const firstCapital = capital[0];
  return `
  <ul class="country-info-list" style="list-style-type:none; margin-left:0; padding-left:0;">
  <li class="country-item">
  <p class="country-info" style="display:flex; gap:20px; font-size:24px;">
    <img src="${flags.svg}" alt="${
    flags.alt
  }" width="60px" height="40px" class="country-flag">
    <span class="country-name"><b>${name.official}</b></span>
    </p>
  </li>
<li><b>Capital: </b>${firstCapital}</li>
<li><b>Population: </b>${population}</li>
<li><b>Languages: </b>${Object.values(languages).join(', ')}</li>
  </ul>
  `;
}

function onCreatePromiseInfo() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function onCreatePromiseError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function onCreatePromiseCatchError() {
  Notiflix.Notify.failure('ERROR! ERROR! ERROR!');
}

function onCreatePromiseSuccess() {
  Notiflix.Notify.success('Only 1 country found');
}

function onCreatePromiseWarning() {
  Notiflix.Notify.warning('Up to 10 countries found');
}

export default function fetchCountries(query) {
  const URL = `https://restcountries.com/v3.1/name/${query}?fields=name,capital,population,flags,languages`;

  return fetch(URL).then(res => res.json());
}

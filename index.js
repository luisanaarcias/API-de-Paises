const searchInput = document.querySelector('#search');
const container = document.querySelector('.container');
const body = document.querySelector('.main');
const loader = document.querySelector('.loader');
const formContainer = document.querySelector('.form-container');
let searchController;
// Los paises descargados desde la api se guardan en el array de countries
// La api deberia pedirse solo una vez
// Usar este array para crear el filtrado
let countries = [];
// Funcion que pide todos los paises
const getCountries = async () => {
  try {
    // Llamo a la API Rest Countries
    const response = await fetch(`https://restcountries.com/v3.1/all`);
    console.log(response);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    // Transformo la respuesta a JSON
    // Guardo el array de los paises recibido dentro de contries
    countries = await (response).json();
    console.log(countries);
  } catch (error) {
    console.log(error);
  }
}
getCountries();

searchInput.addEventListener('input', async e => {
  // Toda la logica del desafio va dentro del evento del input.
  const inputText = searchInput.value.toUpperCase().trim();

   // Cancelar solicitud anterior si existe
  if (searchController) {
    searchController.abort();
  }
  searchController = new AbortController();

  const filtrados = countries.filter(pais => pais.name.common.toUpperCase().startsWith(inputText));
  container.innerHTML = '';

  if (filtrados.length < 10 && filtrados.length != 1) {
    filtrados.forEach(countrie => {
      const div = document.createElement('div');
      div.classList.add('countries-ten');

      div.innerHTML = `
        <div class="flag-container-ten">
          <img src="${countrie.flags.svg}" alt="" class="flags">
        </div>
        <div class="info-container">
              <h2>${countrie.name.common}</h2>
        </div>
      `;
      container.appendChild(div);
    })
  } else if (filtrados.length == 1) {

    const responceWeather = await (await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${filtrados[0].capital}&appid=e95d5f5d9da0081db8a7864a6c32faf9&units=metric`)).json();

    const div = document.createElement('div');
    div.classList.add('countries');

    div.innerHTML = `
      <div class="flag-container">
          <img src="${filtrados[0].flags.svg}" alt="" class="flags">
          <div class="climate-container">
            <div class="weather-container">
            <img src="https://openweathermap.org/img/wn/${responceWeather.weather[0].icon}@2x.png" alt="" class="weather-icon">
            <p class="weather">${responceWeather.weather[0].main}</p>
            </div>
            <p class="temperature">${responceWeather.main.temp}°C</p>
          </div>
        </div>
        <div class="info-container">
          <h2>${filtrados[0].name.common}</h2>
          <p class="info">${filtrados[0].capital} <br>${filtrados[0].population} habitantes <br>${filtrados[0].region} <br>${filtrados[0].subregion} <br>${filtrados[0].timezones[0]}</p>
        </div>
    `;

    container.appendChild(div);
  } else if (filtrados.length > 10) {
    const div = document.createElement('div');
    div.classList.add('resultado');
    
    div.innerHTML = `
      <p>Demasiados paises, especifica mejor tu busqueda</p>
    `

    container.appendChild(div);
  }
  if (searchInput.value == '') {
    container.innerHTML = '';
  }
});
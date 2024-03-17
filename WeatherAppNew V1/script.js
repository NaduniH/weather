let idP = $('.temp_c');
let feelslike_c = $('.feelslike_c');
let wind_kph = $('.wind_kph');
let vis_km = $('.vis_km');

let nameP = $('.name');
let urlP = $('.url');
let humidity = $('.humidity');

let tz_id = $('.tz_id');
let regionP = $('.region');
let countryP = $('.country');
let latP = $('#lat');
let lonP = $('#lon');

let loc_t = $('.location-time');
let img = document.getElementById('weatherIcon');

const apiKey = '2fe6a899aa2a46588a8153528240703';

let today;
let yesterday;
let dayBeforeAweek;
let timeLineLocation;

function toggleDarkMode() {
  var element = document.body;
  element.classList.toggle('dark-mode');
}

//  ================================= map ===========================

function initializeMap(latitude, longitude) {
  if (map) {
    map.remove();
  }

  map = L.map('map').setView([latitude, longitude], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
  )
    .then((response) => response.json())
    .then((data) => {
      const locationName = data.display_name;
      // console.log(data);
      currentLocation = data['address']['hamlet'];
      currentTown = data['address']['town'];

      CurrentWeather(currentTown);

      currentLocationMarker = L.marker([latitude, longitude]).addTo(map);
    })
    .catch((error) => console.error('Error fetching location name:', error));
}

function updateMap(newLatitude, newLongitude) {
  if (map) {
    map.remove();
  }

  map = L.map('map').setView([newLatitude, newLongitude], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLatitude}&lon=${newLongitude}`
  )
    .then((response) => response.json())
    .then((data) => {
      const locationName = data.display_name;
      currentLocation = data['address']['hamlet'];
      currentTown = data['address']['town'];
      currentLocationMarker = L.marker([newLatitude, newLongitude]).addTo(map);
    })
    .catch((error) => console.error('Error fetching location name:', error));
}



var map = L.map('map').setView([0, 0], 13);

var marker;

getLocation();


//--------------------------------------getCurrentPosition-----------------------------------

let latitude;
let longitude;
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}
function showPosition(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  fetchWeatherData(latitude + ',' + longitude);
  timeLineLocation = latitude + ',' + longitude;
  getWeatherTimeLine();
  getFutureWeatherTimeLine();

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  marker = L.marker([latitude, longitude]).addTo(map);
  marker.setLatLng([latitude, longitude]).update();
  map.setView([latitude, longitude]);

  const geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

  $.ajax({
    method: 'GET',
    url: geoApiUrl,
    success: (resp) => {
      console.log('====================================');
      console.log(resp);
      console.log('====================================');
    },
  });
}

//-------------------------------------------handleSearch----------------------------------------

function handleSearch() {
  console.log('serch button clicked');
  const location = document.getElementById('location-input').value;
  timeLineLocation = location;
  fetchWeatherData(location);
  getWeatherTimeLine();
  getFutureWeatherTimeLine();
}
document
  .getElementById('search-button')
  .addEventListener('click', handleSearch);

function fetchWeatherData(location) {
  $.ajax({
    method: 'GET',
    url: `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`,
    success: ({ location, current }) => {
      countryP.text(location.country);
      idP.text(
        current.temp_c.toLocaleString(undefined, {
          style: 'unit',
          unit: 'celsius',
        })
      );

      vis_km.text(
        current.vis_km.toLocaleString(undefined, {
          style: 'unit',
          unit: 'kilometer',
        })
      );

      feelslike_c.text(
        current.feelslike_c.toLocaleString(undefined, {
          style: 'unit',
          unit: 'celsius',
        })
      );
      latP.text(location.lat);
      lonP.text(location.lon);
      nameP.text(location.name);
      loc_t.text(location.localtime);
      let locationName = location.name;

      regionP.text(location.region);
      urlP.text(current.condition.text);
      humidity.text(current.humidity + '%');
      tz_id.text(location.tz_id);
      wind_kph.text(current.wind_kph + 'kph');
      //   feelslike_c.text(current.feelslike_c);

      img.src = 'https:' + current.condition.icon;

      marker.setLatLng([location.lat, location.lon]).update();
      map.setView([location.lat, location.lon]);
    },
  });
}

// -------------------------------------------------updateLocalTime-----------------------------

function updateLocalTime() {
  const localTimeElement = document.getElementById('local-time');
  const now = new Date();
  const localTimeString = now.toLocaleTimeString();
  localTimeElement.textContent = `${localTimeString}`;

  today = now.toLocaleDateString();
  yesterday = new Date(now.getTime() - 86400000).toLocaleDateString();
  dayBeforeAweek = new Date(now.getTime() - 86400000 * 7).toLocaleDateString();

  console.log(
    ' yesterday ' +
      yesterday +
      ' dayBeforeAweek ' +
      dayBeforeAweek + 
    ' today ' +
      today
  );
  
}

updateLocalTime();

setInterval(updateLocalTime, 1000);

//---------------------------------------------------searchForecast-------------------------------------


function getWeatherTimeLine() {
  console.log('timeline location : ' + timeLineLocation);
  const imgIds = ['img1', 'img2', 'img3', 'img4', 'img5', 'img6', 'img7'];
  const titleClasses = [
    '.title1',
    '.title2',
    '.title3',
    '.title4',
    '.title5',
    '.title6',
    '.title7',
  ];
  const dateIds = [
    'date1',
    'date2',
    'date3',
    'date4',
    'date5',
    'date6',
    'date7',
  ];
  $.ajax({
    method: 'GET',
    url: `https://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${timeLineLocation}&dt=${dayBeforeAweek}&end_dt=${yesterday}`,
    success: (resp) => {
      for (let i = 0; i < 7; i++) {
        const forecastDay = resp['forecast']['forecastday'][i]['day'];

        const img = document.getElementById(imgIds[i]);
        const title = document.querySelector(titleClasses[i]);
        const date = document.getElementById(dateIds[i]);

        img.src = 'https:' + forecastDay['condition']['icon'];
        title.innerHTML = forecastDay['condition']['text'];
        date.innerHTML = resp['forecast']['forecastday'][i]['date'];
      }
    },
  });
}

function getFutureWeatherTimeLine() {
  console.log('timeline location : ' + timeLineLocation);
  const imgIds = ['img8', 'img9', 'img10', 'img11', 'img12', 'img13', 'img14'];
  const titleClasses = [
    '.title8',
    '.title9',
    '.title10',
    '.title11',
    '.title12',
    '.title13',
    '.title14',
  ];
  const dateIds = [
    'date8',
    'date9',
    'date10',
    'date11',
    'date12',
    'date13',
    'date14',
  ];
  $.ajax({
    method: 'GET',
    url: `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${timeLineLocation}&days=7`,
    success: (resp) => {
      for (let i = 0; i < 7; i++) {
        const forecastDay = resp['forecast']['forecastday'][i]['day'];

        const img = document.getElementById(imgIds[i]);
        const title = document.querySelector(titleClasses[i]);
        const date = document.getElementById(dateIds[i]);

        img.src = 'https:' + forecastDay['condition']['icon'];
        title.innerHTML = forecastDay['condition']['text'];
        date.innerHTML = resp['forecast']['forecastday'][i]['date'];
      }
    },
  });
}

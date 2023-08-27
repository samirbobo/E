const btnClose = document.querySelector(".btn-close");
const overlayBody = document.querySelector(".overlay-body");
const buttonsOverlay = document.querySelector(".buttons-overlay");
const overlayBodyP = document.querySelector(".overlay-body p");
const btnCancel = document.querySelector(".btn-cancel");
const btnOk = document.querySelector(".btn-ok");
const linkNote = document.querySelector(".nav-center .nav-links .note");
const navbarToggler = document.querySelector(".navbar-toggler");
const navLinks = document.querySelector(".nav-links");
const linksContainer = document.querySelector(".links-container");
const note = document.querySelector(".note");
const Home = document.querySelector(".Home");
const dataLocation = document.querySelector(".data-location");
const dateOfLocation = document.querySelector(
  ".date-of-location .outPut-seacrh"
);
const daysWeather = document.querySelector(".days-weather .countainer");
const seacrhBtn = document.querySelector(".search");

let faildApi = false;

function showDataDisplay() {
  dataLocation.style.display = "flex";
  daysWeather.style.display = "grid";
  dateOfLocation.style.display = "block";
}

btnClose.addEventListener("click", () => {
  overlayBody.style.display = "none";
  if (faildApi) {
    showDataDisplay();
  }
});
btnCancel.addEventListener("click", () => {
  overlayBody.style.display = "none";
  dataLocation.style.display = "none";
});

function faildApiNone() {
  overlayBody.style.display = "block";
  buttonsOverlay.style.display = "none";
  dataLocation.style.display = "none";
  daysWeather.style.display = "none";
  dateOfLocation.style.display = "none";
}

/* fetch data from api weather */
async function fetchWeather(url) {
  const respons = await fetch(url);
  if (respons.status === 400) {
    faildApi = true;
    faildApiNone();
    overlayBodyP.textContent = `Please, Enter a valid name to find your order`;
  }
  if (respons.status === 200) {
    showDataDisplay();
  }
  const data = await respons.json();
  /* data of current position */
  const { name, localtime, country } = data.location;
  const { text, icon } = data.current.condition;
  const { cloud, humidity, wind_kph: windSpeed } = data.current;

  /* data of forecast days  */
  const days = data.forecast.forecastday.map((day) => {
    const { sunrise, sunset } = day.astro;
    const dateDay = day.date;
    const { maxtemp_c, mintemp_c, avghumidity, maxwind_kph } = day.day;
    const { text, icon } = day.day.condition;
    return {
      sunrise,
      sunset,
      dateDay,
      maxtemp_c,
      mintemp_c,
      avghumidity,
      maxwind_kph,
      text,
      icon,
    };
  });

  return {
    name,
    localtime,
    country,
    text,
    icon,
    cloud,
    humidity,
    windSpeed,
    days,
  };
}

/* add data to html page */
function showDataLocation(weather) {
  const { name, country, text, icon, cloud, humidity, windSpeed, days } =
    weather;
  dataLocation.innerHTML = `<div class="icon-api">
  <img src=${icon} alt="icon of weather of day" />
</div>
<div class="data-api">
  <div class="header-country">
    <h2>${country}/${name}</h2>
    <p>${text}</p>
  </div>
  <div class="info-country">
    <div class="show-data">
      <p>Clouds</p>
      <p>${cloud}%</p>
    </div>
    <div class="show-data">
      <p>humidity</p>
      <p>${humidity}%</p>
    </div>
    <div class="show-data">
      <p>Wind Speed</p>
      <p>${windSpeed}</p>
    </div>
    <div class="show-data">
      <p>Sunrise</p>
      <p>${days[0].sunrise}</p>
    </div>
    <div class="show-data">
      <p>Sunset</p>
      <p>${days[0].sunset}</p>
    </div>
  </div>
</div>`;
}

/* function to return your day */
function getDay(numDay) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[numDay];
}

/* function to return your month */
function getMonth(numMonth) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[numMonth];
}

// function to display the current date and location of the city
let x;
function showDateLocation() {
  const day = new Date().getDay();
  const month = new Date().getMonth();
  x = setInterval(() => {
    let date = new Date();
    dateOfLocation.innerHTML = `
    <h2>${date.toLocaleTimeString()}</h2>
    <h3>${getDay(day)} ${getMonth(month)} ${date.toLocaleDateString()}</h3>`;
  }, 1000);
  dateOfLocation.style.display = "block";
}

/* function to add days data to html page */
function showDataDays({ days }) {
  daysWeather.innerHTML = days
    .map((day) => {
      const {
        sunrise,
        sunset,
        dateDay,
        maxtemp_c,
        mintemp_c,
        avghumidity,
        maxwind_kph,
        text,
        icon,
      } = day;
      let timeDay = new Date(dateDay).getDay();
      return `<article class="day">
    <div class="header">
      <h3>${getDay(timeDay)}</h3>
      <img src=${icon} alt=${text}>
    </div>
    <div class="info">
      <div class="temp">
        <p>max-temp: ${maxtemp_c}c</p>
        <p>min-temp:  ${mintemp_c}c</p>
      </div>
      <p>humidity: ${avghumidity}</p>
      <p>wind speed: ${maxwind_kph}</p>
      <p>${text}</p> 
      <div class="sun">
        <p>sunrise: ${sunrise}</p>
        <p>sunset: ${sunset}</p>
      </div>
    </div>
  </article>`;
    })
    .join("");
}

/* function to linked with location seting site */
function findMyState() {
  const success = async ({ coords }) => {
    const { latitude, longitude } = coords;
    const url = `https://api.weatherapi.com/v1/forecast.json?key=7d3c2cc6969046bda46114024230307&q=${latitude},${longitude}&days=7&aqi=no&alerts=no`;
    const weather = await fetchWeather(url);
    showDataLocation(weather);
    showDateLocation();
    showDataDays(weather);
  };
  const error = () => {
    console.log("samir");
  };
  navigator.geolocation.getCurrentPosition(success, error);
}

btnOk.addEventListener("click", () => {
  overlayBody.style.display = "none";
  navLinks.style.display = "none";
  navbarToggler.style.display = "none";
  findMyState();
});

/* dynamic navbar */
navbarToggler.addEventListener("click", () => {
  const heightContainer = linksContainer.getBoundingClientRect().height;
  const heightLinks = navLinks.getBoundingClientRect().height;
  if (heightContainer === 0) {
    linksContainer.style.height = `${heightLinks}px`;
  } else {
    linksContainer.style.height = "0px";
  }
});
note.addEventListener("click", () => {
  overlayBody.style.display = "block";
  buttonsOverlay.style.display = "none";
  overlayBodyP.textContent = `Please, reload this page and this time click OK to get 
  the weather for your current location`;
});

/* get time for your country search */
let x2;
function getlocalTime(localtime) {
  let date = new Date(localtime).getTime();
  const day = new Date(date).getDay();
  const month = new Date(date).getMonth();
  x2 = setInterval(() => {
    date += 1000;
    dateOfLocation.innerHTML = `
    <h2>${new Date(date).toLocaleTimeString()}</h2>
    <h3>${getDay(day)} ${getMonth(month)} ${new Date(
      date
    ).toLocaleDateString()}</h3>`;
  }, 1000);
  dateOfLocation.style.display = "block";
}

/* get data for your country search */
const successSearch = async () => {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=7d3c2cc6969046bda46114024230307&q=${seacrhBtn.value}&days=7&aqi=no&alerts=no`;
  const weather = await fetchWeather(url);
  showDataLocation(weather);
  getlocalTime(weather.localtime);
  showDataDays(weather);
};
window.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    if (!seacrhBtn.value.length <= 0) {
      clearInterval(x);
      clearInterval(x2);
      successSearch();
      seacrhBtn.value = "";
    }
  }
});

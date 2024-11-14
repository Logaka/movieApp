const city_BASE_URL = `http://api.openweathermap.org/geo/1.0/direct`
const weather_BASE_URL = `https://api.openweathermap.org/data/2.5/weather`
const icon_BASE_URL = ` https://openweathermap.org/img/wn`
const forecast_BASE_URL = `https://api.openweathermap.org/data/2.5/forecast/daily`
const api = 'a1ac46ad87490a397d4a1f3e736402cd'

const searchBtn = document.querySelector('.container__search-img')
const searchInput = document.querySelector('.container__search-input')
const measure = document.querySelector('.measure')
const suggestionList = document.querySelector('.suggestions-list')
let units = 'metric'

/* suggestion list */

async function fetchSuggestions(city) {
    const url = city_BASE_URL + `?q=${city}` + `&appid=${api}`
    console.log('fetch' + url)

    const res = await fetch(url);
    const data = await res.json();
    console.log('fetch ' + data[0]?.name, data);
    return data;
}

function showSuggestions(cities) {
    suggestionList.innerHTML = ``

    suggestionList.style.display = 'block'

    cities.forEach(city => {
        const li = document.createElement('li')

        li.textContent = city.name

        li.addEventListener('click', () => {
            searchInput.value = city.name
            suggestionList.style.display = 'none'
        })
        suggestionList.appendChild(li)
    })
}


/*  to set measure   */

if (measure)
    measure.addEventListener('click', switchMeasure)

async function switchMeasure() {
    const measureTxt = document.querySelector('.measure__txt');

    if (measureTxt.classList.contains('is-units-metric')) {
        units = 'imperial';
        measureTxt.classList.remove('is-units-metric');
        measureTxt.textContent = 'Fahrenheit';
    } else {
        units = 'metric';
        measureTxt.classList.add('is-units-metric');
        measureTxt.textContent = 'Celsius';
    }
    console.log('Current units:', units);
    await getWeather()
}

/*   to find smth   */
if (searchBtn) {
    searchBtn.addEventListener('click', getWeather)
}
if (searchInput) {
    searchInput.addEventListener('keypress', e => {
        if (e.key === 'Enter')
            getWeather()
    })
    searchInput.addEventListener('input', async () => {
        const query = searchInput.value.trim()
        console.log(query)
        if (query.length > 0) {
            const cities = await fetchSuggestions(query);

            console.log(cities[0].name + ' event');
            showSuggestions(cities);
        } else {
            suggestionList.style.display = 'none'
        }
    })
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.container__search')) {
        suggestionList.style.display = 'none';
    }
});

/*     get let lon of city     */

async function getCoordinatesByCity() {
    const city_url = city_BASE_URL + `?q=${searchInput.value}` + `&appid=${api}`

    console.log(city_url)
    const res = await fetch(city_url);
    const data = await res.json();

    const {lat, lon} = data[0]
    console.log(lat, lon)
    return {lat, lon}
}


async function getWeather() {

    let lat, lon;

    if (searchInput.value) {
        const {lat: cityLat, lon: cityLon} = await getCoordinatesByCity();
        lat = cityLat;
        lon = cityLon;
    } else {
        try {
            const location = await getCurrentLocation();
            lat = location.lat;
            lon = location.lon;
        } catch (error) {
            console.error('Error getting location:', error);
            alert('Unable to retrieve your location.');
            return;
        }
    }

    const weather_url = weather_BASE_URL + `?lat=${lat}&lon=${lon}&appid=${api}` + `&units=${units}`

    const res = await fetch(weather_url);
    const data = await res.json();


    if (!data) return

    const timezoneOffset = data.timezone;
    const cityName = data.name;

    const tempUnit = units === 'metric' ? '°C' : '°F';

    const cityTime = new Date(new Date().getTime() + timezoneOffset * 1000);
    const formattedTime = cityTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
    });

    const formattedDate = cityTime.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
    });

    console.log(data.id)
    const {sunrise, sunset} = getSunTimes(lat, lon);
    const imgUrl = await getIcon(data.weather[0].icon)

    let html = `
                    <div class="date__time__container flex card">
                        <p class="city">${cityName}</p>
                        <div class="date__time__inner__container">
                            <h2 class="time">${formattedTime}</h2>
                            <h4 class="date">${formattedDate}</h4>
                        </div>
                    </div>
                    <div class="weather__details flex card">
                    <div class="weather__inner flex">
                        <div class="temperature__container">
                            <h3 class="temperature">${Math.round(data.main.temp)} ${tempUnit}</h3>
                            <span class="feel-like">Feels like: ${Math.round(data.main.feels_like)} ${tempUnit}</span>
                        </div>
                        <div>
                            <div class="sun-state flex">
                                <img src="images/sunrise-white.svg" alt="sunrise">
                                <div class="sun__container">
                                    <p>Sunrise</p>
                                    <p class="sunrise">${sunrise}</p>
                                </div>
                            </div>
                            <div class="sun-state flex">
                                <img src="images/sunset-white.svg" alt="sunset">
                                <div class="sun__container">
                                    <p>Sunset</p>
                                    <p class="sunset">${sunset}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="weather__inner flex">
                        <img src="${imgUrl}" alt="sunny" class="weather-icon">
                        <p class="weather-txt align-self-center">${data.weather[0].main}</p>
                    </div>
                    <div class="weather__inner-grid__container">
                        <div class="vertical__container">
                            <img src="images/humidity.svg" alt="humidity" class="img">
                            <p class="humidity">${data.main.humidity} %</p>
                            <p>Humidity</p>
                        </div>
                        <div class="vertical__container">
                            <img src="/images/temp.svg" alt="pressure" class="img">
                            <p class="pressure">${Math.round(data.main.temp_max)} ${tempUnit}</p>
                            <p>Max. Temp</p>
                        </div>
                        <div class="vertical__container">
                            <img src="images/wind.png" alt="wind" class="img">
                            <p class="wind">${Math.round(data.wind.speed)} km/h</p>
                            <p>Wind Speed</p>
                        </div>
                        <div class="vertical__container">
                            <img src="/images/temp.svg" alt="wind" class="img">
                            <p class="wind">${Math.round(data.main.temp_min)} ${tempUnit}</p>
                            <p>Min. Temp</p>
                        </div>
                    </div>
                    </div>
                `;

    const section = document.querySelector('.section');
    section.innerHTML = html;

    const forecastsData = await getForecast(lat, lon);

    let html1 = ''

    for (const forecastData of forecastsData) {
        const imgUrl = await getIcon(forecastData.weather[0].icon);
        const day = new Date(forecastData.dt * 1000).toLocaleDateString('en-US', {
            weekday: 'long',
            day: 'numeric',
            timeZone: 'UTC'
        });

        html1 += `
                    <div class="forecast__item">
                        <img class="forecast__state-img" src="${imgUrl}" alt="img">
                        <p class="weather-txt align-self-center">${forecastData.weather[0].main}</p>
                        <p class="forecast__temperature">${Math.round(forecastData.temp.day)} ${tempUnit}</p>
                        <p class="forecast__day">${day}</p>
                    </div>
                `;
    }

    const forecastContainer = document.querySelector('.forecast__container');
    forecastContainer.innerHTML = html1;
}

async function getForecast(lat, lon) {

    const url = forecast_BASE_URL + `?lat=${lat}&lon=${lon}&cnt=6&appid=${api}&units=${units}`

    const res = await fetch(url)
    const data = await res.json()

    if (!data)
        return

    return data.list.slice(1, data.list.length);
}

async function getIcon(id) {
    const url = icon_BASE_URL + `/${id}@2x.png`
    console.log(url)
    const res = await fetch(url);
    const data = await res.blob();

    return URL.createObjectURL(data);
}

function getSunTimes(lat, lon) {
    const times = SunCalc.getTimes(new Date(), lat, lon);

    const sunrise = times.sunrise.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    const sunset = times.sunset.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

    console.log('Sunrise:', sunrise);
    console.log('Sunset:', sunset);

    return {sunrise, sunset};
}


function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    resolve({lat, lon});
                },
                (error) => {
                    reject(error);
                }
            );
        } else {
            reject(new Error('Geolocation is not supported by this browser.'));
        }
    });
}


document.addEventListener('DOMContentLoaded', function () {
    getWeather();
});
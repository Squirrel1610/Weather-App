const apiKey = '1dfea0fd56f105e4088d380061bbc4ad'
const searchElement = document.querySelector('input[type="text"]')
const ulElement = document.querySelector('ul')
const formElement = document.querySelector('form')
const weatherElement = document.querySelector('#weather')
const changeBtn = document.querySelector('#change')

async function searchLocation(phrase, limit = 5) {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${phrase}&limit=${limit}&appid=${apiKey}`)
    const data = await response.json()
    
    ulElement.innerHTML = '';
    data.forEach((location) => {
        const liElement = document.createElement('li')
        liElement.dataset.lat = location.lat;
        liElement.dataset.lon = location.lon;
        liElement.dataset.name = location.name;
        liElement.innerHTML = `${location.name} <span>${location.country}</span>`
        ulElement.appendChild(liElement)
    })
}

searchElement.addEventListener('keyup', (e) => {
    const phrase = e.target.value;
    _.debounce(searchLocation(phrase), 600)
})

async function showWeather(lat, lon, name) {
    const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
    const data = await response.json()
    const {temp, feels_like, humidity} = data.main;
    const wind = data.wind.speed;
    const {icon} = data.weather[0];
    document.getElementById('degrees').innerHTML = Math.round(temp - 272.15) + ' &#8451;';
    document.getElementById('city').innerHTML = name;
    document.getElementById('windValue').innerHTML = Math.round(wind) + '<span> km/h</span>';
    document.getElementById('feelsLikeValue').innerHTML = Math.round(feels_like - 272.15) + '<span> &#8451;</span>';
    document.getElementById('humidityValue').innerHTML = Math.round(humidity) + '<span> %</span>'
    document.getElementById('icon').src = `http://openweathermap.org/img/wn/${icon}@4x.png`;
    formElement.style.display = 'none';
    weatherElement.style.display = 'block';
}

document.body.addEventListener('click', (e) => {
    const liElement = e.target;
    const { lat, lon, name } = liElement.dataset;
    localStorage.setItem('lat', lat);
    localStorage.setItem('lon', lon);
    localStorage.setItem('name', name);
    if (!lat || !lon) return;
    showWeather(lat, lon, name);
})

changeBtn.addEventListener('click', () => {
    weatherElement.style.display = 'none';
    formElement.style.display = 'block';
})

document.getElementsByTagName('body')[0].onload = () => {
    const lat = localStorage.getItem('lat');
    const lon = localStorage.getItem('lon');
    const name = localStorage.getItem('name');
    if (!lat || !lon) return;
    showWeather(lat, lon, name);
}

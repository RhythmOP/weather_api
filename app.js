document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchButton').addEventListener('click', () => {
        const city = document.getElementById('cityInput').value;
        fetchWeather(city);
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherByCoords(lat, lon);
        });
    }
});

const apiKey = 'df4d992555bea16eee5d3e4090121d19';

function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => displayWeather(data))
        .catch(error => {
            document.getElementById('weatherResult').innerText = 'Failed to fetch weather. Please try again later.';
            console.error('Error fetching weather:', error);
        });
}

function fetchWeatherByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => displayWeather(data))
        .catch(error => {
            document.getElementById('weatherResult').innerText = 'Failed to fetch weather. Please try again later.';
            console.error('Error fetching weather:', error);
        });
}

function fetchForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&units=metric&cnt=7&appid=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => displayForecast(data));
}

function displayWeather(data) {
    const weatherResult = document.getElementById('weatherResult');
    weatherResult.innerHTML = '';

    const city = data.name;
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const pressure = data.main.pressure;
    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
    
    const weatherElement = document.createElement('div');
    weatherElement.innerHTML = `
        <h2>${city}</h2>
        <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon" class="weather-icon">
        <p>Temperature: ${temperature} °C</p>
        <p>Weather: ${description}</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
        <p>Pressure: ${pressure} hPa</p>
        <p>Sunrise: ${sunrise}</p>
        <p>Sunset: ${sunset}</p>
    `;
    weatherResult.appendChild(weatherElement);

    fetchForecast(city);
}

function displayForecast(data) {
    const labels = data.list.map(day => new Date(day.dt * 1000).toLocaleDateString());
    const temperatures = data.list.map(day => day.temp.day);

    const ctx = document.getElementById('forecastChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '7-Day Temperature Forecast (°C)',
                data: temperatures,
                backgroundColor: 'rgba(255, 152, 0, 0.2)',
                borderColor: 'rgba(255, 152, 0, 1)',
                borderWidth: 1,
                fill: true
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

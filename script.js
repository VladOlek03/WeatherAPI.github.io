const notifications = document.querySelector(".notification");
const iconVar = document.querySelector(".weather-pic");
const tempVar = document.querySelector(".temperature p");
const descVar = document.querySelector(".temperature-info p");
const locationVar = document.querySelector(".location p");

const weather = {};

weather.temperature = {
    unit: "celsius"
}

const KELVIN = 273;
// API key
const key = `2dfb1fc0e2657887eab68b618a3cf8b0`;

// Check if browser supports geolocation
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notifications.style.display = "block";
    notifications.innerHTML = "<p>Browser Doesn't Support Geolocation.</p>"
}

function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    console.log(latitude, longitude);

    getWeather(latitude, longitude);
}

function showError(error) {
    notifications.style.display = "block";
    notifications.innerHTML = `<p> ${error.message} </p>`;
}

function getWeather(latitude, longitude) {
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    //let api = `https://api.openweathermap.org/data/2.5/weather?lat=${33.96826}&lon=${-108.57132 }&appid=${key}`;

    console.log(api);

    fetch(api)
        .then(function(response) {
            let data = response.json();
            return data;
        })
        .then(function(data) {
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].main;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function() {
            displayWeather();
        });
}

function displayWeather() {
    iconVar.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempVar.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descVar.innerHTML = weather.description;
    locationVar.innerHTML = `${weather.city}, ${weather.country}`;
};

function celsiusToFahrenheit(temperature) {
    return (temperature * 9 / 5) + 32;
};

tempVar.addEventListener("click", function() {
    if (weather.temperature.value === undefined) {
        return;
    }

    if (weather.temperature.unit === "celsius") {
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        tempVar.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";

    } else {
        tempVar.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius";
    }
});
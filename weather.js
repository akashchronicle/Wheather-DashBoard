// Get all the elements
const searchInput = document.getElementById("search");
const searchForm = document.getElementById("search-form");
const temperatureDisplay = document.getElementById("temperature");
const humidityDisplay = document.getElementById("humidity");
const windSpeedDisplay = document.getElementById("wind-speed");
const weatherDisplay = document.getElementById("weather");
const temperatureLoading = document.getElementById("temperature-loading");
const humidityLoading = document.getElementById("humidity-loading");
const windSpeedLoading = document.getElementById("wind-speed-loading");
const weatherLoading = document.getElementById("weather-loading");
const cityNameHeader = document.getElementById("city-name-header");
const weatherImage = document.getElementById("weather-image");

const apiKey = '143dbe2f90a8425b3cda5c24fb043a1b'; // Replace with your OpenWeather API Key

document.addEventListener("DOMContentLoaded", function () {

    // Function to get coordinates (latitude & longitude) from city name
    const getCoordinates = async (city) => {
        try {
            console.log(`Fetching coordinates for: ${city}`);
            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
            let response = await fetch(geoUrl);
            let data = await response.json();
            
            console.log("Geocoding API Response:", data);

            if (!response.ok || data.length === 0) {
                throw new Error("Invalid city name or API issue");
            }

            return {
                latitude: data[0].lat,
                longitude: data[0].lon,
                name: data[0].name
            };
        } catch (error) {
            console.error("Error getting coordinates:", error);
            alert("Invalid city name. Please try again.");
            return null;
        }
    };

    // Function to fetch weather data using latitude & longitude
    const fetchWeather = async (city) => {
        try {
            const locationData = await getCoordinates(city);
            if (!locationData) {
                console.error("Location data not found!");
                return;
            }

            const { latitude, longitude, name } = locationData;

            console.log(`Fetching weather data for ${name} (Lat: ${latitude}, Lon: ${longitude})`);

            // Show loading indicators
            temperatureDisplay.textContent = "";
            humidityDisplay.textContent = "";
            windSpeedDisplay.textContent = "";
            weatherDisplay.textContent = "";
            temperatureLoading.style.display = "block";
            humidityLoading.style.display = "block";
            windSpeedLoading.style.display = "block";
            weatherLoading.style.display = "block";

            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
            let response = await fetch(weatherUrl);
            let data = await response.json();

            console.log("Weather API Response:", data);

            if (!response.ok || !data) {
                throw new Error(data.message || "Weather data not found");
            }

            // Hide loading indicators
            temperatureLoading.style.display = "none";
            humidityLoading.style.display = "none";
            windSpeedLoading.style.display = "none";
            weatherLoading.style.display = "none";

            // Update UI with weather data
            temperatureDisplay.textContent = data.main.temp + "°C";
            humidityDisplay.textContent = data.main.humidity + "%";
            windSpeedDisplay.textContent = data.wind.speed + " km/h";
            weatherDisplay.textContent = `${data.weather[0].description} in ${name}`;
            cityNameHeader.textContent = `Weather Dashboard for ${name}`;

            // Update weather image
            updateWeatherImage(data.weather[0].main);

        } catch (error) {
            console.error("Error fetching weather data:", error);
            alert("Could not fetch weather data. Please try again.");
        }
    };

    // Function to update weather image based on weather condition
    const updateWeatherImage = (weatherCondition) => {
        const imageMappings = {
            "Clear": "images/sunny.jpg",
            "Clouds": "images/cloudy.jpg",
            "Rain": "images/rain.jpg",
            "Drizzle": "images/rain.jpg",
            "Thunderstorm": "images/thunder.jpg",
            "Mist": "images/fog.jpg",
            "Fog": "images/fog.jpg",
            "Smoke": "images/smoke.jpg",
            "Haze": "images/haze.jpg",
            "Dust": "images/dust.jpg"
        };

        const imageUrl = imageMappings[weatherCondition] || "images/default.jpg";
        weatherImage.src = imageUrl;
    };

    if (searchForm) {
        // Initially display weather for London
        fetchWeather("London");

        searchForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const location = searchInput.value.trim();
            if (!location) {
                alert("Please enter a city name.");
                return;
            }
            fetchWeather(location);
        });
    } else {
        console.error("Search form not found.");
    }
});

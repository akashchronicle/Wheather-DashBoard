// Getting all the elements
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

document.addEventListener("DOMContentLoaded", function () {  

    const apiKey = '143dbe2f90a8425b3cda5c24fb043a1b';  // Replace with your OpenWeather API Key

    // Function to fetch latitude and longitude from city name
    const getCoordinates = async (city) => {
        try {
            console.log(`Fetching coordinates for: ${city}`);
            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
            let response = await fetch(geoUrl);
            let data = await response.json();
            
            console.log("Geocoding API Response:", data);

            if (!response.ok || data.length === 0) {
                throw new Error("Invalid city name or API error");
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

    // Function to fetch weather data
    const fetchWeather = async (city) => {
        try {
            // Get latitude and longitude first
            const locationData = await getCoordinates(city);
            if (!locationData) return;

            const { latitude, longitude, name } = locationData;

            console.log(`Fetching weather data for ${name} (Lat: ${latitude}, Lon: ${longitude})`);

            // Clear previous content and show loading
            temperatureDisplay.textContent = "";
            humidityDisplay.textContent = "";
            windSpeedDisplay.textContent = "";
            weatherDisplay.textContent = "";
            temperatureLoading.style.display = "block";
            humidityLoading.style.display = "block";
            windSpeedLoading.style.display = "block";
            weatherLoading.style.display = "block";

            // Fetch weather data using One Call API
            const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&units=metric&appid=${apiKey}`;
            let response = await fetch(weatherUrl);
            let data = await response.json();

            console.log("Weather API Response:", data);

            if (!response.ok || data.error) {
                throw new Error(data.error?.message || "Weather data not found");
            }

            // Hide loading indicators
            temperatureLoading.style.display = "none";
            humidityLoading.style.display = "none";
            windSpeedLoading.style.display = "none";
            weatherLoading.style.display = "none";

            // Update UI with new weather data
            temperatureDisplay.textContent = data.current.temp + "°C";
            humidityDisplay.textContent = data.current.humidity + "%";
            windSpeedDisplay.textContent = data.current.wind_speed + " km/h";
            weatherDisplay.textContent = `${data.current.weather[0].description} in ${name}`;
            cityNameHeader.textContent = `Weather Dashboard for ${name}`;

            // Update weather image
            updateWeatherImage(data.current.weather[0].main);
            console.log("Weather data fetched successfully!");

        } catch (error) {
            console.error("Error fetching weather data:", error);
            temperatureLoading.style.display = "none";
            humidityLoading.style.display = "none";
            windSpeedLoading.style.display = "none";
            weatherLoading.style.display = "none";

            temperatureDisplay.textContent = "N/A";
            humidityDisplay.textContent = "N/A";
            windSpeedDisplay.textContent = "N/A";
            weatherDisplay.textContent = "N/A";
            cityNameHeader.textContent = `Weather Dashboard`;

            alert("Failed to fetch weather data. Please enter a valid city name.");
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
            "Mist": "images/fog(2).jpg",
            "Fog": "images/fog(2).jpg",
            "Smoke": "images/smoke.jpg",
            "Haze": "images/haze.jpg",
            "Dust": "images/dust.jpg",
        };

        weatherImage.src = imageMappings[weatherCondition] || "images/sunny.jpg";
    };

    if (searchForm) {
        console.log("Initializing default weather for London...");
        fetchWeather("London");

        searchForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const location = searchInput.value.trim();
            if (!location) {
                alert("Please enter a city name.");
                return;
            }
            console.log(`User searched for: ${location}`);
            fetchWeather(location);
        });
    } else {
        console.error("Search form not found.");
    }
});

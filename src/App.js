import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { WiDaySunny, WiCloud, WiRain, WiSnow, WiThunderstorm, WiFog } from 'react-icons/wi'; // Import weather icons

const App = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [time, setTime] = useState('');
  const [error, setError] = useState('');

  const openWeatherAPIKey = '5f4475fba502ddddec4c756b9a28a08d';
  const timeZoneDBAPIKey = 'LW6D0RB004GX';

  const fetchWeatherData = async () => {
    try {
      // Fetch weather data
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${openWeatherAPIKey}`
      );
      const { data: weatherData } = weatherResponse;
      setWeather(weatherData);

      // Fetch timezone data using latitude and longitude from weather data
      const { coord } = weatherData;
      const timeResponse = await axios.get(
        `http://api.timezonedb.com/v2.1/get-time-zone?key=${timeZoneDBAPIKey}&format=json&by=position&lat=${coord.lat}&lng=${coord.lon}`
      );
      const { formatted } = timeResponse.data;
      setTime(formatted);

      setError('');
    } catch (error) {
      setError('City not found. Please try again.');
      setWeather(null);
      setTime('');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city) {
      fetchWeatherData();
    }
  };

  const getWeatherIcon = (weatherMain) => {
    switch (weatherMain) {
      case 'Clear':
        return <WiDaySunny size={100} color="#f39c12" />;
      case 'Clouds':
        return <WiCloud size={100} color="#bdc3c7" />;
      case 'Rain':
        return <WiRain size={100} color="#3498db" />;
      case 'Snow':
        return <WiSnow size={100} color="#ecf0f1" />;
      case 'Thunderstorm':
        return <WiThunderstorm size={100} color="#9b59b6" />;
      case 'Mist':
      case 'Smoke':
      case 'Haze':
      case 'Fog':
        return <WiFog size={100} color="#95a5a6" />;
      default:
        return <WiDaySunny size={100} color="#f39c12" />;
    }
  };

  return (
    <>
      <div className="container text-center mt-5">
        <h1 className="display-4 mb-4">Weather Updates</h1>
        <form onSubmit={handleSearch} className="mb-5">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-dark mt-3">Search Weather</button>
        </form>

        {error && <div className="alert alert-danger">{error}</div>}

        {weather && (
          <div className="current-weather">
            <h2>{weather.name}, {weather.sys.country}</h2>
            <h6>Local Time: {time}</h6>
            <div className="d-flex justify-content-center align-items-center">
              {/* Weather Icon */}
              <div>{getWeatherIcon(weather.weather[0].main)}</div>
              
              {/* Weather details */}
              <div className="ml-3">
                <h3>{Math.round(weather.main.temp)}°C</h3>
                <p>{weather.weather[0].description}</p>
                <p>Feels like: {Math.round(weather.main.feels_like)}°C</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default App;

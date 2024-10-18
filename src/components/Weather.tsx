import "./weather.css";
import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import humidity_icon from "../assets/humidity.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface WeatherData {
  humidity: number;
  windSpeed: number;
  temperature: number;
  location: string;
  icon: string;
  iconDescription: string;
}

interface GeocodingResult {
  name: string;
}

const Weather = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const allIcons = useMemo(
    () => ({
      "01d": clear_icon,
      "01n": clear_icon,
      "02d": cloud_icon,
      "02n": cloud_icon,
      "03d": cloud_icon,
      "03n": cloud_icon,
      "04d": drizzle_icon,
      "04n": drizzle_icon,
      "09d": rain_icon,
      "09n": rain_icon,
      "10d": rain_icon,
      "10n": rain_icon,
      "13d": snow_icon,
      "13n": snow_icon,
    }),
    []
  );

  const getUserLocation = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetch(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${
                import.meta.env.VITE_APP_ID
              }`
            )
              .then((response) => response.json())
              .then((data) => {
                if (data && data.length > 0) {
                  resolve(data[0].name);
                } else {
                  reject("Cannot found city name");
                }
              })
              .catch(() => reject("Failed to get city name"));
          },
          () => reject("location permission denied")
        );
      } else {
        reject("Geolocation not support in this browser");
      }
    });
  };

  const checkGeolocationPermission = async () => {
    const result = await navigator.permissions.query({ name: "geolocation" });
    if (result.state === "denied") {
      alert("Location access denied. Please allow it in the browser settings.");
    }
  };

  useEffect(() => {
    checkGeolocationPermission();
  }, []);

  const search = useCallback(
    async (city: string) => {
      setError(null);
      setLoading(true);
      if (city === "") {
        try {
          const userCity = await getUserLocation();
          city = userCity;
        } catch (error) {
          console.error("Failed to get user location:", error);
          alert("Failed getting the location. Please insert city name");
          return;
        }
      }
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
          import.meta.env.VITE_APP_ID
        }`;

        const response = await fetch(url);
        const data = await response.json();
        //   console.log(data);
        if (!response.ok) {
          setError(data.message); // Set error message
          return;
        }
        const weatherIcon = data.weather[0].icon as keyof typeof allIcons;
        const icon =
          allIcons[weatherIcon] ||
          `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        const iconDescription = data.weather[0].main;
        setWeatherData({
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          temperature: Math.floor(data.main.temp),
          location: data.name,
          icon: icon,
          iconDescription: iconDescription,
        });
        setLoading(false);
      } catch (error) {
        setWeatherData(null);
        console.error("Error in fecthing weather data", error);
      }
    },
    [allIcons]
  );

  useEffect(() => {
    search("");
  }, [search]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (inputRef.current) {
        search(inputRef.current.value);
        setSuggestions([]);
      }
    }
  };

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    if (value.length > 2) {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${
            import.meta.env.VITE_APP_ID
          }`
        );
        const data: GeocodingResult[] = await response.json();
        setSuggestions(data.map((item: GeocodingResult) => item.name));
      } catch (error) {
        console.error("Error while getting the suggestion:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="weather">
      <div className="search-bar">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search city name..."
          onKeyDown={handleKeyPress}
          onChange={handleInputChange}
        />
        <img
          src={search_icon}
          alt="search"
          onClick={() => {
            if (inputRef.current) {
              search(inputRef.current.value);
              setSuggestions([]);
            }
          }}
        />
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => {
                if (inputRef.current) {
                  inputRef.current.value = suggestion;
                  search(suggestion);
                  setSuggestions([]);
                }
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      {weatherData ? (
        <>
          <img
            src={weatherData?.icon}
            alt={weatherData?.iconDescription}
            className="weather-icon"
          />
          <p className="temperature">{weatherData?.temperature}</p>
          <p className="location">{weatherData?.location}</p>
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="humidity" />
              <div>
                <p>{weatherData?.humidity}</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="wind" />
              <div>
                <p>{weatherData?.windSpeed}</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Weather;

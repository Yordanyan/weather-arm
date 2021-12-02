import React, { useEffect, useState } from 'react';
import { getFID } from 'web-vitals';
const api = {
  key: "94eec576403b905b0cc58804317578ea",
  base: "https://api.openweathermap.org/data/2.5/"
}
const gapi = {
  key: "AIzaSyBfh0HS_3bduN5KNVIVX0r_n5XIAaZxyZ4",
  base: "https://maps.googleapis.com/maps/api/geocode/"
}

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const status = document.querySelector('status');
  const successCallback = (position) =>{
    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    
    const geoApiUrl  = `${gapi.base}json?latlng=${lat},${long}
    &components=country:AM&language=en&key=${gapi.key}
    `;
    fetch(geoApiUrl).then(res => res.json()).then(data => {
   const geor = data.results[0].formatted_address;
   fetch(`${api.base}weather?q=${geor}&units=metric&APPID=${api.key}`)
    .then(res => res.json())
    .then(result => {
      setWeather(result);
      setQuery('');
     
    });
    })
    
     };
     
  const errorCallback = (error) =>{
    console.error(error);
  };
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);   
  }, []);



  const search = evt => {
    if (evt.key === "Enter") {
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(res => res.json())
        .then(result => {
          setWeather(result);
          setQuery('');
          
        });
    } else{
     return "hoo";
    }
  }

  const dateBuilder = (d) => {
    let months = ["Հունվար", "Փետրվար", "Մարտ", "Ապրիլ", "Մայիս", "Հունիս", "Հուլիս", "Օգոստոս", "Սեպտեմբեր", "Հոկտեմբեր", "Նոյեմբեր", "Դեկտեմբեր"];
    let days = ["Կիրակի", "Երկուշաբթի", "Երեքշաբթի", "Չորեքշաբթի", "Հինգշաբթի", "Ուրբաթ", "Շաբաթ"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`
  }

  return (
    <div className={(typeof weather.main != "undefined") ? ((weather.main.temp > 15) ? 'app warm' : 'app') : 'app'}>
      <main>
        <div className="search-box">
          <input 
            type="text"
            className="search-bar"
            placeholder="Search..."
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
          />
        </div>
        {(typeof weather.main != "undefined") ? (
        <div>
          <div className="location-box">
            <div className="location">{weather.name}, {weather.sys.country}</div>
            <div className="date">{dateBuilder(new Date())}</div>
          </div>
          <div className="weather-box">
            <div className="temp">
              {Math.round(weather.main.temp)}°c
            </div>
            
            <div className="weather">{weather.weather[0].main}</div>
          </div>
        </div>
         ) : (
          <div>
          <div className="location-box">
            <div className="location">Armenia </div>
            <div className="date">{dateBuilder(new Date())}</div>
          </div>
          <div className="weather-box">
            <div className="temps">
             Search For More Result
            </div>
            
          </div>
        </div>
         )}
        
      </main>
    </div>
    
  );
}

export default App;
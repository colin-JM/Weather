async function fetchData(latitude, longitude) {
  document.getElementById("sky").style.visibility = 'visible';
    const res=await fetch ("https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,snow_depth,freezinglevel_height,weathercode,pressure_msl,surface_pressure,cloudcover,visibility&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=auto");
    const record=await res.json();
document.getElementById("info").innerHTML=Math.round(record.current_weather.temperature) + "°F";
  //
  let hour = Number(record.current_weather.time.slice(11,13));
  let sunrise = Number(record.daily.sunrise[0].slice(11,13));
  let sunset = Number(record.daily.sunset[0].slice(11,13));
  let night = false;
  if ((hour <= sunrise) || (hour >= sunset)) {
    night = true;
  }
  let weathercode = record.current_weather.weathercode;
  if (weathercode == 0) {
    if (night) {
      document.getElementById("sky").innerHTML="Clear";
      document.getElementById("icon").innerHTML="clear_night";
    } else {
      document.getElementById("sky").innerHTML="Sunny";
      document.getElementById("icon").innerHTML="sunny";
    }
  } else if ((weathercode == 1) || (weathercode == 2)) {
    if (night) {
      document.getElementById("icon").innerHTML="partly_cloudy_night";
    } else {
      document.getElementById("icon").innerHTML="partly_cloudy_day";
    }
    document.getElementById("sky").innerHTML="Partly Cloudy";
  } else if (weathercode == 3) {
    document.getElementById("sky").innerHTML="Cloudy";
    document.getElementById("icon").innerHTML="cloudy";
  } else if ((weathercode == 45) || (weathercode == 48)) {
    document.getElementById("sky").innerHTML="Foggy";
    document.getElementById("icon").innerHTML="foggy";
  } else if ((weathercode == 51) || (weathercode == 53) || (weathercode == 55)) {
    document.getElementById("sky").innerHTML="Light Rain";
    document.getElementById("icon").innerHTML="rainy";
  } else if ((weathercode == 56) || (weathercode == 57)) {
    document.getElementById("sky").innerHTML="Light Freezing Rain";
    document.getElementById("icon").innerHTML="ac_unit";
  } else if ((weathercode == 61) || (weathercode == 63) || (weathercode == 65)) {
    document.getElementById("sky").innerHTML="Raining";
    document.getElementById("icon").innerHTML="rainy";
  } else if ((weathercode == 66) || (weathercode == 67)) {
    document.getElementById("sky").innerHTML="Freezing Rain";
    document.getElementById("icon").innerHTML="ac_unit";
  } else if (weathercode == 71) {
    document.getElementById("sky").innerHTML="Light Snow";
    document.getElementById("icon").innerHTML="weather_snowy";
  } else if (weathercode == 73) {
    document.getElementById("sky").innerHTML="Snowing";
    document.getElementById("icon").innerHTML="weather_snowy";
  } else if (weathercode == 75) {
    document.getElementById("sky").innerHTML="Heavy Snow";
    document.getElementById("icon").innerHTML="weather_snowy";
  } else if (weathercode == 77) {
    document.getElementById("sky").innerHTML="Snow Grains";
    document.getElementById("icon").innerHTML="grain";
  } else if ((weathercode == 80) || (weathercode == 81) || (weathercode == 82)) {
    document.getElementById("sky").innerHTML="Rain Showers";
    document.getElementById("icon").innerHTML="rainy";
  } else if ((weathercode == 85) || (weathercode == 86)) {
    document.getElementById("sky").innerHTML="Snow Showers";
    document.getElementById("icon").innerHTML="weather_snowy";
  } else if (weathercode == 95) {
    document.getElementById("sky").innerHTML="Thunderstorms";
    document.getElementById("icon").innerHTML="thunderstorm";
  } else if ((weathercode == 96) || (weathercode == 99)) {
    document.getElementById("sky").innerHTML="Severe Thunderstorms";
    document.getElementById("icon").innerHTML="thunderstorm";
  }
  if (record.current_weather.temperature <= 0) {
    document.getElementById("icon").innerHTML+=" severe_cold";
  }
  document.getElementById("highLow").innerHTML=record.daily.temperature_2m_max[0] + "°F / " + record.daily.temperature_2m_min[0] + "°F";

  const wind = record.current_weather.windspeed;
  document.getElementById("wind").innerHTML=wind + "mph";

  const humidity = record.hourly.relativehumidity_2m[hour];
  document.getElementById("humidity").innerHTML=humidity + "%";

  const feelsLike = record.hourly.apparent_temperature[hour];
  if (feelsLike < 32) {
    document.getElementById("feels-like").innerHTML="Feels Like: " + feelsLike + "°F"
  }
  
  document.getElementById("highLow").style.visibility = "visible";
  document.getElementById("sky").style.visibility = "visible";
  document.getElementById("boxOne").style.visibility = "visible";
  document.getElementById("boxTwo").style.visibility = "visible";
  document.getElementById("day1").style.visibility = "visible";
  document.getElementById("day2").style.visibility = "visible";
  document.getElementById("day3").style.visibility = "visible";
  document.getElementById("day4").style.visibility = "visible";
  document.getElementById("day5").style.visibility = "visible";
}

async function getCity(latitude, longitude) {
    const res=await fetch ("https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" + latitude + "&longitude=" + longitude + "8&localityLanguage=en");
    const record=await res.json();
  let country = record.countryCode;
  let subdivision = record.principalSubdivision;
  if (country == "US") {
    country = "";
  }
  if (record.city === subdivision) {
    subdivision = "";
    document.getElementById("city").innerHTML=record.city + ", " +   country;
  } else {
    document.getElementById("city").innerHTML=record.city + ", " + subdivision + ", " + country;
  }

}

    const message = document.querySelector('#city');

    if (!navigator.geolocation) {
        message.textContent = `Your browser doesn't support Geolocation`;
        message.classList.add('error');
    }
    const btn = document.querySelector('#show');
    btn.addEventListener('click', function () {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
      
      document.getElementById("today").style.backgroundColor = "#21D4FD";
      document.getElementById("today").style.backgroundImage = "linear-gradient(19deg, #21D4FD 0%, #B721FF 100%)";
      
      document.getElementById("forecast").style.backgroundColor = "#FFFFFF";
      document.getElementById("content-box").style.backgroundColor = "transparent";
      document.getElementById("content-box").style.backgroundImage = "none";
      document.getElementById("locPrompt").style.visibility = "hidden";
  
    });
    function onSuccess(position) {

        const {
            latitude,
            longitude
        } = position.coords;
        fetchData(latitude, longitude);
        getCity(latitude, longitude);
    }
    function onError() {
        message.classList.add('error');
        message.textContent = `Failed to get your location!`;
    }
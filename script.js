//display weather data and change other html assets
async function fetchData(latitude, longitude) {

  //get info from api
  document.getElementById("sky").style.visibility = 'visible';
    const res=await fetch ("https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,snow_depth,freezinglevel_height,weathercode,pressure_msl,surface_pressure,cloudcover,visibility&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=auto");
    const record=await res.json();

  //get current temp
  let currentTemp = Math.round(record.current_weather.temperature);
  document.getElementById("info").innerHTML=currentTemp + "°F";
  
  //gets time of day and sunset/sunrise (find if it is night or day)
  let hour = Number(record.current_weather.time.slice(11,13));
  let sunrise = Number(record.daily.sunrise[0].slice(11,13));
  let sunset = Number(record.daily.sunset[0].slice(11,13));
  let night = false;
  if ((hour <= sunrise) || (hour >= sunset)) {
    night = true;
  }
  let weathercode = record.current_weather.weathercode;

  //sets day background based on time of day
  if ((hour < sunrise) || hour > sunset) {
    document.getElementById("today").style.backgroundColor = "#283048";
    document.getElementById("today").style.backgroundImage = "linear-gradient(12deg, #283048 0%, #859398 100%)";
  } else if (hour == sunrise) {
    document.getElementById("today").style.backgroundColor = "#F3904F";
    document.getElementById("today").style.backgroundImage = "linear-gradient(202deg, #F3904F 0%, #3B4371 100%)";
  } else if (hour == sunset) {
    document.getElementById("today").style.backgroundColor = "#0B486B";
    document.getElementById("today").style.backgroundImage = "linear-gradient(12deg, #0B486B 0%, #F56217 100%)";
  } else if ((weathercode >= 0) && (weathercode <= 2)) {
    document.getElementById("today").style.backgroundColor = "#24C6DC";
    document.getElementById("today").style.backgroundImage = "linear-gradient(168deg, #24C6DC 0%, #514A9D 100%)";
  } else if ((weathercode == 71) || (weathercode == 73) || (weathercode == 75) || (weathercode == 77)) {
    document.getElementById("today").style.backgroundColor = "#4CA1AF";
    document.getElementById("today").style.backgroundImage = "linear-gradient(12deg, #4CA1AF 0%, #C4E0E5 100%)";
  } else {
    document.getElementById("today").style.backgroundColor = "#bbd2c5";
    document.getElementById("today").style.backgroundImage = "linear-gradient(202deg, #bbd2c5 0%, #536976 100%)";
  }

  //sets weather icon and weather event
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

  //severe cold event
  if (record.current_weather.temperature <= 0) {
    document.getElementById("icon").innerHTML+=" severe_cold";
  }

  //displays max and min temps for current day
  document.getElementById("highLow").innerHTML=record.daily.temperature_2m_max[0] + "°F / " + record.daily.temperature_2m_min[0] + "°F";

  //displays windspeed for current day
  const wind = record.current_weather.windspeed;
  document.getElementById("wind").innerHTML=wind + "mph";

  //displays humidity for current day
  const humidity = record.hourly.relativehumidity_2m[hour];
  document.getElementById("humidity").innerHTML=humidity + "%";

  //feels like temp for current time if feelsLike is below 32 and total precip
  const feelsLike = record.hourly.apparent_temperature[hour];
  const maxWindGusts = record.daily.windgusts_10m_max[0];
  if (feelsLike < 32) {
    document.getElementById("feels-like").innerHTML="Feels Like: " + feelsLike + "°F / Gusts: " + maxWindGusts + "mph";
  } else {
     document.getElementById("feels-like").innerHTML="Wind Gusts: " + maxWindGusts + "mph";
  }
  
  //hide & display HTML objects
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


//long and lat to city - display
async function getCity(latitude, longitude) {
    const res=await fetch ("https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" + latitude + "&longitude=" + longitude + "8&localityLanguage=en");
    const record=await res.json();
  let city = record.city;
  let country = ", " + record.countryCode;
  let subdivision = record.principalSubdivision;
  if (country == ", US") {
    country = " ";
  }
  if (record.city === subdivision) {
    subdivision = "";
    document.getElementById("city").innerHTML = city + country;
  } else if (city == "") {
    document.getElementById("city").innerHTML= subdivision + country;
  } else {
    document.getElementById("city").innerHTML = city + ", " + subdivision + country;
  }

  //fix if there is no city and no region
  if ((city == "") && (subdivision == "")) {
    document.getElementById("city").innerHTML = record.countryName;
  }

}



//removes html assets
if (!navigator.geolocation) {
        message.textContent = `Failed to get your location!`;
}
const btn = document.querySelector('#show');
btn.addEventListener('click', function () {
  navigator.geolocation.getCurrentPosition(onSuccess, onError);
      document.getElementById("today").style.backgroundColor = "#fff";
      document.getElementById("today").style.backgroundImage = "linear-gradient(19deg, #fff 0%, #fff 100%)";
      document.getElementById("forecast").style.backgroundColor = "#FFFFFF";
      document.getElementById("content-box").style.backgroundColor = "transparent";
      document.getElementById("content-box").style.backgroundImage = "none";
      document.getElementById("locPrompt").style.visibility = "hidden";
  
    });

//on geolocation success, find weather data
function onSuccess(position) {
  const {
    latitude,
    longitude
  } = position.coords;
  fetchData(latitude, longitude);
  getCity(latitude, longitude);
}

//prints failure on geolocation error
function onError() {
    message.textContent = `Failed to get your location!`;
}
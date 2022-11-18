


async function fetchData(latitude, longitude) {
    const res=await fetch ("https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&hourly=temperature_2m,apparent_temperature,precipitation,rain,showers,snowfall,snow_depth,freezinglevel_height,weathercode,pressure_msl,surface_pressure,cloudcover,visibility&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=auto");
    const record=await res.json();
document.getElementById("info").innerHTML=Math.round(record.current_weather.temperature) + "°F";
  let weathercode = record.current_weather.weathercode;
  if (weathercode == 0) {
    document.getElementById("sky").innerHTML="Clear Skies";
  } else if ((weathercode == 1) || (weathercode == 2) || (weathercode == 3)) {
    document.getElementById("sky").innerHTML="Party Cloudy";
  } else if ((weathercode == 45) || (weathercode == 48)) {
    document.getElementById("sky").innerHTML="Foggy";
  } else if ((weathercode == 51) || (weathercode == 53) || (weathercode == 55)) {
    document.getElementById("sky").innerHTML="Light Rain";
  } else if ((weathercode == 56) || (weathercode == 57)) {
    document.getElementById("sky").innerHTML="Light Freezing Rain";
  } else if ((weathercode == 61) || (weathercode == 63) || (weathercode == 65)) {
    document.getElementById("sky").innerHTML="Raining";
  } else if ((weathercode == 66) || (weathercode == 67)) {
    document.getElementById("sky").innerHTML="Freezing Rain";
  } else if (weathercode == 71) {
    document.getElementById("sky").innerHTML="Light Snow";
  } else if (weathercode == 73) {
    document.getElementById("sky").innerHTML="Snowing";
  } else if (weathercode == 75) {
    document.getElementById("sky").innerHTML="Heavy Snow";
  } else if (weathercode == 77) {
    document.getElementById("sky").innerHTML="Snow Grains";
  } else if ((weathercode == 80) || (weathercode == 81) || (weathercode == 82)) {
    document.getElementById("sky").innerHTML="Rain Showers";
  } else if ((weathercode == 85) || (weathercode == 86)) {
    document.getElementById("sky").innerHTML="Snow Showers";
  } else if (weathercode == 95) {
    document.getElementById("sky").innerHTML="Thunderstorms";
  } else if ((weathercode == 96) || (weathercode == 99)) {
    document.getElementById("sky").innerHTML="Severe Thunderstorms";
  }
}

async function getCity(latitude, longitude) {
    const res=await fetch ("https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" + latitude + "&longitude=" + longitude + "8&localityLanguage=en");
    const record=await res.json();
document.getElementById("city").innerHTML=record.city + " " + record.principalSubdivision;
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
      document.getElementById("locPrompt").style.visibility = 'hidden';
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
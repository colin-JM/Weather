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
  const d = new Date();
  let dayOfWeek = d.getDay();
  let night = false;
  if ((hour <= sunrise) || (hour >= sunset)) {
    night = true;
  }
  let weathercode = record.current_weather.weathercode;

  let gradient;
  //sets day background based on time of day
  if ((hour < sunrise) || hour > sunset) {
    document.getElementById("today").style.backgroundColor = "#283048";
    document.getElementById("today").style.backgroundImage = "linear-gradient(12deg, #283048 0%, #859398 100%)";
    document.getElementById("tempChart").style = "--color: linear-gradient(12deg, #283048 0%, #859398 100%)";
    gradient = "linear-gradient(12deg, #283048 0%, #859398 100%)";
  } else if (hour == sunrise) {
    document.getElementById("today").style.backgroundColor = "#F3904F";
    document.getElementById("today").style.backgroundImage = "linear-gradient(202deg, #F3904F 0%, #3B4371 100%)";
    document.getElementById("tempChart").style = "--color: linear-gradient(202deg, #F3904F 0%, #3B4371 100%)";
    gradient = "linear-gradient(202deg, #F3904F 0%, #3B4371 100%)";
  } else if (hour == sunset) {
    document.getElementById("today").style.backgroundColor = "#0B486B";
    document.getElementById("today").style.backgroundImage = "linear-gradient(12deg, #0B486B 0%, #F56217 100%)";
    document.getElementById("tempChart").style = "--color: linear-gradient(12deg, #0B486B 0%, #F56217 100%)";
    gradient = "linear-gradient(12deg, #0B486B 0%, #F56217 100%)";
  } else if ((weathercode >= 0) && (weathercode <= 2)) {
    document.getElementById("today").style.backgroundColor = "#24C6DC";
    document.getElementById("today").style.backgroundImage = "linear-gradient(168deg, #24C6DC 0%, #514A9D 100%)";
    document.getElementById("tempChart").style = "--color: linear-gradient(168deg, #24C6DC 0%, #514A9D 100%)";
    gradient = "linear-gradient(168deg, #24C6DC 0%, #514A9D 100%)";
  } else if ((weathercode == 71) || (weathercode == 73) || (weathercode == 75) || (weathercode == 77)) {
    document.getElementById("today").style.backgroundColor = "#4CA1AF";
    document.getElementById("today").style.backgroundImage = "linear-gradient(12deg, #4CA1AF 0%, #C4E0E5 100%)";
    document.getElementById("tempChart").style = "--color: linear-gradient(12deg, #4CA1AF 0%, #C4E0E5 100%)";
    gradient = "linear-gradient(12deg, #4CA1AF 0%, #C4E0E5 100%)";
  } else {
    document.getElementById("today").style.backgroundColor = "#bbd2c5";
    document.getElementById("today").style.backgroundImage = "linear-gradient(202deg, #bbd2c5 0%, #536976 100%)";
    document.getElementById("tempChart").style = "--color: linear-gradient(202deg, #bbd2c5 0%, #536976 100%)";
    gradient = "linear-gradient(202deg, #bbd2c5 0%, #536976 100%)";
  }
  
  setIconWMO(night, record, dayOfWeek, hour);

  //severe cold event
  if (record.current_weather.temperature <= 0) {
    document.getElementById("icon").innerHTML+=" severe_cold";
  }

  //displays max and min temps for current day
  document.getElementById("highLow").innerHTML = record.daily.temperature_2m_max[0] + "°F / " + record.daily.temperature_2m_min[0] + "°F";

  //displays windspeed for current day
  let wind = Math.round(record.current_weather.windspeed);
  document.getElementById("wind").innerHTML=wind + "mph";

  //displays humidity for current day
  const humidity = record.hourly.relativehumidity_2m[hour];
  document.getElementById("humidity").innerHTML=humidity + "%";

  //feels like temp for current time if feelsLike is below 32 and total precip
  const feelsLike = record.hourly.apparent_temperature[hour];
  const maxWindGusts = record.daily.windgusts_10m_max[0];
  if (feelsLike < 32) {
    document.getElementById("feels-like").innerHTML = "Feels Like: " + feelsLike + "°F / Gusts: " + Math.round(maxWindGusts) + "mph";
  } else {
     document.getElementById("feels-like").innerHTML = "Sunrise: " + record.daily.sunrise[0].slice(11,16) + " / Sunset: " + record.daily.sunset[0].slice(11,16);
  }

  //sets high and low temps for the forecast
  document.getElementById("highLowOne").innerHTML = record.daily.temperature_2m_max[1] + "°F / " + record.daily.temperature_2m_min[1] + "°F";
  document.getElementById("highLowTwo").innerHTML = record.daily.temperature_2m_max[2] + "°F / " + record.daily.temperature_2m_min[2] + "°F";
  document.getElementById("highLowThree").innerHTML = record.daily.temperature_2m_max[3] + "°F / " + record.daily.temperature_2m_min[3] + "°F";
  document.getElementById("highLowFour").innerHTML = record.daily.temperature_2m_max[4] + "°F / " + record.daily.temperature_2m_min[4] + "°F";
  document.getElementById("highLowFive").innerHTML = record.daily.temperature_2m_max[5] + "°F / " + record.daily.temperature_2m_min[5] + "°F";

  
  //hide & display HTML objects
  let classElements = document.getElementsByClassName("highLow");
  for (let i = 0; i < classElements.length; i++) {
    classElements[i].style.visibility = "visible";
  }
  document.getElementById("sky").style.visibility = "visible";
  document.getElementById("boxOne").style.visibility = "visible";
  document.getElementById("boxTwo").style.visibility = "visible";
  document.getElementById("dayOne").style.visibility = "visible";
  document.getElementById("dayTwo").style.visibility = "visible";
  document.getElementById("dayThree").style.visibility = "visible";
  document.getElementById("dayFour").style.visibility = "visible";
  document.getElementById("dayFive").style.visibility = "visible";
  document.getElementById("weatherData").style.visibility = "visible";

  //temp chart
  let setTimeAMPM = hour; //12 hr time
  let setTime = hour; //24hr time
  let hourCode = hour //hours up to the full week
  let ampm = "am";
  let temps = [];
  if (hour > 11) {
    ampm = "pm";
  }
  for (let i = 1; i < 10; i++) {
    //sets hour values on chart
    if (setTime >= 24) {
      setTime -= 24;
    }
    if (setTime > 11) {
      ampm = "pm";
    } else {
      ampm = "am";
    }
    if (setTimeAMPM > 11) {
      setTimeAMPM -= 12;
    }
   document.getElementById("p"+i.toString()).innerHTML = setTimeAMPM.toString() + ampm;
   if (setTimeAMPM.toString() + ampm=="0" + ampm) {
     document.getElementById("p"+i.toString()).innerHTML = "12" + ampm;
   }
   setTimeAMPM += 3;
   setTime += 3;
   //sets temps on the chart 
   temps[i-1] = record.hourly.temperature_2m[hourCode];
   hourCode += 3;
  }
  temps[9] = record.hourly.temperature_2m[hourCode];
  //find min and max temp in the next 24 hours
  let minTemp = temps[0];
  let maxTemp = temps[0];
  for (let i = 1; i < 9; i++) {
   if (temps[i] > maxTemp) {
      maxTemp = temps[i];
   } else if (temps[i] < minTemp) {
     minTemp = temps[i];
   }
  }
  //edit style
  for (let i = 0; i < 9; i++) {
   document.getElementById("point" + (i+1).toString()).style = "--start: " + ((temps[i]-minTemp)/(maxTemp-minTemp)) +"; --size: " + ((temps[i+1]-minTemp)/(maxTemp-minTemp));
   document.getElementById("pin" + (i+1).toString()).innerHTML = temps[i+1] + "°F";
  }

  //change graph per day
  //day 1
  document.getElementById("dayOne").addEventListener("mouseenter", (event) => {
    changeGraph("#ECF0F1", event);
  }, false);
  document.getElementById("dayOne").addEventListener("mouseleave", (event) => {
    changeGraph("#fff", event);
  }, false);
  //day 2
  document.getElementById("dayTwo").addEventListener("mouseenter", (event) => {
    changeGraph("#ECF0F1", event);
  }, false);
  document.getElementById("dayTwo").addEventListener("mouseleave", (event) => {
    changeGraph("#fff", event);
  }, false);
  //day 3
  document.getElementById("dayThree").addEventListener("mouseenter", (event) => {
    changeGraph("#ECF0F1", event);
  }, false);
  document.getElementById("dayThree").addEventListener("mouseleave", (event) => {
    changeGraph("#fff", event);
  }, false);
  //day 4
  document.getElementById("dayFour").addEventListener("mouseenter", (event) => {
    changeGraph("#ECF0F1", event);
  }, false);
  document.getElementById("dayFour").addEventListener("mouseleave", (event) => {
    changeGraph("#fff", event);
  }, false);
  //day 5
  document.getElementById("dayFive").addEventListener("mouseenter", (event) => {
    changeGraph("#ECF0F1", event);
  }, false);
  document.getElementById("dayFive").addEventListener("mouseleave", (event) => {
    changeGraph("#fff", event);
  }, false);

  
}
//function to avoid repeated code for changing graph per day
function changeGraph(color, passEvent) {
  passEvent.target.style.backgroundColor = color;
  passEvent.target.style.transition = "all 0.5s";
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

//WMO Code Output Function
function setIconWMO(valueNight, record, dayOfWeek, hour) {
  let textValue = "NULL";
  let idValue = "NULL";
  let valueWMO = 0;
  let runTimes = 1;
  for (let i=0; i < 6; i++) {
    textValue = "NULL";
    idValue = "NULL";
    if (i == 0) {
      valueWMO = record.current_weather.weathercode;
    } else {
      valueWMO = findWMOAverage(runTimes, record, hour);
      runTimes++;
    }
    if (valueWMO == 0) {
      if (valueNight && (i == 0)) {
        textValue = "Clear";
        idValue = "clear_night";
      } else {
        textValue = "Sunny";
        idValue = "sunny";
      }
    } else if ((valueWMO == 1) || (valueWMO == 2)) {
      if (valueNight && (i == 0)) {
        idValue = "partly_cloudy_night";
      } else {
        idValue = "partly_cloudy_day";
      }
       textValue = "Partly Cloudy";
    } else if (valueWMO == 3) {
      textValue = "Cloudy";
      idValue = "cloudy";
    } else if ((valueWMO == 45) || (valueWMO == 48)) {
      textValue = "Foggy";
      idValue = "foggy";
    } else if ((valueWMO == 51) || (valueWMO == 53) || (valueWMO == 55)) {
      textValue = "Light Rain";
      idValue = "rainy";
    } else if ((valueWMO == 56) || (valueWMO == 57)) {
      textValue = "Light Freezing Rain";
      idValue = "ac_unit";
    } else if ((valueWMO == 61) || (valueWMO == 63) || (valueWMO == 65)) {
      textValue = "Raining";
      idValue = "rainy";
    } else if ((valueWMO == 66) || (valueWMO == 67)) {
      textValue = "Freezing Rain";
      idValue = "ac_unit";
    } else if (valueWMO == 71) {
      textValue = "Light Snow";
      idValue = "weather_snowy";
    } else if (valueWMO == 73) {
      textValue = "Snowing";
      idValue = "weather_snowy";
    } else if (valueWMO == 75) {
      textValue = "Heavy Snow";
      idValue = "weather_snowy";
    } else if (valueWMO == 77) {
      textValue = "Snow Grains";
      idValue = "grain";
    } else if ((valueWMO == 80) || (valueWMO == 81) || (valueWMO == 82)) {
      textValue = "Rain Showers";
      idValue = "rainy";
    } else if ((valueWMO == 85) || (valueWMO == 86)) {
      textValue = "Snow Showers";
      idValue = "weather_snowy";
    } else if (valueWMO == 95) {
      textValue = "Thunderstorms";
      idValue = "thunderstorm";
    } else if ((valueWMO == 96) || (valueWMO == 99)) {
      textValue = "Severe Thunderstorms";
      idValue = "thunderstorm";
    }

    
    if (i == 0) {
      document.getElementById("sky").innerHTML = textValue;
      document.getElementById("icon").innerHTML = idValue;
    } else if (i == 1) {
      document.getElementById("dayOneIcon").innerHTML = idValue;
      document.getElementById("dayOneDate").innerHTML = getDayString(dayOfWeek);
    } else if (i == 2) {
      document.getElementById("dayTwoIcon").innerHTML = idValue;
      document.getElementById("dayTwoDate").innerHTML = getDayString(dayOfWeek);
    } else if (i == 3) {
      document.getElementById("dayThreeIcon").innerHTML = idValue;
      document.getElementById("dayThreeDate").innerHTML = getDayString(dayOfWeek);
    } else if (i == 4) {
      document.getElementById("dayFourIcon").innerHTML = idValue;
      document.getElementById("dayFourDate").innerHTML = getDayString(dayOfWeek);
    } else {
      document.getElementById("dayFiveIcon").innerHTML = idValue;
      document.getElementById("dayFiveDate").innerHTML = getDayString(dayOfWeek);
    }
    dayOfWeek++;
    if (dayOfWeek == 7) {
      dayOfWeek = 0;
    }
  }
}

function getDayString(dow) {
  let dows = "";
  if (dow == 0) {
    dows = "Sunday";
  } else if (dow == 1) {
    dows = "Monday";
  } else if (dow == 2) {
    dows = "Tuesday";
  } else if (dow == 3) {
    dows = "Wednesday";
  } else if (dow == 4) {
    dows = "Thursday";
  } else if (dow == 5) {
    dows = "Friday";
  } else if (dow == 6) {
    dows = "Saturday";
  }
  return dows;
}

//finds the most commonly occouring WMO code (wip)
function findWMOAverage(day, rcrd, hour) {
  let curr = '{"weatherCurr":[' +
'{"weatherType":45,"occurrences":0 },' +
'{"weatherType":51,"occurrences":0 },' +
'{"weatherType":56,"occurrences":0 }, ' +
'{"weatherType":85,"occurrences":0 },' +
'{"weatherType":77,"occurrences":0 },' +
'{"weatherType":96,"occurrences":0 }]}';
  const obj = JSON.parse(curr);
 //foggy, rainy, freezing rain, weather snowy, grains, thunderstorms
  let mf = 1;
  let mff, item, secondItem, valueWMO, startingIndex = 0;
  for (let i = 0; i < day; i++) {
    if (day != 1) {
      startingIndex += 24;
    }
  }
  startingIndex += hour;
  for (let i=0; i<24; i++) {
    valueWMO = rcrd.hourly.weathercode[i+startingIndex];
    if ((valueWMO == 45) || (valueWMO == 48)) {
      obj.weatherCurr[0].occurrences++;
    } else if ((valueWMO == 51) || (valueWMO == 53) || (valueWMO == 55) || (valueWMO == 61) || (valueWMO == 63) || (valueWMO == 65)) {
      obj.weatherCurr[1].occurrences++;
    } else if ((valueWMO == 56) || (valueWMO == 57) || (valueWMO == 66) || (valueWMO == 67)) {
      obj.weatherCurr[2].occurrences++;
    } else if ((valueWMO == 85) || (valueWMO == 86) || (valueWMO == 73) || (valueWMO == 75) || (valueWMO == 71)) {
      obj.weatherCurr[3].occurrences++;
    } else if (valueWMO == 77) {
      obj.weatherCurr[4].occurrences++;
    } else if ((valueWMO == 96) || (valueWMO == 99) || (valueWMO == 95)) {
      obj.weatherCurr[5].occurrences++;
    }
    for (let j=i; j<24; j++) {
      if (rcrd.hourly.weathercode[i+startingIndex] == rcrd.hourly.weathercode[j+startingIndex]) {
        mff++;
        if (mf < mff){
          mf = mff; 
          item = rcrd.hourly.weathercode[i+startingIndex];
        }
      }
    }
    mff = 0;
  }
  mf = 1;
  mff = 0;
  for (let i=0; i<6; i++) {
      if (obj.weatherCurr[i].occurrences > mf) {
          mf = obj.weatherCurr[i].occurrences;
          secondItem = obj.weatherCurr[i].weatherType;
      }
    mff = 0;
  }
  if (secondItem == 45) {
    if (mf >= 10) {
      item = secondItem;
    }
  } else if (mf >= 6) {
    item = secondItem;
  }
  return item;
}
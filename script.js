async function fetchData() {
    const res=await fetch ("https://api.open-meteo.com/v1/forecast?latitude=28.54&longitude=-81.38&hourly=temperature_2m,apparent_temperature,precipitation,rain,showers,snowfall,snow_depth,cloudcover,cloudcover_low,cloudcover_mid,cloudcover_high,visibility&daily=weathercode,temperature_2m_max,temperature_2m_min&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=auto");
    const record=await res.json();
    document.getElementById("info").innerHTML=record.latitude;
}
fetchData();
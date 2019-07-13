# Sunny Where?

A simple single page app with Node that shows the closest sunny city, based on results from the MetaWeather API <https://www.metaweather.com/api/>

- Once a day uses Axios on Nodejs to query MetaWeather for the status of 88 of the most populated cities in the world
- Search uses MetaWeather location finder to enable autocomplete
- Results are grouped by weather type and sorted by distance to your city

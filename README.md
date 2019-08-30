# Sunny Where?

A simple single page app that shows the closest sunny city, based on results from the MetaWeather API <https://www.metaweather.com/api/>

## Overview

- Once a day uses the Heroku Scheduler to trigger a staggered axios query to MetaWeather for the status of 88 of the most populated cities in the world
- Search uses MetaWeather location finder to enable autocomplete
- Results are grouped by weather type and sorted by distance to your city

## 5 min Video Walk-through

Click image to start walk-through

[![5 min video walk-through](https://img.youtube.com/vi/O4JtN2I7xDQ/0.jpg)](https://www.youtube.com/watch?v=O4JtN2I7xDQ)

## Stack

- Node
- SemanticUI
- MetaWeather API
- Axios
- EJS
- jQuery

## Screenshot

![Sunnywhere Screenshot](sunnywhere.png)

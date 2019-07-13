// Import express npm
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const axios = require('axios');
const cities = require('./cities.json')
 
// Setup server port or the localhost dev port
const PORT = process.env.PORT || 4000;

// Database
const db = require('./models');

// View Engine
app.set('view engine', 'ejs');

// Middleware ========================= //
// bodyparser middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Serve static public directory
app.use(express.static(__dirname + '/public'));

// Routes ============================= //
app.get('/', (req, res) => {
  db.City.find({})
  .catch(err => res.json({error: err}))
  .then(cities => {
    const sunnyCities = cities.filter(city => city.type === 'Clear')
    const sadCities = cities.filter(city => city.type != 'Clear')
    res.render('index', {sunnyCities, sadCities});
  })
});

app.get('/search', (req, res) => {
  let city = req.query.city;
  // console.log(city)
  // res.json({results: [
  //   {
  //     title: city
  //   }
  // ]})
  // let test = "San Francisco";
  axios.get(`https://www.metaweather.com/api/location/search/?query=${city}`)
    .then(function (response) {
      // handle response
      if (response) {
        res.json({results: response.data})
      }
    })
    .catch(function (error) {
      // handle error
      console.log('Update Endpoint Error: ', error)
      return res.json({error})
    });
})

// Index of all Cities in the DB
app.get('/cities', (req, res) => {
  db.City.find({})
    .catch(err => res.json({error: err}))
    .then(cities => res.json({cities: cities}))
});

// Update endpoint which triggers staggered updates for all the cities
app.get('/update', (req, res) => {
  // loop through each city one at a time and update
  // delay between each to be kind to the MetaWeather api
  let index = 0;
  loopCityUpdate(cities, index);
  res.send('<h2>Update Started. You can close this page.</h2>');

  function loopCityUpdate(cities, index) {
    // Wait on each loop before trying for the next one
    setTimeout(() => {
      updateCity(cities[index].woeid)
      index++
      if (cities.length > index) {
        // still more cities, call again
        loopCityUpdate(cities, index)
      }
    }, 500)
  }
  function updateCity(cityId) {
    // get a single city's info
    axios.get(`https://www.metaweather.com/api/location/${cityId}/`)
    .then(function (response) {
      // handle response
      // fill in the returned name and id
      if (response) {
        console.log('response for city ', cityId);
        const { data } = response;
        let city = {
          name: data.title,
          woeid: data.woeid,
          latlong: data.latt_long,
          entryDate: 'Unknown',
          type: ' Unknown',
          typeShorthand: 'Unknown',
        }
        // if weather info, fill that in as well
        if (data.consolidated_weather.length > 0) {
          city = {
            ...city,
            entryDate: data.consolidated_weather[0].applicable_date,
            type: data.consolidated_weather[0].weather_state_name,
            typeShorthand: data.consolidated_weather[0].weather_state_abbr,
          }
        }
        // add to db, updating or creating new
        db.City.findOneAndUpdate({woeid: city.woeid}, city, {upsert: true})
          .catch(err => {
            console.log(
              {error: err})
          })
          .then(() => {
            // console.log({db: 'saved', response: city})
          })
      }
    })
    .catch(function (error) {
      // handle error
      console.log('Update Endpoint Error: ', error)
    });
  }
})

// Server ============================= //
app.listen(PORT, () => console.log(`Server started on port: ${PORT}.`));
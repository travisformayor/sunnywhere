// Import express npm
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const axios = require('axios');
 
// Setup server port or the localhost dev port
const PORT = process.env.PORT || 4000;

// Database
const db = require('./models');

// Middleware ========================= //
// bodyparser middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Serve static public directory
app.use(express.static(__dirname + '/public'));

// Routes ============================= //
// // Sanity test starter route
// app.get('/', (req, res) => {
//   res.send('<h1>Test</h1>')
// });

app.get('/', (req, res) => {
  res.sendFile('/views/index.html', {root: __dirname});
});

// City data
app.get('/cities', (req, res) => {
  db.City.find({})
    .catch(err => res.json({error: err}))
    .then(cities => res.json({cities: cities}))
});

app.get('/update', (req, res) => {
  // get a single city's info
  axios.get('https://www.metaweather.com/api/location/2487956/')
  .then(function (response) {
    // handle response
    // console.log('Axios: ', response);
    // fill in the returned name and id
    if (response) {
      const { data } = response;
      // console.log('response: ', response)
      let city = {
        name: data.title,
        woeid: data.woeid,
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
      // add to db
      db.City.findOneAndUpdate({woeid: city.woeid}, city, {upsert:true})
        .catch(err => res.json({error: err}))
        .then(() => res.json({db: 'saved', response: city}))
      // return res.json({result: city})
    }
  })
  .catch(function (error) {
    // handle error
    console.log('Update Endpoint Error: ', error)
    return res.json({error})
  });
})

// Server ============================= //
app.listen(PORT, () => console.log(`Server started on port: ${PORT}.`));
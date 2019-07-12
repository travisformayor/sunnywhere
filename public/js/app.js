console.log('####################');
console.log('Oh hi! Curious about the code used to build this site? Good news it\'s open source! You can find everything here:');
console.log('https://github.com/travisformayor/sunnywhere');
console.log('Feel free to fork or send me a PR request \\o/');
console.log(' - Travis');
console.log('####################');

// // Add all cities to the list
// console.log(CITIES[0]);
function appendCity(city, resultDate, result, resultShorthand) {
  let cityHTML = `
    <tr class="${result === 'Clear' ? 'positive' : 'negative'}">
      <td>
        ${resultShorthand ? 
          `<img 
            src="https://www.metaweather.com/static/img/weather/${resultShorthand}.svg" 
            class="ui mini centered image">`
          : '' }
      </td>
      <td data-label="City">${city.name}</td>
      <td data-label="City ID">${city.cityId}</td>
      <td data-label="Weather State" class="result">${result === 'Clear' ? 'Sunny' : result}</td>
      <td data-label="Weather Date">${resultDate}</td>
    </tr>
  `;
  // Update progress
  $('#load-status').text(`Loading ${city.cityIndex+1}/${city.total}`)
  if (city.cityIndex >= city.total-2) {
    $('#load-status').text('')
  }
  // Add the city result
  $('#city-list').append(cityHTML);
  // sort the table
  sortTable(3, 'text');
}

function getCity(city) {
  // city: cities[cityIndex].city,
  // cityId: cities[cityIndex].woeid,
  // cityIndex: cityIndex,
  // total: cities.length
  // const API_URL = 'https://www.metaweather.com/api/location/search/?query=';
  let resultDate = 'Unknown';
  let result = 'Unknown';
  let resultShorthand;
  const API_URL = 'https://www.metaweather.com/api/location/';
  const urlSend = `${API_URL}${city.cityId}/`
  // console.log(urlSend);

  const request = {
      method: 'GET',
      url: urlSend,
      dataType: 'json',
      contentType: 'application / x-www-form-urlencoded',
      xhrFields: {
        withCredentials: true
      },
      success: handleSuccess,
      error: handleError,
  }
  $.ajax(request);
  
  function handleError(error) {
    console.log('Error: ', {error});
    appendCity(city, resultDate, result, resultShorthand);
  };
  function handleSuccess(response) {
    // console.log(response);
    if (response) {
      city.name = response.title;
      city.cityId = response.woeid;
      if (response.consolidated_weather.length > 0) {
        resultDate = response.consolidated_weather[0].applicable_date;
        result = response.consolidated_weather[0].weather_state_name;
        resultShorthand = response.consolidated_weather[0].weather_state_abbr;
      }
    }
    appendCity(city, resultDate, result, resultShorthand);
  };
}

let cityIndex = 0;

function getCities(cities) {
  // console.log(cityIndex)
  setTimeout(() => {
    const city = {
      name: cities[cityIndex].city,
      cityId: cities[cityIndex].woeid,
      cityIndex: cityIndex,
      total: cities.length
    }
    getCity(city)
    cityIndex++
    if (cityIndex < cities.length) {
      getCities(cities);
    }
  }, 250) // be kind to the api endpoint
}

getCities(CITIES); // from cities.js

// // Sort Table
// https://stackoverflow.com/a/49956577
function sortTable(column, type) {
  //Sort the table
  $('.table tbody tr').sort(function(a, b) {
    // a and b are the 2 parameters being compared. 
    // Since you are sorting rows, a and b are <tr>                                 

    //Find the <td> using the column number and get the text value.
    //Now, the a and b are the text of the <td>
    a = $(a).find('td:eq(' + column + ')').text();
    b = $(b).find('td:eq(' + column + ')').text();

    switch (type) {
      case 'text':
        //Proper way to compare text in js is using localeCompare
        //If order is ascending you can - a.localeCompare(b)
        //If order is descending you can - b.localeCompare(a);
        return b.localeCompare(a);
        break;
      case 'number':
        //You can use deduct to compare if number.
        //If order is ascending you can -> a - b. 
        //Which means if a is bigger. It will return a positive number. b will be positioned first
        //If b is bigger, it will return a negative number. a will be positioned first
        return b - a;
        break;
    }
  }).appendTo('.table tbody');
}
// sortTable(2, 'text');
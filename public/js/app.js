console.log('####################');
console.log('Oh hi! Curious about the code used to build this site? Good news it\'s open source! You can find everything here:');
console.log('https://github.com/travisformayor/sunnywhere');
console.log('Feel free to fork or send me a PR request \\o/');
console.log(' - Travis');
console.log('####################');

// // Add all cities to the list
// console.log(CITIES[0]);

const getCity = (city) => {
  const API_URL = 'https://www.metaweather.com/api/location/search/?query=';
  const urlSend = `${API_URL}${city}`
  console.log(urlSend);
  const request = {
      method: 'GET',
      url: urlSend,
      // dataType: 'json',
      // crossDomain : true,
      // headers: {  'Access-Control-Allow-Origin': '*' },
      success: handleSuccess,
      error: handleError,
  }
  $.ajax(request);
  
  function handleError(error) {
    console.log(`Error: ${error}`);
    console.log(error);
    let cityHTML = `
      <tr>
        <td data-label="City">${city}</td>
        <td data-label="ID">Unknown</td>
        <td data-label="Result">API Error</td>
      </tr>
    `;
    $('#city-list').append(cityHTML);
  };
  function handleSuccess(response) {
    console.log(response);
    let title = city;
    let woeid = 'Unknown'
    let result = 'No Result'
    if (response.length > 0) {
      title = response[0].title;
      woeid = response[0].woeid;
      result = 'Success'
    }
    let cityHTML = `
      <tr>
        <td data-label="City">${title}</td>
        <td data-label="ID">${woeid}</td>
        <td data-label="Result">${result}</td>
      </tr>
    `;
    $('#city-list').append(cityHTML);
  };
}

// getCity('tokyo')
const cityTest = [
  'test1',
  'tokyo',
  'miami',
  'san francisco',
  'tokyo',
  'san francisco',
]

let cityLoop = 0;

const getCities = (cities) => {
  console.log('before:', cityLoop)

  setTimeout(async () => {
    await getCity(cities[cityLoop])
    cityLoop++
    console.log('after:', cityLoop)
    if (cityLoop < cities.length) {
      getCities(cityTest);
    }
  }, 1000)
}

getCities(cityTest);

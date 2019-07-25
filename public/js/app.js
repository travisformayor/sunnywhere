console.log('####################');
console.log('Oh hi! Curious about the code used to build this site? Good news it\'s open source! You can find everything here:');
console.log('https://github.com/travisformayor/sunnywhere');
console.log('Feel free to fork or send me a PR request \\o/');
console.log(' - Travis');
console.log('####################');

// Put focus on the search box
$('input.prompt').focus().select()

// Search for matching cities
$('.ui.search').search({
  apiSettings: {
    action: 'search', 
    url: 'search/?city={query}'
  },
  type: 'standard',
  minCharacters: 3,
})

// On search grab the selected city
$("input.prompt").on('keyup', (e) => {
  // is the search box no longer empty?
  if (!$('.ui.search').search('is empty')) {
    // No longer empty, get the searched city
    let city = $('.ui.search').search('get result');
    updateCityCard(city);
    // Start checking for updates and new searchs
    setInterval(() => {
      // watch for a new city
      // get the cities info and update the card and distances
      if (city != $('.ui.search').search('get result')) {
        city = $('.ui.search').search('get result')
        updateCityCard(city);
      }
    },500)
  }
});
function updateCityCard(city) {
  $('#city-name').text(city.title);
  $('#latlon').text(`Lat Lon: ${city.latt_long}`);
  showCityResult();
  getDistances(city.latt_long);
  sortSunnyDistance(5);
  updateClosest();
}
function updateClosest() {
  const cityName = $('#sunny-city-list tr:first').children('td.name-cell')[0].innerText;
  const milesTo = $('#sunny-city-list tr:first').children('td.distance-cell')[0].innerText;
  $('#closest-city').text(cityName);
  $('#distance').text(milesTo);
}

// // Unhide the city and the result
function showCityResult() {
  $('#city-boxes').removeClass('hide-city').addClass('show-city');
}

// // Calculate the distance between Latitudes and Longitudes
function parseLatLon(latlonStr) {
  const latlon = latlonStr.split(',');
  let cords = [];
  cords[0] = parseFloat(latlon[0].trim());
  cords[1] = parseFloat(latlon[1].trim());
  return cords;
}
function getDistances(startPoint) {
  // parse the city lat lon as a number
  if (startPoint) {
    // if receive new lat and lon...
    const startCords = parseLatLon(startPoint);
    // loop each distance cell and add the distance
    $('.distance-cell').each(function() {
      // get the lat lon and parse it to numbers
      const cityLatLonStr = $(this).attr('data-latlon')
      const cityCords = parseLatLon(cityLatLonStr);
  
      const miles = getDistanceLatLonInMiles(startCords[0], startCords[1], cityCords[0], cityCords[1])
      $(this).text(`${miles} miles`)
      $(this).attr('data-miles', miles)
    });
  }
}
function getDistanceLatLonInMiles(latitude1,longitude1,latitude2,longitude2) {
  // // https://www.tutorialsplane.com/javascript-calculate-distance-between-latitude-longitude-points/
  var p = 0.017453292519943295;    //This is  Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((latitude2 - latitude1) * p)/2 + 
          c(latitude1 * p) * c(latitude2 * p) * 
          (1 - c((longitude2 - longitude1) * p))/2;
  var R = 6371; //  Earth distance in km so it will return the distance in km
  var dist = 2 * R * Math.asin(Math.sqrt(a)); 
  var miles = dist / 1.609344; 
  return parseInt(miles); 
}

// // Sort the Sunny results by distance
function sortSunnyDistance(column) {
  // https://stackoverflow.com/a/49956577
  //Sort the table
  $('#sunny-city-list tr').sort(function(a, b) {
    // a and b are the 2 parameters being compared. 
    // Since you are sorting rows, a and b are <tr>                                 

    //Find the <td> using the column number and get the attribute value.
    a = $(a).find('td:eq(' + column + ')').attr('data-miles');
    b = $(b).find('td:eq(' + column + ')').attr('data-miles');
    // compare them to see which is bigger
    // switching the a and the b's order changes the sort direction
    return a - b;
  })
  .appendTo('#sunny-city-list');
}
// sortSunnyDistance(5)

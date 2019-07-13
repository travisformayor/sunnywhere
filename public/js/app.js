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
    // Start checking for search results
    setInterval(() => {
      let city = $('.ui.search').search('get result');
      if (city) {
        $('#city-name').text(city.title)
        $('#latlon').text(city.latt_long)
      }
    },500)
  }
});

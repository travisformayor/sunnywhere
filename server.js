// Import express npm
const express = require('express');
const app = express();
// Setup server port or the localhost dev port
const PORT = process.env.PORT || 4000;

// Database

// Middleware ========================= //
// CORS

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

// Server ============================= //
app.listen(PORT, () => console.log(`Server started on port: ${PORT}.`));
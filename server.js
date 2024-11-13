const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 8080; // Port where you want to serve the data

app.use(cors());

// Serve the data.json file
app.get('/data.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'data.json'));  // Assuming data.json is in the root directory
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

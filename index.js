const express = require('express'),
      mongoose = require('mongoose'),
	  app = express();

const env = require('./config/database.config.js'),
	environment = new env();

//load expressjs configs
require('./config/express.config')(app);

mongoose.connect(environment.connstring)

// load model
const ReviewData = require('./models/review_data.model.js')(mongoose);

//loading up my routes and passing the app instance to it
require("./routes")(app, ReviewData);

app.listen(environment.port);

console.log('listening on port ' + environment.port)

exports = module.exports = app;
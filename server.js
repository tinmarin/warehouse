// BASE SETUP
// ======================================

// CALL THE PACKAGES --------------------
var express    = require('express');		
var app        = express(); 				
var bodyParser = require('body-parser'); 	
var morgan     = require('morgan'); 		
var mongoose   = require('mongoose');
var config 	   = require('./config');
var path 	   = require('path');

// APP CONFIGURATION ==================
// ====================================
//grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
	next();
});

// log all requests to the console 
app.use(morgan('dev'));


mongoose.connect(config.database);

// set static files location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/public'));

// ROUTES FOR OUR API =================
// ====================================

// API ROUTES ------------------------
var authRoutes = require('./server/routes/auth')(app, express);
var apiRoutes = require('./server/routes/api')(app, express);

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// MAIN CATCHALL ROUTE --------------- 
// SEND USERS TO FRONTEND ------------
// has to be registered after API ROUTES
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// START THE SERVER
// ====================================
app.listen(config.port);
console.log('Magic happens on port ' + config.port);
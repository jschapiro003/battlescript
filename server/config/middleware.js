var morgan = require('morgan');
var bodyParser = require('body-parser');
var helpers = require('./helpers.js');
var passport = require('passport');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');


module.exports = function (app, express) {
  // define routers
  var userRouter = express.Router();
  var duelRouter = express.Router();
  var battleRouter = express.Router();

  // express middlewars
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));
   //passport authentication middleware
  app.use(cookieParser());
  app.use(expressSession({secret: 'mySecretKey' }));
  app.use(passport.initialize());
 // app.use(passport.session());
  

//************
  // Initialize Passport
  
  var initPassport = require('../passport/init');
  initPassport(passport);

//************

  //headers
  app.use(function (req, res, next) {
    console.log('hi')
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

 

  // api paths for various routes
  app.use('/api/users', userRouter);
  app.use('/api/duels', duelRouter);
  app.use('/api/battles', battleRouter);
  
  // authentication middleware used to decode token and made available on the request
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);
  
  // require necessary route files
  require('../users/userRoutes.js')(userRouter,passport);
  require('../duels/duelRoutes.js')(duelRouter);
  require('../battles/battleRoutes.js')(battleRouter);


};

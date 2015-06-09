var app = require('express')(),
    bodyParser = require('body-parser'),
    http = require('http').Server(app),
    os = require('os'),
    url = require('url'),
    util = require('util'),
    passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    session = require('express-session'),
    cookieParser = require("cookie-parser"),
    methodOverride = require('method-override');



//Parse POST data
// configure Express
  //app.set('views', __dirname + '/views');
  //app.set('view engine', 'ejs');
  //app.use(logger());
  app.use(cookieParser());
 // app.use(bodyParser());
  app.use(methodOverride());
  app.use(session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  //app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));

var FACEBOOK_APP_ID = "645944772172397"
var FACEBOOK_APP_SECRET = "61fd085698aa1917c38c81c60ed3dd18";

var hostname = os.hostname();
var port = 8080;
var server;


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Facebook profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
    console.log(user+",passport.serializeUser");
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
    console.log(JSON.stringify(obj)+",passport.deserializeUser");
  done(null, obj);
});

// Use the FacebookStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Facebook
//   profile), and invoke a callback with a user object.
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:8080/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(accessToken + "," + refreshToken + "," + profile);
    console.log(JSON.stringify(profile));
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Facebook profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Facebook account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

app.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res){
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
  });


// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/', function (req, res) {
     console.log("Logs:");
    res.sendFile(__dirname + '/index.html');
});

app.get('/res/*', function(req, res) {
    res.sendFile(__dirname + '/res/' + req.params[0]);
});

app.get('/testgetform', function (req, res) {
	console.log("firstname=%s",req.query.firstname);
	console.log("lastname=%s",req.query.lastname);
    
    var user = {
        firstname: req.query.firstname,
        lastname: req.query.lastname
    };

    var userJson = JSON.stringify(user);
    
    var headers = {
        'Content-Type': 'application/json',
        'Content-Length': userJson.length
    };

	res.writeHead(200, headers);
	res.write(userJson);
    res.end();
});

app.post('/testpostform', function (req, res) {
	console.log("firstname=%s",req.body.firstname);
	console.log("lastname=%s",req.body.lastname);

    var user = {
        firstname: req.body.firstname,
        lastname: req.body.lastname
    };

    var userJson = JSON.stringify(user);
    
    var headers = {
        'Content-Type': 'application/json',
        'Content-Length': userJson.length
    };
    
    res.writeHead(200, headers);
    res.write(userJson);
    res.end();
    });

server = http.listen(port, function(){
    console.log("listening on http://%s:%d", hostname, port);
});

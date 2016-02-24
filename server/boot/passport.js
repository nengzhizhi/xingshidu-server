module.exports = function (app) {
  var loopback = require('loopback');
  var bodyParser = require('body-parser');

  // to support JSON-encoded bodies
  app.use(bodyParser.json());
  // to support URL-encoded bodies
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  //// The access token is only available after boot
  app.use(app.loopback.token({
    model: app.models.accessToken
  }));

  app.use(loopback.cookieParser(app.get('cookieSecret')));
  app.use(loopback.session({
    secret: app.get('cookieSecret'),
    saveUninitialized: true,
    resave: true
  }));

  var config = false;
  try {
    config = require('../passport-providers.json');
  } catch (err) {
    console.error('Please configure your passport strategy in `passport-providers.json`.');
  }

  if (config) {
    var loopbackPassport = require('loopback-component-passport');
    var PassportConfigurator = loopbackPassport.PassportConfigurator;
    var passportConfigurator = new PassportConfigurator(app);

    //Step 1
    passportConfigurator.init();

    //Step 2
    passportConfigurator.setupModels({
      userModel: app.models.user,
      userIdentityModel: app.models.userIdentity,
      userCredentialModel: app.models.userCredential
    });

    // Configure passport strategies for third party auth providers
    for(var s in config) {
     var c = config[s];
     c.session = c.session !== false;
     passportConfigurator.configureProvider(s, c);
    }
  }

}

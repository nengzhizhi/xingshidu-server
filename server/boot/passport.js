module.exports = function (app) {
  var loopback = require('loopback');
  var bodyParser = require('body-parser');
  var WeixinStrategy = require('passport-weixin');
  var OpenIDStrategy = require('passport-openid').Strategy;

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
    var passport = passportConfigurator.init();

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

  //FIXME
  var userIdentityModel = app.models.userIdentity;
  app.post('/auth/openid', function (req, res) {
    if (!req.body || !req.body.profile || !req.body.accessToken) {
      return res.end(JSON.stringify({
        name: "登录错误",
        status: 500,
        message: "参数错误！"
      }));
    }

    if (req.body.provider != 'weixin') {
      return res.end(JSON.stringify({
        name: "登录错误",
        status: 500,
        message: "只支持微信登录！"
      }));
    }

    userIdentityModel.login(req.body.provider, 'oAuth 2.0', req.body.profile, {
      accessToken: req.body.accessToken,
      refreshToken: req.body.refreshToken
    }, {
      autoLogin: true
    }, function (err, user, identity, token) {
      if (!!err) {
        res.end(JSON.stringify(err));
      } else {
        res.end(JSON.stringify({
          accessToken: token.id,
          userId: user.id
        }));
      }
    })
  })
}

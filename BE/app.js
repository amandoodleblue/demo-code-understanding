const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const app = express();

app.enable("trust proxy");

const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const googleconfig = require('./src/configs/googleconfig')

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

passport.use(new GoogleStrategy({
  clientID: googleconfig.googleAuth.clientID,
    clientSecret: googleconfig.googleAuth.clientSecret,
    callbackURL: googleconfig.googleAuth.callbackURL
},
function(accessToken, refreshToken, profile, done) {
   // userProfile=profile;
    return done(null, profile);
}
));

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

app.use(
  require("morgan")("dev", {
    skip: function (req, res) {
      return res.statusCode > 500;
    }
  })
);

// console.log(process.argv)
const args = process.argv.slice(2)[0];
if (!args) {
  console.log("Error : Please provide environment");
} else {
  process.env.CONFIG_ARG = args;
  if (!(/PROD/).test(process.env.CONFIG_ARG)) {
    require("dotenv").config({
      path: path.join(process.cwd(), `.env.${args.toLocaleLowerCase()}`)
    });
    const { CustomLogger } = require("./src/middleware/logger");
    let appLogger = new CustomLogger();

    app.use(appLogger.requestDetails(appLogger));
  }
  let CONFIG = require("./src/configs/config")(args);
  let { DB_CHOICE } = require('./src/configs/thirdpartyConfig')
  const swaggerDocument = require("./docs/swagger.json");
  const { handler } = require("./src/middleware/errorHandler");

  const routers = require("./src/routes");
  const opts = {
    explorer: false,
    swaggerOptions: {
      validatorUrl: null
    },
    customSiteTitle: "Doodleblue User Auth Service",
    customfavIcon: "https://www.doodleblue.com/favicon/16x16.png"
  };

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, opts));
  app.use("/health", (req, res) => {
    res.status(200).json({ status: "success", message: "Running successfully" })
  });
  // app.use("/", (req, res, next) => {
  //   res.redirect("/docs")
  // })
  app.set('view engine', 'ejs');
  app.get('/', function(req, res) {
  res.render('pages/auth');
});
  routers(app);
  app.use(handler);
  
  const port = CONFIG.PORT || 2172;

  let dbConn;
  switch (DB_CHOICE) {
    case "MONGO":
      dbConn = require("./src/database/mongo/db.config");
      break;
    default:
      throw new Error("Database Type not defined");
    //   break;
  }
  dbConn()
    .then(() => {
      app.listen(port, () => console.log(`App listening at port ${port}`));
    })
    .catch(console.error);  

}

module.exports = app;
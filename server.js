const express = require("express");
const app = express();
const mongoose = require("mongoose");
const router = express.Router();
const config = require("config");
const session = require("express-session");
const redis = require("redis");
const RedisStore = require("connect-redis")(session);

//session using redis
const REDIS_PORT = 6379;
const redisClient = redis.createClient({
  host: "localhost",
  port: REDIS_PORT,
});

//env variable name for mongoDB connection string declared in config
const db_URI = config.get("mongoURI");

//Routes Path
const RegisterUser = require("./routes/RegisterUser");
const Login = require("./routes/Login");
const Logout = require("./routes/Logout");

//check connection with redis
redisClient.on("error", function (err) {
  console.log("Could not establish connection with redis error: " + err);
});
redisClient.on("connect", function (err) {
  console.log("connected to redis");
});

//initialize Session
app.use(
  session({
    secret: "sessionSecret",
    store: new RedisStore({
      client: redisClient,
    }),
    saveUninitialized: false,
    resave: false,
    cookie: {
      secure: false,
      httpOnly: false,
      maxAge: 1000 * 60 * 30, // 30 min
    },
  })
);

//Connecting to mongodb
mongoose
  .connect(db_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("connected to mongoDb"))
  .catch((err) => console.error(err));
mongoose.set("useCreateIndex", true);

//Enable CROS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-auth-token"
  );
  next();
});

app.use(express.json());

app.get("/", (req, res, next) => {
  const sess = req.session;
  if (sess.userName && sess.password) {
    if (sess.userName) {
      res.send("Your are logged In");
    }
  } else {
    next();
  }
});

//Routes
app.use("/api/register", RegisterUser);
app.use("/api/login", Login);
app.use("/api/logout", Logout);

const port = process.env.PORT || 6001;
app.listen(port, () => {
  console.log(`Server listening at port:${port}`);
});

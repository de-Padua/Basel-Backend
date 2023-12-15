const app = require("express");
const route = app.Router();
const USER_MODEL = require("../models/user");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const SESSION_MODEL = require("../models/session");
const { v4: uuidv4 } = require("uuid");



const userController = require("../controllers/userControllers")

//config
route.use(cookieParser());
route.use(cors({ origin: "  http://localhost:3000", credentials: true }));

//routes
route.post("/user/create/new", jsonParser,userController.createUser);
route.get("/user/get/current", jsonParser,userController.currentUser);
route.post("/user/login", jsonParser,userController.loginUser);


module.exports = route;

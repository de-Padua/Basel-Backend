const app = require("express");
const route = app.Router();


//vitals
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const cookieParser = require("cookie-parser");
const cors = require("cors");

//controllers
const userController = require("../controllers/userControllers")

//config
route.use(cookieParser());
route.use(cors({ origin: ["https://basel-plum.vercel.app"], credentials: true }));

//routes
route.post("/user/create/new", jsonParser,userController.createUser);
route.get("/user/get/current", jsonParser,userController.currentUser);
route.post("/user/login", jsonParser,userController.loginUser);
route.post("/user/logout", jsonParser,userController.logOut);
route.patch("/user/profile/edit", jsonParser ,userController.manageProfile);
route.get("/user/:userid", jsonParser ,userController.getUser);
route.get("/",jsonParser,async (req,res)=>{
    res.status(200).json({data:"ok"})
})

module.exports = route;

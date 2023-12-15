const app = require("express");
const route = app.Router();



//vitals
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const cookieParser = require("cookie-parser");

//config
const teamController = require("../controllers/teamControllers")
const cors = require("cors");
route.use(cors({ origin: "  http://localhost:3000", credentials: true }));
route.use(cookieParser());


route.post("/team/create/new", jsonParser,teamController.createNewTeam );
route.get("/team/:id", jsonParser, teamController.currentTeamById);
route.post("/team/newtask", jsonParser,teamController.createNewTask )

module.exports = route;

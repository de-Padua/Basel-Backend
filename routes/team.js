const app = require("express");
const route = app.Router();
const team_model = require("../models/teams");

//vitals
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const cookieParser = require("cookie-parser");

//config
const teamController = require("../controllers/teamControllers");
const cors = require("cors");
route.use(
  cors({
    origin: ["https://basel-plum.vercel.app", "localhost:3000"],
    credentials: true,
  })
);
route.use(cookieParser());

route.post("/team/create/new", jsonParser, teamController.createNewTeam);
route.get("/team/:id", jsonParser, teamController.currentTeamById);
route.post("/team/newtask", jsonParser, teamController.createNewTask);
route.patch(
  "/team/:teamid/task/:taskid/addcomment",
  jsonParser,
  teamController.addNewComment
);
route.post("/team/invite/user", jsonParser, teamController.manageInvite);
route.post("/team/add/user", jsonParser, teamController.addNewUserToTeam);
route.post("/team/config", jsonParser, teamController.handleTeamConfig);
route.post("/team/deleteUser", jsonParser, teamController.deleteUserFromTeam);

const changeStream = team_model.watch();

// Listen for changes
changeStream.on("change", (change) => {
  console.log("Change detected:", change);
  // Handle the change here
});

module.exports = route;

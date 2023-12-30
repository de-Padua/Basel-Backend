const app = require('express')
const route = app.Router()
const taskControllers = require("../controllers/tasksControllers")
const TASK_MODEL = require("../models/task")



//vitals
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const cookieParser = require("cookie-parser");

const cors = require("cors");
route.use(cors({ origin: "*"}));
route.use(cookieParser());



route.get("/tasks/:id",jsonParser,taskControllers.getTaskById)
route.patch("/tasks/addcomment/:taskid",jsonParser,taskControllers.addNewcomment)
route.patch('/tasks/:x/comment',jsonParser,taskControllers.manageTask)
route.patch('/tasks/edit/',jsonParser,taskControllers.editTask)


const changeStream = TASK_MODEL.watch();

  // Listen for changes
  changeStream.on('change', change => {
    console.log('Change detected:', change);
    // Handle the change here
  });



module.exports  = route
require('dotenv').config()
const express = require('express')
const users_route = require("./routes/users")
const teams_route = require("./routes/team")
const mongoose = require('mongoose')
const app = express()
const port = 3030


app.listen(port)
app.use(users_route)
app.use(teams_route)


//set db connection

mongoose.connect(process.env.DB_URL);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

db.once("open", () => {
  console.log("Connect to database");
})

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  
  name: {
    type: String,
    require: true,
  },
  bio:{
    type:String,
    require: false,

  },
  password: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  teams: {
    type: Array,
  },
  
});







module.exports = mongoose.model("users", userSchema);

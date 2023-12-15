const mongoose = require('mongoose')


const session_model = new mongoose.Schema({
    session_id:{
        type:String,
        require:true
    },
    user_magnet:{
        type:String,
        require:true
    },
})


module.exports = mongoose.model('session',session_model)
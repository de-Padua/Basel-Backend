
const mongoose = require('mongoose')



  const teamSchema = new mongoose.Schema({
    teamName: {
      type:String,
      require:true
    },
    teamId: {
      type:String,
      require:true
    },
    invite_link: {
      type:String,
      require:true
    },
    users: [
      {
        name: {
          type:String,
          require:true
        },
       
        _id:{
          type:String,
          require:true

        }
      },
    ],
    tasks: [],
    closed_tasks: [],
    adm:[]
  });


  module.exports = mongoose.model('teams',teamSchema)
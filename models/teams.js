
const mongoose = require('mongoose')


const commentSchema = new mongoose.Schema({
    owner: {
      type:String,
      require:true
    },
    id: {
      type:String,
      require:true
    },
    comment: {
      type:String,
      require:true
    },
    date: {
      type: Date,
      require:true
    },
  });
  
  const taskSchema = new mongoose.Schema({
    title: {
      type:String,
      require:true
    },
    description: {
      type:String,
      require:true
    },
    comments: [commentSchema],
  });
  
  const teamSchema = new mongoose.Schema({
    teamName:{
      Type:String
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
        password: {
          type:String,
          require:true
        },
        email: {
          type:String,
          require:true
        },
      },
    ],
    tasks: [],
    closed_tasks: [],
  });


  module.exports = mongoose.model('teams',teamSchema)
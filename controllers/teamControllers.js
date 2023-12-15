
const SESSION_MODEL = require("../models/session");
const TEAM_MODEL = require("../models/teams");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  createNewTeam: async (req, res) => {
    const clientSessionCookie = req.cookies["sid"];

    const findIfSessionExists = await SESSION_MODEL.findOne({
      session_id: clientSessionCookie,
    });
    if (findIfSessionExists) {
      const currentUser = await USER_MODEL.findOne({
        email: findIfSessionExists.user_magnet,
      });

      const newTeam = new TEAM_MODEL({
        teamName: req.body.teamName,
        teamId: req.body.teamId,
        invite_link: `invite.com/${req.body.teamId}`,
        users: [{ name: currentUser.name, email: currentUser.email }],
        tasks: [],
        closed_tasks: [],
      });

      await newTeam.save();
      await USER_MODEL.findOneAndUpdate(
        { email: currentUser.email },
        {
          teams: [
            ...currentUser.teams,
            { teamId: newTeam.teamId, teamName: req.body.teamName },
          ],
        }
      );

      res.status(200).json({ data: "ok" });
    }
  },
  currentTeamById: async (req,res) =>{
    const team = await TEAM_MODEL.findOne({ teamId: req.params.id });
    if (team) {
      res.status(200).json({ status: "success", data: team });
    }
  },
  createNewTask: async (req,res) =>{
    
  const team = await TEAM_MODEL.findOne({ teamId: req.body.teamId });
  await TEAM_MODEL.findOneAndUpdate(
    { teamId: req.body.teamId },
    { tasks: [...team.tasks, req.body.task] }
  );

  res.status(200)

 
  }
};

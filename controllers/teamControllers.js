const SESSION_MODEL = require("../models/session");
const TEAM_MODEL = require("../models/teams");
const TASK_MODEL = require("../models/task");
const { v4: uuidv4 } = require("uuid");
const USER_MODEL = require("../models/user");

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
        invite_link: req.body.teamId,
        users: [{ name: currentUser.name, _id: currentUser._id }],
        tasks: [],
        closed_tasks: [],
        adm: [{ _id: currentUser._id }],
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
  currentTeamById: async (req, res) => {
    const team = await TEAM_MODEL.findOne({ teamId: req.params.id });

    const tasks = await TASK_MODEL.find({ teamId: req.params.id });

    const data = { ...team, tasks: tasks };
    if (team) {
      res
        .status(200)
        .json({ status: "success", data: { ...team._doc, tasks: tasks } });
    }
  },
  createNewTask: async (req, res) => {
    
    try {
      const team = await TEAM_MODEL.findOne({ teamId: req.body.teamId });
      const createNewTask = new TASK_MODEL(req.body.task);
      await createNewTask.save();
      await TEAM_MODEL.findOneAndUpdate(
        { teamId: req.body.teamId },
        { tasks: [...team.tasks, req.body.task.id] }
      );
      res.status(200).send("Task created successfully");
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).send("Internal Server Error");
    }
  },
  addNewComment: async (req, res) => {},
  manageInvite: async (req, res) => {
    try {
      const clientSessionCookie = req.cookies["sid"];

      if (!clientSessionCookie) return;

      const validSession = await SESSION_MODEL.findOne({
        session_id: clientSessionCookie,
      });

      if (!validSession) return;

      const teamId = req.body.teamId;

      const team = await TEAM_MODEL.findOne({ teamId: teamId });

      res.status(200).json({ data: team });
    } catch (err) {
      console.log(err);
    }
  },
  addNewUserToTeam: async (req, res) => {
    const userData = req.body.user;
    const teamData = req.body.team;

    console.log(userData);

    //update user
    try {
      const user = await USER_MODEL.findOneAndUpdate(
        { _id: userData.id },
        { $push: { teams: teamData } }
      );
      const team = await TEAM_MODEL.findOneAndUpdate(
        { teamId: teamData.teamId },
        { $push: { users: {name:req.body.user.name,_id:req.body.user.id} } }
      );

      res.status(200).json({ status: "ok" });
    } catch (err) {
      console.log(err);
    }

    //update team
  },
  handleTeamConfig: async (req, res) => {
    const action = req.body.action;

    const clientSessionCookie = req.cookies["sid"];

    if (!clientSessionCookie) return;

    try {
      const validSession = await SESSION_MODEL.findOne({
        session_id: clientSessionCookie,
      });

      if (!validSession) res.status(404);

      switch (action) {
        case "changeTeamName":
          const updateTeamName = await TEAM_MODEL.findOneAndUpdate(
            { teamId: req.body.data.teamId },
            { teamName: req.body.data.newTeamName }
          );
          const updateUserData = await USER_MODEL.findOne({
            id: req.body.data.userId,
          });

          const targetTeam = updateUserData.teams.find(
            (team) => team.teamId === req.body.data.teamId
          );

          targetTeam.teamName = req.body.data.newTeamName;

          await USER_MODEL.findOneAndUpdate(
            { id: req.body.data.userId },
            updateUserData
          );

          res.status(200).json({ ok: true });

          break;
        case "deleteTeam":
          const data = await TEAM_MODEL.findOneAndDelete({
            teamId: req.body.data.teamId,
          });

          console.log(data, "aaaaaa");
          res.status(200).json({ ok: true });

          break;
        default:
        // code block
      }
    } catch (err) {
      console.log(err);
    }
  },
  deleteUserFromTeam: async (req, res) => {
    const _id = req.body._id;
    const teamId = req.body.teamId;

    console.log(req.body);

    try {
      const team = await TEAM_MODEL.findOneAndUpdate(
        { teamId: teamId },
        { $pull: { users: { _id: _id } } },
        { new: true }
      );
      const user = await USER_MODEL.findByIdAndUpdate(
        req.body._id,
        { $pull: { teams: { teamId: teamId } } },
        { new: true }
      );

      res.status(200).json({status:200})
    } catch (err) {
      console.log(err);
    }
  },
};

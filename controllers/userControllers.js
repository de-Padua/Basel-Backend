const USER_MODEL = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const SESSION_MODEL = require("../models/session");
const cookieParser = require("cookie-parser");
const TEAM_MODEL = require("./../models/teams");

module.exports = {
  createUser: async (req, res) => {
    let fieldsFromRequest = { ...req.body };

    const checkFields = async (fields) => {
      let isValid = true;

      for (let i = 0; i < fields.length; i++) {
        if (fieldsFromRequest[fields[i]] === undefined) {
          isValid = false;
        }
      }

      return isValid;
    };
    const validateFields = await checkFields(["name", "email", "password"]);

    if (!validateFields) {
      res
        .status(400)
        .json({
          status: "fail",
          data: null,
          message: "Missing fields",
        })
        .end();
    } else {
      const checkIfEmailAlreadyExistsOnDB = await USER_MODEL.findOne({
        email: fieldsFromRequest.email,
      });
      console.log(checkIfEmailAlreadyExistsOnDB);

      if (!checkIfEmailAlreadyExistsOnDB) {
        const saltRounds = 10;
        const decriptedPassword = req.body.password;
        bcrypt.genSalt(saltRounds, function (err, salt) {
          bcrypt.hash(decriptedPassword, salt, async function (err, hash) {
            if (err) throw err;

            const newSessionId = uuidv4();
            const newCriptedPassword = hash;

            const user = {
              name: req.body.name,
              password: newCriptedPassword,
              email: req.body.email,
              teams: [],
            };

            const newSessionObject = new SESSION_MODEL({
              session_id: newSessionId,
              user_magnet: req.body.email,
            });
            const newUserObject = new USER_MODEL(user);

            try {
              await newSessionObject.save();
              await newUserObject.save();

              res
                .cookie("sid", newSessionObject.session_id, {
                  secure: true,
                  httpOnly: true,
                  sameSite: "none",
                })
                .json({
                  status: "success",
                  data: newUserObject,
                  message: "User added sucessfully to DB",
                })
                .end();
            } catch (err) {
              res
                .status(500)
                .json({
                  status: "fail",
                  data: null,
                  message: err,
                })
                .end();
            }
          });
        });
      } else {
        res
          .status(200)
          .json({
            status: "fail",
            data: null,
            message: "Email already in use",
          })
          .end();
      }
    }
  },
  currentUser: async (req, res) => {
    const clientSessionCookie = req.cookies["sid"];

    const findIfSessionExists = await SESSION_MODEL.findOne({
      session_id: clientSessionCookie,
    });

    if (findIfSessionExists) {
      const currentUser = await USER_MODEL.findOne({
        email: findIfSessionExists.user_magnet,
      });

      const ids = currentUser.teams.map((team) => team.teamId);

      const nTeam = await TEAM_MODEL.find().where("teamId").in(ids).exec();

      const { password, ...userDataWithoutPassword } = currentUser._doc;

      const newData = { ...userDataWithoutPassword, teams: nTeam };

      res
        .json({
          status: "success",
          data: newData,
          message: "Valid session id",
        })
        .end();
    } else {
      res
        .clearCookie("sid")
        .json({
          status: "fail",
          data: "",
          message: "Invalid session id",
        })
        .end();
    }
  },
  logOut: async (req, res) => {
    const clientSessionCookie = req.cookies["sid"];

    try {
      const findIfSessionExists = await SESSION_MODEL.findOneAndDelete({
        session_id: clientSessionCookie,
      });

      if (findIfSessionExists) {
        res.clearCookie("sid").json({ data: "ok" });
      }
    } catch (err) {
      console.log(err);
    }
  },
  loginUser: async (req, res) => {
    const options = {
      new: true,
      upsert: true,
    };

    const user = await USER_MODEL.findOne({ email: req.body.email });
    const match = await bcrypt.compare(req.body.password, user.password);

    if (match) {
      await SESSION_MODEL.findOneAndDelete({
        user_magnet: req.body.email,
      });

      const oneHour = 60 * 60 * 1000;

      const newSession = new SESSION_MODEL({
        session_id: uuidv4(),
        user_magnet: req.body.email,
      });

      await newSession.save();

      res
        .cookie("sid", newSession.session_id, {
          maxAge: oneHour,
          httpOnly: true,
        })
        .json({
          status: "success",
          data: null,
          message: "Creating new session id",
        })
        .end();
    } else {
      res
        .status(400)
        .json({
          status: "fail",
          data: null,
          message: "something went wrong",
        })
        .end();
    }
  },
  manageProfile: async (req, res) => {
    const clientSessionCookie = req.cookies["sid"];

    const session = await SESSION_MODEL.findOne({
      session_id: clientSessionCookie,
    });

    if (!session) res.status(300).send("invalid session");

    await USER_MODEL.findByIdAndUpdate(req.body.id, {
      bio: req.body.bio,
    });

    res.status(200).json({ status: "ok" });
  },
  getUser: async (req, res) => {
    console.log(req)
    const id = req.params.userid;

    try {
      const data = await USER_MODEL.findById(id);
      console.log(data)
      if (data !== null) {
        res.status(200).json({ resp: {name:data.name,bio:data.bio} });
      } else {
        res.status(400).json({resp:"fail"});
      }
    } catch (err) {
      throw err;
    }
  },
};

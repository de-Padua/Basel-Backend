const app = require("express");
const route = app.Router();
const USER_MODEL = require("../models/user");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const SESSION_MODEL = require("../models/session");
const { v4: uuidv4 } = require("uuid");

route.use(cookieParser());
route.use(cors({ origin: "  http://localhost:3000", credentials: true }));

route.post("/user/create/new", jsonParser, async (req, res) => {
  let fieldsFromRequest = { ...req.body };
 
  console.log(fieldsFromRequest)


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
});

route.get("/user/get/current", jsonParser, async (req, res) => {

  const clientSessionCookie = req.cookies["sid"];

  const findIfSessionExists = await SESSION_MODEL.findOne({
    session_id: clientSessionCookie,
  });

  if (findIfSessionExists) {
    const currentUser = await USER_MODEL.findOne({
      email: findIfSessionExists.user_magnet,
    });

    const { password, email, ...userDataWithoutPassword } = currentUser._doc;
    res
      .json({
        status: "success",
        data: userDataWithoutPassword,
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
});

route.post("/user/login", jsonParser, async (req, res) => {
  
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
    res.status(400)
    .json({
      status: "fail",
      data: null,
      message: "something went wrong",
    })
    .end();
  }

  //if user doesn't exists,notify user that credentials may be wrong
});
module.exports = route;

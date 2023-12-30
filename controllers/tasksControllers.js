const TASK_MODEL = require("../models/task");
const USER_MODEL = require("../models/user");
const SESSION_MODEL = require("../models/session");
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  getTaskById: async (req, res) => {
    const id = req.params.id;

    const sid = req.cookies["sid"];

    const findSessions = await SESSION_MODEL.findOne({ session_id: sid });

    if (!findSessions) {
      res.status(400).json({ data: "error" });
    } else {
      try {
        const task = await TASK_MODEL.findOne({ id: id });
        if (task) {
          res.status(200).json({ data: task });
        }
      } catch (err) {
        console.log(err);
      }
    }
  },
  addNewcomment: async (req, res) => {
    const id = req.params.taskid;

    console.log("oi");

    try {
      const oldTasks = await TASK_MODEL.findOne({ id: id });
      console.log(oldTasks);
      const task = await TASK_MODEL.findOneAndUpdate(
        { id: id },
        {
          comments: [...oldTasks.comments, req.body.comment],
          feed: [
            ...oldTasks.feed,
            {
              id: uuidv4(),
              action: "Added a new commentary",
              time: new Date(),
              name: req.body.comment.owner,
            },
          ],
        }
      );

      if (task) {
        res.status(200);
      }
    } catch (err) {
      console.log(err);
    }
  },
  manageTask: async (req, res) => {
    const typeOFAction = req.body.action;
    const id = req.params.x;
    const oldComment = req.body.comment_id.id;
    const newComment = req.body.comment;
    const sid = req.cookies["sid"];
    const task = await TASK_MODEL.findOne({ id: id });

    const findSessions = SESSION_MODEL.findOne({ session_id: sid });

    if (!findSessions) {
      res.status(400).send("user not allowed");
    } else {

      switch (typeOFAction) {
        case "edit":
          const comment = task.comments.find((x) => x.id === oldComment);

          comment.text = newComment.text;

          await TASK_MODEL.findOneAndUpdate({ id: id }, task);

          break;

        case "delete":
          const newComments = task.comments.filter((x) => x.id !== oldComment);

          const newTaks = { ...task._doc, comments: newComments };

          await TASK_MODEL.findOneAndUpdate({ id: id }, newTaks);

          break;

        case "reply":
          const x = { ...req.body.comment, reply_to: req.body.reply_to };
           await TASK_MODEL.findOneAndUpdate(
            { id: id },
            {
              $push: {
                comments: x,
                feed: {
                  id: uuidv4(),
                  action: "Added a new reply",
                  time: new Date(),
                  name: req.body.comment.owner,
                },
              },
            }
          );

          break;
      }
    }
  },
  editTask: async (req, res) => {
    const taskId = req.body.taskId;

    const sid = req.cookies["sid"];

    const findSessions = await SESSION_MODEL.findOne({ session_id: sid });

    if (!findSessions) {
      res.status(400).json({ data: "error" });
    } else {
      try {
        const updatedTask = await TASK_MODEL.findOneAndUpdate(
          { id: taskId },
          {
            $set: {
              ...req.body.task,
            },
          },
          { new: true }
        );
        const updatedData = await TASK_MODEL.findOneAndUpdate(
          { id: taskId },
          {
            $push: {
              feed: {
                id: uuidv4(),
                action: req.body.action,
                time: new Date(),
                name: req.body.owner,
              },
            },
          },
          { new: true }
        );

        console.log(data);
      } catch (err) {
        console.log(err);
      }
    }
  },
};

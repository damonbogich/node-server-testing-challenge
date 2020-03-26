const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const authRouter = require("../auth/auth-router.js");
const usersRouter = require("../users/users-router.js");
const restricted = require("../auth/restricted-middleware.js");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/api/auth", authRouter);
server.use("/api/users", restricted, checkRole("user"), usersRouter);

server.get("/", (req, res) => {
  res.send("It's alive!");
});

module.exports = server;

function checkRole(role) {
  return (req, res, next) => {
    if (
      req.decodedToken && //if theres a decoded token
      req.decodedToken.department &&//if the decoded token has a role property
      req.decodedToken.department.toLowerCase() === role//does it equal what's passed into the checkRole function
    ) {
      next();
    } else {
      res.status(403).json({ you: "shall not pass!" });
    }
  };
}
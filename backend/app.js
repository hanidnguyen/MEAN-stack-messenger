//import path so that any operating system can construct the path correctly
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//import routes
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();

//connect to mongodb with mongoose
mongoose
  .connect(
    "mongodb+srv://Hani:" +
    process.env.MONGO_ATLAS_PW +
    "@cluster0.vqyni.mongodb.net/node-angular"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

//bodyParser provides Express middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//we have not given permission to access the images file,
//this code allows it.
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

//use imported routes, /posts for posts, /user for user related routes
app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;

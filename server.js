const express = require("express");
const path = require("path");
const cors = require("cors");

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '10d545fab2e740a1a8dd7f7436ec309c',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

const app = express();


const students = ["Maria"]

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
    rollbar.info("HTML file served successfully");
});

app.get("/api/students", (req, res) => {
    rollbar.info("Someone got the list for students on page load");
    res.status(200).send(students);
});


app.post("api/students", (req, res) => {
    let {name} = req.body;
    name = name.trim();

    const index = students.findIndex((studentName) => studentName === name);
     if (index === -1 && name !== "") {
         students.push(name);
         rollbar.log("Student added successfully", {author: "Maria", type: "manual entry"});
         res.status(200).send(students);
     } else if(name === "") {
         rollbar.error("No name given");
         res.status(400).send("Must provide a name");
     } else {
         rollbar.error("Student already exists");
         res.status(400).send("That student already exist");
     };
     
})

app.use(rollbar.errorHandler());

const port = process.env.PORT || 4545;

app.listen(port, () => {
    console.log(`They're taking the Hobbits to ${port}`);
});
// Dependencies
const express = require("express");
const fs = require("fs");
const path = require("path");

// Express configuration
//Tells node that we are creating an 'express' server
const app = express();

// Sets an initial port.
const port = process.env.PORT || 3000;

let db = require("./db/db.json");
const uniqid = require("uniqid");

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/api/notes", (_req, res) => {
  console.log(db);
  res.json(db);
});

app.post("/api/notes", (req, res) => {
  req.body.id = uniqid();
  db.push(req.body);
  let newTextData = JSON.stringify(db);
  fs.writeFile(__dirname + "/./db/db.json", newTextData, (err) => {
    if (err) throw err;
  });
  res.end();
});

app.delete("/api/notes/:id", (req, res) => {
  const index = req.params.id;
  const filterDelete = db.filter((note) => {
    return note.id != index;
  });
  let newTextData = JSON.stringify(filterDelete);
  db = filterDelete;
  fs.writeFile(__dirname + "/./db/db.json", newTextData, (err) => {
    if (err) throw err;
  });
  res.end();
});

app.get("/notes", (_req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
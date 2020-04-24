// Dependencies
var express = require("express");
var path = require("path");
var fs = require("fs");
var dotenv = require("dotenv");
require('dotenv').config()

// Read array from db.json and declare as storedNotes
var storedNotes = require("../models/db/db.json");

// Declare id variable to keep track of notes
var id;
// get id from id.txt file
fs.readFile("../models/db/id.txt", "UTF-8", function(err, res) {
    console.log(res);
    id = res;
})

const db = path.join(__dirname, "../models/db/db.json");
const textId = path.join(__dirname, "../models/db/id.txt");

// Sets up the Express App
var app = express();
var portNumber = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/styles", express.static(path.join(__dirname, '../public')));
app.use("/js", express.static(path.join(__dirname, '../controller')));

// Standard routes to GET html pages
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../views/index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "../views/notes.html"));
});

app.get("/savednotes", function(req, res) {
    res.sendFile(path.join(__dirname, "../views/savednotes.html"));
});

// Route to GET saved notes from db.json file
app.get("/api/notes", function(req, res) {
    return res.json(storedNotes);
});

// Route to GET current id from id.txt file
app.get("/api/id", function(req, res) {
    return res.json(id);
});

// Route to DELETE a specific note
// Naming the request URL "ID"
app.delete("/api/notes/:ID", function(req, res) {
    // req.params = whatever the ajax request sends over
    console.log(req.params);
    // filter in notes that don't have the id of the note that was deleted
    storedNotes = storedNotes.filter(x => {
            return x.id != req.params.ID;
        })
        // write filtered array of notes to db.json file
    fs.writeFile("../db/db.json", JSON.stringify(storedNotes), function(err, response) {
        // Send msg back in case front end wishes to use message
        res.send("Deleted note with ID: " + req.params.ID);
    })
})

// Route to DELETE all saved notes
app.delete("/api/clear", function(req, res) {
    // Assign array to blank
    storedNotes = [];
    // Write blank array into db.json file
    fs.writeFile(db, JSON.stringify(storedNotes), function(err, response) {
        console.log("Cleared all notes");
        // Write id.txt to "1" to reset IDs
        fs.writeFile(textId, 1, function(err, idwrite) {
            console.log("Reset ID to 1");
            res.json("Cleared notes");
        });
    });
});

// Route to create / POST new notes
app.post("/api/notes", function(req, res) {
    // declare variable to include id from id.txt into the object sent from front-end (req.body)
    var newNote = { id: id, ...req.body };
    // add newNote to array - for easy access
    storedNotes.push(newNote);

    // read db.json to get current array of notes
    fs.readFile(db, "UTF8", function(err, resp) {
        var dbArray = JSON.parse(resp);

        // add newNote to array and stringify
        dbArray.push(newNote);
        dbArray = JSON.stringify(dbArray);

        // write new array back into db.json
        fs.writeFile(db, dbArray, function(err, response) {
            // increment the id and write it back to id.txt
            id++;
            fs.writeFile(textId, id, function(err, respo) {
                res.json(newNote);
            });
        })
    })
});


// Starts the server to begin listening
app.listen(process.env.PORT || 3000, function() {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
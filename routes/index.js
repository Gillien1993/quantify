var express = require('express');
var app = express();
var router = express.Router();

//the task array with initial placeholders for added task
var task = ["buy socks", "practise with nodejs"];
var complete = ["finish jquery"];

// Post route for adding new task
router.post('/addtask', function (req, res) {
    var newTask = req.body.newtask;
    task.push(newTask);
    res.redirect("/");
});

router.post("/removetask", function(req, res) {
    var completeTask = req.body.check;

    console.log(req.body);
    if (typeof completeTask === "string") {
        complete.push(completeTask);
        //check if the completed task already exist in the task when checked, then remove using the array splice method
        task.splice(task.indexOf(completeTask), 1);
    } else if (typeof completeTask === "object") {
        for (var i = 0; i < completeTask.length; i++) {
            complete.push(completeTask[i]);
            task.splice(task.indexOf(completeTask[i]), 1);
        }
    }
    res.redirect("/");
});


// Get home page
router.get('/', function(req, res, next) {
    // console.log("nodemon?yea!!!");
    res.render('index', { task: task, complete: complete});
});

module.exports = router;


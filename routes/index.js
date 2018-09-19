var express = require('express');
var app = express();
var router = express.Router();
const TaskModel =require('../models/task.js');

const CompleteStatusEnum = Object.freeze({"incomplete":0, "completed":1, "current":2});

// DB Helper: CREATE and UPDATE

// npm install ws@3.3.2 --save-dev --save-exact
function taskSave(taskObject, res){
    taskObject.save(function (err, TestTask) {
        if (err) return console.error(err);
        console.log("Task: "+ TestTask.title + " saved.");
        res.redirect("/");
    });
}


// Post route for adding a new task
router.post('/addtask', function (req, res) {
    console.log(req.body);

    const TestTask = new TaskModel({title:req.body.new_task_title, category:req.body.new_task_category, complete: CompleteStatusEnum.incomplete});
    taskSave(TestTask, res);
    // TestTask.save(function (err, TestTask) {
    //     if (err) return console.error(err);
    //     console.log("Task: "+ TestTask.title + " added.");
    //     res.redirect("/");
    // });
});


// DB Helper: UPDATE tasks' complete status
function UpdateCompleteStatus(completeTaskID ,status){
    TaskModel.findByIdAndUpdate(
        completeTaskID,
        { $set: { complete: status }},
        function (err, response) {
            if (err) return console.error(err);
            //console.log('updated record', response.ops[0]);
        });
}


// Post route for make tasks complete
router.post("/removetask", function(req, res) {
    const completeTask = req.body.check;
    if (typeof completeTask === "string") {
        UpdateCompleteStatus(completeTask, CompleteStatusEnum.completed);
    } else if (typeof completeTask === "object"){
        completeTask.forEach(function (entry) {
            UpdateCompleteStatus(entry, CompleteStatusEnum.completed);
        });
    }
    res.redirect("/");
});


// DB Helper: READ(find) task by status
function findTask(status) {
    return new Promise(function(resolve, reject) {
        TaskModel.find({complete : status},function(err, tasks){
            if (err) return reject(err);
            resolve(tasks);
        });
    });
}

// Get home page
router.get('/', function(req, res) {
    let promises = [];

    promises.push(findTask(CompleteStatusEnum.incomplete));
    promises.push(findTask(CompleteStatusEnum.completed));

    Promise.all(promises).then(function () {
        res.render('index', { tasks: arguments[0][0], completed: arguments[0][1]});
    }, function (err) {
        console.error(err);
    });
});

module.exports = router;


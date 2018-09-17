const mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId;

const TaskSchema = new Schema({
    title: String,
    category: String,
    complete: Number
});

const TaskModel = mongoose.model('Task', TaskSchema);

module.exports =  TaskModel;
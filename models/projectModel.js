'use strict';

var mongoose = require('mongoose');

var projectModel = function () {

    //Define a super simple schema for our stories.
    var projectSchema = mongoose.Schema({
        projectName: String,
        projectNo: String,
        startDate: String,
        endDate: String,
        releases:String,
        sprintDuration:String,
        sprintCount:String,
        story:[{
        name: String,
        creator: String,
        date: String,
        desc:String,
            sprintNo: String,
            sprintStartDate: String,
            sprintEndDate: String


        }]
    });

    /**
     * Verbose toString method
     */
    projectSchema.methods.whatAmI = function () {
        var greeting = this.projectname ?
        'Hello, I\'m a ' + this.projectname
            : 'I don\'t have a name :(';
        console.log(greeting);
    };


    return mongoose.model('Project', projectSchema);

};

module.exports = new projectModel();

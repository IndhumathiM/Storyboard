'use strict';

var mongoose = require('mongoose');

var projectModel = function () {

    //Define a super simple schema for our stories.
    var projectSchema = mongoose.Schema({
        projectname: String,
        projectno: String,
        assignedteam: String,
        date1: String,
        date2: String,
        date3: String,
        story:[{
        name: String,
        creator: String,
        date: String,
        desc:String}]
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

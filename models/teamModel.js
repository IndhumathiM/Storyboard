'use strict';

var mongoose = require('mongoose');

var teamModel = function () {

    //Define a super simple schema for our stories.
    var teamSchema = mongoose.Schema({
        teamname: String,
        teamno: String,
        member1: String,
        member2:String,
        member3:String
    });

    /**
     * Verbose toString method
     */
    teamSchema.methods.whatAmI = function () {
        var greeting = this.name ?
        'Hello, I\'m a ' + this.name
            : 'I don\'t have a name :(';
        console.log(greeting);
    };

    /**
     * Format the price of the product to show a dollar sign, and two decimal places
     */

    return mongoose.model('Team', teamSchema);

};

module.exports = new teamModel();

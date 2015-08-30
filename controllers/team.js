/**
 * A very simple product editor
 */
'use strict';
var Team = require('../models/teamModel');

module.exports = function (server) {

    /**
     * Retrieve a list of all products for editing.
     */
    server.get('/team', function (req, res) {

        Team.find(function (err, prods) {
            if (err) {
                console.log(err);
            }

            var model =
            {
                teams: prods
            };
            res.render('team/team', model);
        });

    });


    /**
     * Add a new product to the database.
     * **** PLEASE READ THE COMMENT BELOW! ****
     */
    server.post('/team', function (req, res) {
        var teamname = req.body.teamname && req.body.teamname.trim();
        var teamno = req.body.teamno && req.body.teamno.trim();
        var member1 = req.body.member1 && req.body.member1.trim();
        var member2 = req.body.member2 && req.body.member2.trim();
        var member3 = req.body.member3 && req.body.member3.trim();


        if (teamname === '') {
            res.redirect('/team#BadInput');
            return;
        }

        var newTeam = new Team({teamname: teamname,teamno: teamno,member1: member1,member2: member2,member3: member3});

        //Show it in console for educational purposes...
        newTeam.whatAmI();

        /*
         The call back receives two more arguments -> product/s that is/are added to the database
         and number of rows that are affected because of save, which right now are ignored.
         We only check for errors.
         */
        newTeam.save(function (err) {
            if (err) {
                console.log('save error', err);
            }

            res.redirect('/team');
        });
    });

    /**
     * Delete a product.
     * @paaram: req.body.item_id Is the unique id of the product to remove.
     */
    server.delete('/team', function (req, res) {
        Team.remove({_id: req.body.item_id}, function (err) {
            if (err) {
                console.log('Remove error: ', err);
            }
            res.redirect('/team');
        });
    });


    /**
     * Edit a team details.
     */


    server.get('/team/:id/edit',function(req,res){

        Team.find({_id: req.params.id}, function (err,docs) {
            if (err) {
                res.json(err)   ;
            }
            else
                res.render('team/editteam', {teams:docs[0]});
        });
    });

    server.put('/team/:id',function(req,res){
        Team.update({_id: req.params.id}, {
                teamname:req.body.teamname,
                teamno:req.body.teamno,
                member1:req.body.member1,
                member2:req.body.member2,
                member3:req.body.member3

            },
            function(err,docs) {
                if (err) res.json(err);

                else {
                    console.log(docs);
                    res.redirect('/team');
                }
            });
    });

    /**
     * Linking a story with its details
     */

    server.get('/team/:id', function (req, res) {
        Team.find({_id: req.params.id}, function (err,docs) {
            if (err) {
                res.json(err)   ;
            }
            else
                res.render('team/teamdetails', {teams:docs[0]});
        });
    });
};

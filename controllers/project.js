/**
 * A very simple product editor
 */
'use strict';
var Project = require('../models/projectModel');

module.exports = function (server) {

    /**
     * Retrieve a list of all products for editing.
     */
    server.get('/', function (req, res) {


        Project.find(function (err, prods) {
            if (err) {
                console.log(err);
            }

            var model =
            {
                projects: prods
            };
            res.render('project/project', model);
        });

    });


    /**
     * Add a new product to the database.
     * **** PLEASE READ THE COMMENT BELOW! ****
     */
    server.post('/project', function (req, res) {
        var projectName = req.body.projectName && req.body.projectName.trim();
        var projectNo = req.body.projectNo && req.body.projectNo.trim();
        var startDate = req.body.startDate && req.body.startDate.trim();
        var endDate = req.body.endDate && req.body.endDate.trim();
        var releases = req.body.releases && req.body.releases.trim();
        var sprintDuration = req.body.sprintDuration && req.body.sprintDuration.trim();
        var sprintCount = Math.floor((Math.floor((new Date(endDate) - new Date(startDate)) / (24 * 3600 * 1000 * 7))) / sprintDuration);



        if (projectName === '') {
            res.redirect('/project#BadInput');
            return;
        }

        var newProject = new Project({projectName: projectName,projectNo: projectNo,startDate: startDate,endDate: endDate,releases: releases,sprintDuration: sprintDuration,sprintCount: sprintCount});

        //Show it in console for educational purposes...
        newProject.whatAmI();

        /*
         The call back receives two more arguments -> product/s that is/are added to the database
         and number of rows that are affected because of save, which right now are ignored.
         We only check for errors.
         */
        newProject.save(function (err) {
            if (err) {
                console.log('save error', err);
            }

            res.redirect('/');
        });
    });




    /**
     * Delete a project.
     * @paaram: req.body.item_id Is the unique id of the product to remove.
     */
    server.delete('/project', function (req, res) {
        Project.remove({_id: req.body.item_id}, function (err) {
            if (err) {
                console.log('Remove error: ', err);
            }
            res.redirect('/');
        });
    });


    /**
     * getting  a editproject page
     */


    server.get('/project/:id/edit',function(req,res){

        Project.find({_id: req.params.id}, function (err,docs) {
            if (err) {
                res.json(err)   ;
            }
            else
                res.render('project/editproject', {projects:docs[0]});
        });
    });
/*
editing project details
 */
    server.put('/project/:id',function(req,res){
        Project.update({_id: req.params.id}, {
                projectName:req.body.projectName,
                projectNo:req.body.projectNo,
                startDate:req.body.startDate,
                endDate:req.body.endDate,
                releases:req.body.releases,
                sprintDuration:req.body.sprintDuration

            },
            function(err,docs) {
                if (err) res.json(err);

                else {
                    console.log(docs);
                    res.redirect('/');
                }
            });
    });

    /**
     * Linking a project with its details
     */

    server.get('/project/:id', function (req, res) {
        Project.find({_id: req.params.id}, function (err,docs) {
            if (err) {
                res.json(err)   ;
            }
            else
                res.render('project/projectdetails', {projects:docs[0]});
        });
    });

/*
Story Main page
 */
    server.get('/:id/story',function(req,res) {

        Project.find({_id: req.params.id}, function (err, docs) {
            if (err) {
                res.json(err);
            }
            else
                res.render('story/story', {projects:docs[0]});

        });
    });


   /**
    *Inserting stories into project
    */
   server.put('/story/:id', function (req, res) {

       Project.update({_id: req.params.id},
           {$push:
           { story: {
               name: req.body.name,
               creator: req.body.creator,
               date: req.body.date,
               desc: req.body.desc,
               sprintNo: req.body.sprintNo

           }}},
           function(err,docs) {
               if (err) res.json(err);

               else {
                   console.log(docs);
                   res.redirect('/');
               }
           });
   });


    /*
    getting a story edit page
     */

    server.get('/story/:id/edit/:name',function(req,res){
        Project.find({_id: req.params.id,'story.name':req.params.name},{"story.$":1},
         function (err,docs) {
            if (err) {
                res.json(err)   ;
            }
            else
                res.render('story/editstory', {projects:docs[0]});
        });
    });

/*
Story updating
 */
    server.put('/story/update/:id/:name',function(req,res){
        Project.update({_id: req.params.id,'story.name':req.params.name},
            {$set:{
                "story.$.name":req.body.name,
                "story.$.creator":req.body.creator,
                "story.$.date":req.body.date,
                "story.$.desc":req.body.desc,
                "story.$.sprintNo":req.body.sprintNo

            }},
            function(err,docs) {
                if (err)
                    res.json(err);

                else {
                    console.log(docs);
                    res.redirect('/');
                }
            });
        });

    /*
    Stories under project
     */
    server.get('/:id/stories',function(req,res){
        Project.find({_id: req.params.id},
            function (err,docs) {
            if (err) {
                res.json(err);
            }
            else

                res.render('story/storydetails',{projects:docs[0]});
        });
    });

    /* Search story by name */
    server.post('/:id/story/search/name',function(req,res){

        Project.find({_id: req.params.id,'story.name':req.body.storyName},{_id:0,"story.$":1},
            function (err,docs) {
                if (err) {
                    res.json(err);
                }
                else

                    res.render('project/storybydate',{projects:docs[0]});
            });
    });


    /* Search story by date */

    server.post('/:id/story/search/date',function(req,res){

        Project.find({_id: req.params.id,'story.date':req.body.releaseDate},{_id:0,"story.$":1},
            function (err,docs) {
                if (err) {
                    res.json(err);
                }
                else

                    res.render('project/storybydate',{projects:docs[0]});
            });
    });


    /*
     getting a story edit page
     */

    server.get('/story/:id/delete/:name',function(req,res){
        Project.find({_id: req.params.id,'story.name':req.params.name},{"story.$":1},
            function (err,docs) {
                if (err) {
                    res.json(err)   ;
                }
                else
                    res.render('story/delstory', {projects:docs[0]});
            });
    });

    /**
     *Deleting stories from project
     */
    server.get('/story/delete/:id/:name', function (req, res) {
        Project.update({_id: req.params.id,'story.name':req.params.name},
            {$pull:
            { story: {
                name: req.body.name,
                creator: req.body.creator,
                date: req.body.date,
                desc: req.body.desc,
                sprintNo: req.body.sprintNo



            }}},
            function (err) {
            if (err) {
                console.log('Remove error: ', err);
            }
            res.redirect('/');
        });
    });


};

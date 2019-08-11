'use strict';
var express = require('express');
var router = express.Router();

var User = require("../controller/user");
var Bed = require("../controller/bed");
var BedStatus = require("../controller/bedStatus");
var Schedule = require("../controller/schedule");

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});

router.get('/initUser', User.initUser);

router.get('/getUserList', User.getAllUsers);

router.post('/updateUser', User.updateUser);

router.post('/addUser', User.addNewUser);

router.post('/delUser', User.delUser);

router.post('/login', User.checkUser);

router.post('/addBed', Bed.addNewBed);

router.post('/delBed', Bed.delBed);

router.post('/updateBed', Bed.updateBed);

router.get('/getBedList', Bed.listBeds);

router.post('/addBedStatus', BedStatus.addBedStatus);

router.get('/getBedStatusList', BedStatus.getBedStatusList);

router.post('/getSchedule', Schedule.getSchedule);

router.post('/saveSchedule', Schedule.saveSchedule);


module.exports = router;


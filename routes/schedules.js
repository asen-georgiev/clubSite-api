const express = require('express');
const router = express.Router();
const _ = require('lodash');
const {Schedule,validateSchedule} = require('../models/schedule');
const authorization = require('../middleware/authorization');


//Create single Schedule
router.post('/',authorization,async(req, res) => {

    const{error}=validateSchedule(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let schedule = new Schedule(_.pick(req.body,['classDay','classHour','classClass','classAge']));
    await schedule.save();

    res.send(schedule);
})


//Get all the schedules
router.get('/',async (req, res) => {
    const schedules = await Schedule.find().sort('_id');
    res.send(schedules);
})


//Get single schedule by ID
router.get('/:id',async(req, res) => {

    const schedule = await Schedule.findById(req.params.id);
    if(!schedule) return res.status(404).send('Schedule with the given ID was not found!');
    res.send(schedule);
})


//Update single Schedule
router.put('/:id', authorization,async(req, res) => {

    const{error} = validateSchedule(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const schedule = await Schedule.findByIdAndUpdate(req.params.id,{
        classDay: req.body.classDay,
        classHour: req.body.classHour,
        classClass: req.body.classClass,
        classAge: req.body.classAge
    })

    if(!schedule) return res.status(404).send('Schedule with the given ID was not found');
})



//Delete single schedule
router.delete('/:id',authorization,async(req, res) => {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    let reqId = req.params.id;
    if(!schedule) return res.status(404).send(`Schedule with ID: ${reqId} was not found!`);
    res.send(schedule);
})


module.exports = router;

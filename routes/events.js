const express = require('express');
const router = express.Router();
const _ = require('lodash');
const authorization = require('../middleware/authorization');
const {EventCalendar,validateEventCalendar} = require('../models/event');


//Creatind eventCalendar
router.post('/',authorization,async(req, res) => {
    const{error}=validateEventCalendar(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let eventCalendar = await EventCalendar.findOne({eventTitle: req.body.eventTitle});
    const reqTitle = req.body.eventTitle;
    if(eventCalendar) return res.status(409).send(`An event with ${reqTitle} already exists.`);

    eventCalendar = new EventCalendar(_.pick(req.body,['eventTitle','eventInfo','eventDate','eventLocation','eventLink']));
    await eventCalendar.save();
    res.send(eventCalendar);
})


//Single eventCalendar
router.get('/:id',async(req, res) => {
    const eventCalendar = await EventCalendar.findById(req.params.id);
    if(!eventCalendar) return res.status(404).send('Event with the given ID was not found!');
    res.send(eventCalendar);
})


//All eventCalendars!
router.get('/',async(req, res) => {
    const eventCalendar = await EventCalendar.find().sort('-_id');
    res.send(eventCalendar);
})


//Update single Event
router.put('/:id', authorization,async(req, res) => {
    const{error} = validateEventCalendar(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const eventCalendar = await EventCalendar.findByIdAndUpdate(req.params.id,{
        eventTitle: req.body.eventTitle,
        eventInfo: req.body.eventInfo,
        eventDate: req.body.eventDate,
        eventLocation: req.body.eventLocation,
        eventLink: req.body.eventLink
    },{new:true});

    if(!eventCalendar) return res.status(404).send('Event with the given ID was not found!');
});


//Delete single Event
router.delete('/:id', authorization,async (req, res) => {
    const eventCalendar = await EventCalendar.findByIdAndDelete(req.params.id);
    let reqId = req.params.id;
    if(!eventCalendar) return res.status(404).send(`Event with ID: ${reqId} was not found!`);
    res.send(eventCalendar);
})

module.exports = router;

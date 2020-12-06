const express = require('express');
const router = express.Router();
const _ = require('lodash');
const authorization = require('../middleware/authorization');
const {TimeTable,validateTimeTable} = require('../models/timetable');
const {Course,validateCourse} = require('../models/course');
const {TimeDH,validateTimeDH} = require('../models/timedh');




router.post('/',authorization,async (req, res) => {
    const {error} = validateTimeTable(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const course = await Course.findById(req.body.courseId);
    if(!course) return res.status(404).send('Invalid course ID!');

    const timedh = await TimeDH.findById(req.body.timedhId);
    if(!timedh) return res.status(404).send('Invalid day and hour ID!');

    let timetable = await TimeTable.find({courseId:req.body.courseId,timedhId:req.body.timedhId});
    const reqCourse = course.courseName;
    const reqTimeDay = timedh.day;
    const reqTimeHour = timedh.hour;
    if(timetable) return res.status(409)
        .send(`Timetable for ${reqCourse} in ${reqTimeDay} at ${reqTimeHour} already exists!`);

    timetable = new TimeTable({
        course:{
            _id: course._id,
            courseName: course.courseName,
            courseInfo: course.courseInfo,
            coursePrice: course.coursePrice,
            courseAge: course.courseAge
        },
        timedh:{
            _id: timedh._id,
            day: timedh.day,
            hour: timedh.hour
        }
    });

    await timetable.save();
    res.send(timetable);
})


router.get('/',async (req, res) => {
    const timetables = await TimeTable.find().sort('course');
    res.send(timetables);
})


router.get('/:id', async (req, res) => {
    const timetable = await TimeTable.findById(req.params.id);
    const reqId = req.params.id;
    if (!timetable) return res.status(404).send(`The timetable with ${reqId} was not found!`);
    res.send(timetable);
})


router.put('/:id', authorization,async (req, res) => {
    const {error} = validateTimeTable(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const course = await Course.findById(req.body.courseId);
    if(!course) return res.status(404).send('Invalid course ID!');

    const timedh = await TimeDH.findById(req.body.timedhId);
    if(!timedh) return res.status(404).send('Invalid day and hour ID!');

    const timetable = await TimeTable.findByIdAndUpdate(req.params.id,{
        course:{
            _id: course._id,
            courseName: course.courseName,
            courseInfo: course.courseInfo,
            coursePrice: course.coursePrice,
            courseAge: course.courseAge
        },
        timedh:{
            _id: timedh._id,
            day: timedh.day,
            hour: timedh.hour
        }
    },{new:true});

    const reqId = req.params.id;
    if (!timetable) return res.status(404).send(`The timetable with ${reqId} was not found!`);
})



router.delete('/:id', authorization,async (req, res) => {
    const timetable = await TimeTable.findByIdAndDelete(req.params.id);
    const reqId = req.params.id;
    if (!timetable) return res.status(404).send(`The timetable with ${reqId} was not found!`);
    res.send(timetable);

})

module.exports = router;

const express = require('express');
const router = express.Router();
const _ = require('lodash');
const authorization = require('../middleware/authorization');
const {Course,validateCourse} = require('../models/course');


//Post a course
router.post('/',authorization,async(req, res) => {
    const {error} = validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let course = await Course.findOne({courseName: req.body.courseName});
    const reqCourseName = req.body.courseName;
    if(course) return res.status(409).send(`A course with name ${reqCourseName} already exists!`);

    course = new Course(_.pick(req.body,['courseName','courseInfo','coursePrice','courseAge']));
    await course.save();
    res.send(course);
})

//Get all the courses
router.get('/', async(req, res) => {
    const courses = await Course.find().sort('_id');
    res.send(courses);
})

//Get a single course
router.get('/:id',async(req, res) => {
    const course = await Course.findById(req.params.id);
    let reqId = req.params.id;
    if(!course) return res.status(404).send(`Course with ID: ${reqId} was not found!`);
    res.send(course);
})

//Update a course
router.put('/:id',authorization,async(req, res) => {
    const{error} = validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const course = await Course.findByIdAndUpdate(req.params.id,{
        courseName: req.body.courseName,
        courseInfo: req.body.courseInfo,
        coursePrice: req.body.coursePrice,
        courseAge: req.body.courseAge
    },{new:true});

    let reqId = req.params.id;
    if(!course) return res.status(404).send(`Course with ID: ${reqId} was not found!`);
})

//Delete a single course
router.delete('/:id',authorization,async(req, res) => {
    const course = await Course.findByIdAndDelete(req.params.id);
    let reqId = req.params.id;
    if(!course) return res.status(404).send(`Course with ID: ${reqId} was not found!`);
    res.send(course);
})

module.exports = router;

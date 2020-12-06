const mongoose = require('mongoose');
const Joi = require("joi");

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    courseInfo: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    coursePrice: {
        type: Number,
        required: true,
        min: 1
    },
    courseAge: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    }
})

const Course = mongoose.model('Course', courseSchema);

function validateCourse(course) {
    const schema = Joi.object({
        courseName: Joi.string().required().min(3).max(50),
        courseInfo: Joi.string().required().min(5).max(255),
        coursePrice: Joi.number().required().min(1),
        courseAge: Joi.string().required().min(2).max(20)
    });
    return schema.validate(course);
}

exports.Course = Course;
exports.validateCourse = validateCourse;
exports.courseSchema = courseSchema;

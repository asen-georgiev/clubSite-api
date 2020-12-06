const mongoose = require('mongoose');
const Joi = require("joi");
const {courseSchema} = require("./course");
const {timedhSchema} = require("./timedh");

const timeTableSchema = new mongoose.Schema({
    course: {
        type: courseSchema,
        required: true
    },
    timedh: {
        type: timedhSchema,
        required: true
    }
})

const TimeTable = mongoose.model('TimeTable', timeTableSchema);

function validateTimeTable(timetable) {
    const schema = Joi.object({
        courseId: Joi.objectId().required(),
        timedhId: Joi.objectId().required()
    });
    return schema.validate(timetable);
}

exports.TimeTable = TimeTable;
exports.validateTimeTable = validateTimeTable;
exports.timeTableSchema = timedhSchema;

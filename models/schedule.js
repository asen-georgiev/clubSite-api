const mongoose = require('mongoose');
const Joi = require("joi");

const scheduleSchema = new mongoose.Schema({
    classDay: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 15
    },
    classHour: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    classClass: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    classAge: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    }
})

    const Schedule = mongoose.model('Schedule',scheduleSchema);

function validateSchedule(schedule){
    const schema = Joi.object({
        classDay: Joi.string().required().min(1).max(15),
        classHour: Joi.string().required().min(1).max(50),
        classClass: Joi.string().required().min(1).max(50),
        classAge: Joi.string().required().min(1).max(50)
    });
    return schema.validate(schedule);
}

    exports.Schedule=Schedule;
    exports.validateSchedule=validateSchedule;
    exports.scheduleSchema=scheduleSchema;

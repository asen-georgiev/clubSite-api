const mongoose = require('mongoose');
const Joi = require("joi");

const timedhSchema = new mongoose.Schema({
    day: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 20
    },
    hour: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    }
})

const TimeDH = mongoose.model('TimeDH', timedhSchema);


function validateTimeDH(timedh) {
    const schema = Joi.object({
        day: Joi.string().required().min(5).max(20),
        hour: Joi.string().required().min(2).max(20)
    });
    return schema.validate(timedh);
}

exports.TimeDH = TimeDH;
exports.validateTimeDH = validateTimeDH;
exports.timedhSchema = timedhSchema;

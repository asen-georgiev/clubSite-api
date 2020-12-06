const mongoose = require('mongoose');
const Joi = require("joi");

const eventSchema = new mongoose.Schema({
    eventTitle: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    eventInfo: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 500
    },
    eventDate: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    eventLocation: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    eventLink: {
        type: String,
        minlength: 5,
        maxlength: 50
    }
})

const EventCalendar = mongoose.model('EventCalendar', eventSchema);

function validateEventCalendar(eventCalendar) {
    const schema = Joi.object({
        eventTitle: Joi.string().required().min(5).max(50),
        eventInfo: Joi.string().required().min(5).max(500),
        eventDate: Joi.string().required().min(5).max(50),
        eventLocation: Joi.string().required().min(5).max(50),
        eventLink: Joi.string().min(5).max(50).allow('')
    });
    return schema.validate(eventCalendar);
}

exports.EventCalendar = EventCalendar;
exports.validateEventCalendar = validateEventCalendar;
exports.eventSchema = eventSchema;

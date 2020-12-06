const express = require('express');
const router = express.Router();
const _ = require('lodash');
const authorization = require('../middleware/authorization');
const {TimeDH,validateTimeDH} = require('../models/timedh');


//Post TimeDH
router.post('/',authorization,async (req, res) => {
    const{error} = validateTimeDH(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let timedh = await TimeDH.findOne({day:req.body.day,hour:req.body.hour});
    const reqDay= req.body.day;
    const reqHour = req.body.hour;
    if(timedh) return res.status(409).send(`Day / Hour : ${reqDay} / ${reqHour} already exists!`);

    timedh = new TimeDH(_.pick(req.body,['day','hour']));
    await timedh.save();
    res.send(timedh);
})


//Get all TimeDhs
router.get('/',async(req, res) => {
    const timedhs = await TimeDH.find().sort('_id');
    res.send(timedhs);
})



//Get single TimeDh by ID
router.get('/:id', async (req, res) => {
    const timedh = await TimeDH.findById(req.params.id);
    let reqId = req.params.id;
    if(!timedh) return res.status(404).send(`TimeDh with ID: ${reqId} was not found!`);
    res.send(timedh);
})


//Update single TimeDH
router.put('/:id', authorization,async (req, res) => {
    const {error} = validateTimeDH(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const timedh = await TimeDH.findByIdAndUpdate(req.params.id,{
        day: req.body.day,
        hour: req.body.hour
    },{new:true});

    let reqId = req.params.id;
    if(!timedh) return res.status(404).send(`TimeDh with ID: ${reqId} was not found!`);
    res.send(timedh);

})


//Delete single TimeDh
router.delete('/:id', authorization,async (req, res) => {
    const timedh = await TimeDH.findByIdAndDelete(req.params.id);
    let reqId = req.params.id;
    if(!timedh) return res.status(404).send(`TimeDh with ID: ${reqId} was not found!`);
    res.send(timedh);
})



module.exports = router;

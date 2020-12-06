const express = require('express');
const router = express.Router();
const _ = require('lodash');
const authorization = require('../middleware/authorization');
const {ClubBio, validateClubBio} = require('../models/clubbio');


router.post('/', authorization, async (req, res) => {
    const {error} = validateClubBio(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let clubBio = await ClubBio.findOne({bioTitle: req.body.bioTitle});
    const reqTitle = req.body.bioTitle;
    if (clubBio) return res.status(409).send(`The club biography with title: ${reqTitle} already exists.`)

    clubBio = new ClubBio(_.pick(req.body, ['bioTitle', 'bioText']));
    await clubBio.save();
    res.send(clubBio);
})


//All club Bios
router.get('/', async (req, res) => {
    const clubBio = await ClubBio
        .find()
        .select("-__v")
        .sort('_id');
    res.send(clubBio);
})


//Single BIO
router.get('/:id',async (req, res) => {
    const clubBio = await ClubBio.findById(req.params.id);
    if(!clubBio) return res.status(404).send('Club Bio with given ID was not found!');
    res.send(clubBio);
})


//Update single BIO
router.put('/:id', authorization,async (req, res, next) => {
    const {error} = validateClubBio(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const clubBio = await ClubBio.findByIdAndUpdate(req.params.id, {
        bioTitle: req.body.bioTitle,
        bioText: req.body.bioText
    }, {new: true});

    if(!clubBio) return res.status(404).send('Club Bio with the given ID was not found!');
})


//Delete BIO
router.delete('/:id', authorization,async (req, res) => {
    const clubBio = await ClubBio.findByIdAndDelete(req.params.id);
    let reqId = req.params.id;
    if (!clubBio) return res.status(404).send(`Biography with Id: ${reqId} was not found`);
    res.send(clubBio);
})

module.exports = router;

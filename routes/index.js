var express = require('express');
var router = express.Router();

const myDB = require('../db/myDB.js');

// Load data from db
router.get('/getData', async (req, res) => {
  try {
    const dataArray = await myDB.getData();
    res.status(200).send({ data: dataArray });
  } catch (e) {
    console.log('Error', e);
    res.status(400).send({ err: e });
  }
});

// save a car to user's collections
router.post('/saveCar', async (req, res) => {
  try {
    const username = req.body.username;
    const carId = req.body.car_id;

    await myDB.addToCollections(username, carId);
    res.sendStatus(200);
  } catch (e) {
    console.log('Error', e);
    res.status(400).send({ err: e });
  }
});

// unsave a car from user's collections
router.post('/unsaveCar', async (req, res) => {
  try {
    const username = req.body.username;
    const carId = req.body.car_id;

    await myDB.deleteFromCollections(username, carId);
    res.sendStatus(200);
  } catch (e) {
    console.log('Error', e);
    res.status(400).send({ err: e });
  }
});

// load data saved in user's collections
router.post('/getCollections', async (req, res) => {
  try {
    const username = req.body.username;

    const savedCars = await myDB.getUserCollections(username);
    res.status(200).send({ data: savedCars });
  } catch (e) {
    console.log('Error', e);
    res.status(400).send({ err: e });
  }
});

module.exports = router;

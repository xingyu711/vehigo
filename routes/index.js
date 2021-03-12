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
    // TODO: get actual username from session
    const username = 'xingyu711';
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
    // TODO: get actual username from session
    const username = 'xingyu711';
    const carId = req.body.car_id;

    await myDB.deleteFromCollections(username, carId);
    res.sendStatus(200);
  } catch (e) {
    console.log('Error', e);
    res.status(400).send({ err: e });
  }
});

// load data saved in user's collections
router.get('/getCollections', async (req, res) => {
  try {
    // TODO: get actual username from session
    const username = 'xingyu711';

    const savedCars = await myDB.getUserCollections(username);
    res.status(200).send({ data: savedCars });
  } catch (e) {
    console.log('Error', e);
    res.status(400).send({ err: e });
  }
});

// user post info to db
router.post('/postInfo', async (req, res) => {
  try {
    // TODO: get actual username from session
    const username = 'xingyu711';

    const dataObject = JSON.parse(JSON.stringify(req.body));
    dataObject['username'] = username;

    // insert data into db
    myDB.addCarData(dataObject);

    res.sendStatus(200);
  } catch (e) {
    console.log('Error', e);
    res.status(400).send({ err: e });
  }
});

// delete a post in user's home page
router.post('/deletePost', async (req, res) => {
  try {
    // TODO: get actual username from session
    const username = 'xingyu711';
    const carId = req.body.car_id;

    await myDB.deleteFromPosts(username, carId);
    res.sendStatus(200);
  } catch (e) {
    console.log('Error', e);
    res.status(400).send({ err: e });
  }
});

router.get('/getPosts', async (req, res) => {
  try {
    // TODO: get actual username from session
    const username = 'xingyu711';

    const userPosts = await myDB.getUserPosts(username);

    res.status(200).send({ data: userPosts });
  } catch (e) {
    console.log('Error', e);
    res.status(400).send({ err: e });
  }
});

module.exports = router;

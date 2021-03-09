var express = require('express');
var router = express.Router();

const myDB = require('../db/myDB.js');

router.get('/getData', async (req, res) => {
  try {
    const dataArray = await myDB.getData();
    res.send({ data: dataArray });
  } catch (e) {
    console.log('Error', 3);
    res.status(400).send({ err: e });
  }
});

module.exports = router;

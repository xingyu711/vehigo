const express = require("express");
const router = express.Router();

const myDB = require("../db/myDB.js");

const bcrypt = require("bcrypt");
const saltRounds = 10;

function auth(req, res) {
  if (!req.session.username) {
    res.status(401).send({ err: "user not logged in" });
    return false;
  }
  return true;
}

// Load data from db
router.get("/getData", async (req, res) => {
  try {
    if (!auth(req, res)) {
      return;
    }
    const startValue = req.query.startValue;

    const dataObj = await myDB.getData(startValue);
    res.status(200).send({ dataObj });
  } catch (e) {
    console.error("Error", e);
    res.status(400).send({ err: e });
  }
});

// save a car to user's collections
router.post("/saveCar", async (req, res) => {
  try {
    if (!auth(req, res)) {
      return;
    }
    const username = req.session.username;
    const carId = req.body.car_id;

    await myDB.addToCollections(username, carId);
    res.sendStatus(200);
  } catch (e) {
    console.error("Error", e);
    res.status(400).send({ err: e });
  }
});

// unsave a car from user's collections
router.post("/unsaveCar", async (req, res) => {
  try {
    if (!auth(req, res)) {
      return;
    }
    const username = req.session.username;
    const carId = req.body.car_id;

    await myDB.deleteFromCollections(username, carId);
    res.sendStatus(200);
  } catch (e) {
    console.error("Error", e);
    res.status(400).send({ err: e });
  }
});

// load data saved in user's collections
router.get("/getCollections", async (req, res) => {
  try {
    if (!auth(req, res)) {
      return;
    }
    const username = req.session.username;

    const savedCars = await myDB.getUserCollections(username);
    res.status(200).send({ data: savedCars });
  } catch (e) {
    console.error("Error", e);
    res.status(400).send({ err: e });
  }
});

// user post info to db
router.post("/postInfo", async (req, res) => {
  try {
    if (!auth(req, res)) {
      return;
    }
    // get username from session and add username to data object
    const username = req.session.username;

    const dataObject = JSON.parse(JSON.stringify(req.body));
    dataObject["username"] = username;

    // insert data into db
    myDB.addCarData(dataObject);

    res.sendStatus(200);
  } catch (e) {
    console.error("Error", e);
    res.status(400).send({ err: e });
  }
});

// delete a post in user's home page
router.post("/deletePost", async (req, res) => {
  try {
    if (!auth(req, res)) {
      return;
    }
    const username = req.session.username;
    const carId = req.body.car_id;

    await myDB.deleteFromPosts(username, carId);
    res.sendStatus(200);
  } catch (e) {
    console.error("Error", e);
    res.status(400).send({ err: e });
  }
});

router.get("/getPosts", async (req, res) => {
  try {
    if (!auth(req, res)) {
      return;
    }
    const username = req.session.username;

    const userPosts = await myDB.getUserPosts(username);

    res.status(200).send({ data: userPosts });
  } catch (e) {
    console.error("Error", e);
    res.status(400).send({ err: e });
  }
});

router.post("/userLogin", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    // ask db to validate this user
    const hash = await myDB.getPassword(username);

    // user does not exist
    if (hash == null) {
      res.status(401).send({ login: "not found" });
    } else {
      const match = await bcrypt.compare(password, hash);
      if (match == true) {
        req.session.username = username;
        res.sendStatus(200);
      } else {
        res.status(401).send({ login: "wrong password" });
      }
    }
  } catch (e) {
    console.error("Error", e);
    res.status(400).send({ err: e });
  }
});

router.post("/userRegister", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;

    // hash password and save to db
    await bcrypt.hash(password, saltRounds, async function (err, hash) {
      const msg = await myDB.registerUser(username, hash, firstname, lastname);
      if (msg === "success") {
        // save username to session
        req.session.username = username;
        res.sendStatus(200);
      } else {
        res.status(409).send({ register: msg });
      }
    });
  } catch (e) {
    console.error("Error", e);
    res.status(400).send({ err: e });
  }
});

router.get("/userLogout", async (req, res) => {
  try {
    if (!auth(req, res)) {
      return;
    }
    delete req.session.username;
    res.sendStatus(200);
  } catch (e) {
    console.error("Error", e);
    res.status(400).send({ err: e });
  }
});

router.get("/getPersonName", async (req, res) => {
  try {
    if (!auth(req, res)) {
      return;
    }
    const username = req.session.username;
    //ask db to find the user's display name
    const displayName = await myDB.getUserDisplayName(username);
    res.status(200).send({ displayName: displayName });
  } catch (e) {
    console.error("Error", e);
    res.status(400).send({ err: e });
  }
});

// Search car data from db
router.post("/searchCar", async (req, res) => {
  try {
    if (!auth(req, res)) {
      return;
    }
    const inputValue = req.body.inputValue;
    const year = req.body.year;
    const mileage = req.body.mileage;

    const dataArray = await myDB.searchCar(inputValue, year, mileage);
    res.status(200).send({ data: dataArray });
  } catch (e) {
    console.error("Error", e);
    res.status(400).send({ err: e });
  }
});

module.exports = router;

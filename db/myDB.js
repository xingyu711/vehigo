const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config(); //call dotenv to load variables from the .env file

const DB_NAME = 'vehigoDB';
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster-vehigo.7urwg.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

// TODO: Add pagination when rendering data
async function getData(startValue, manufacturer, model, year, odometer) {
  const returnVal = {};
  let client;

  const nPerPage = 10;

  try {
    client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();

    const db = client.db(DB_NAME);
    const cars = db.collection('cars');

    // build query based on input parameters
    let query = {};
    if (manufacturer) {
      query.manufacturer = manufacturer;
    }
    if (model) {
      query.model = model;
    }
    if (year) {
      query.year = year;
    }
    if (odometer) {
      query.odometer = { $lt: odometer };
    }
    if (startValue) {
      query._id = { $lt: new ObjectId(startValue) };
    }

    // range query - pagination
    const queryResult = await cars
      .find(query)
      .sort({ _id: -1 })
      .limit(nPerPage + 1)
      .toArray();

    // set return value
    const queryLength = queryResult.length;
    returnVal.hasMore = queryLength == nPerPage + 1;
    returnVal.data = queryResult.slice(0, nPerPage);
    if (queryLength > 0) {
      returnVal.endValue =
        queryResult[Math.min(queryLength - 1, nPerPage - 1)]._id;
    }

    return returnVal;
  } finally {
    client.close();
  }
}

async function addToCollections(username, carId) {
  let client;

  try {
    client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();

    const db = client.db(DB_NAME);
    const users = db.collection('users');

    // filter using username
    const filter = { username: username };

    // push the car id to existing saved car array
    const updateDoc = { $push: { saved_cars: carId } };

    // check duplicates: avoid adding repetitive data to user's collections
    const document = await users.findOne(filter);
    const existingList = document.saved_cars;

    // if the user do not have anything in his or her collections
    // or the user's existing list does not have the new car id
    // update document
    if (!existingList || !existingList.includes(carId)) {
      await users.updateOne(filter, updateDoc);
    }
  } finally {
    client.close();
  }
}

async function deleteFromCollections(username, carId) {
  let client;

  try {
    client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();

    const db = client.db(DB_NAME);
    const users = db.collection('users');

    // filter using username
    const filter = { username: username };

    // get the existing list
    const document = await users.findOne(filter);
    const existingList = document.saved_cars;

    // constructing a new saved car list by excluding the unsaved one
    const newCarsList = [];
    existingList.forEach((id) => {
      if (id != carId) {
        newCarsList.push(id);
      }
    });

    // update the document
    const updateDoc = { $set: { saved_cars: newCarsList } };
    await users.updateOne(filter, updateDoc);
  } finally {
    client.close();
  }
}

// Given a username, find all his or her collections
async function getUserCollections(username) {
  let client;

  try {
    client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();

    const db = client.db(DB_NAME);
    const users = db.collection('users');
    const cars = db.collection('cars');

    if (!username) {
      return [];
    }

    // filter using username and get saved cars ids
    const filter = { username: username };
    const document = await users.findOne(filter);
    const savedCarIds = document.saved_cars;

    if (savedCarIds) {
      // find all documents in cars having these car ids
      const savedCars = await cars
        .find({
          _id: { $in: savedCarIds.map((id) => new ObjectId(id)) },
        })
        .toArray();
      return savedCars;
    }

    // if the user haven't yet save any cars
    return [];
  } finally {
    client.close();
  }
}

async function getUserPosts(username) {
  let client;

  try {
    client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();

    const db = client.db(DB_NAME);
    const cars = db.collection('cars');

    if (!username) {
      return [];
    }
    // query using username and get all cars posted by this user
    const query = { username: username };
    const userPosts = await cars.find(query).toArray();

    return userPosts;
  } finally {
    client.close();
  }
}

async function addCarData(carData) {
  let client;

  try {
    client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();

    const db = client.db(DB_NAME);
    const cars = db.collection('cars');

    const result = await cars.insertOne(carData);
  } finally {
    client.close();
  }
}

async function deleteFromPosts(username, carId) {
  let client;

  try {
    client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();

    const db = client.db(DB_NAME);
    const users = db.collection('users');
    const cars = db.collection('cars');

    // delete by car id
    const query = { _id: new ObjectId(carId) };
    const result = await cars.deleteOne(query);
  } finally {
    client.close();
  }
}

async function getPassword(username) {
  let client;

  try {
    client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();

    const db = client.db(DB_NAME);
    const users = db.collection('users');

    // get this user from db
    const currentUser = await users.findOne({ username: username });

    // if username not found, return null
    if (currentUser == null) {
      return null;
    }

    return currentUser.password;
  } finally {
    client.close();
  }
}

async function registerUser(username, password, firstname, lastname) {
  let client;

  try {
    client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();

    const db = client.db(DB_NAME);
    const users = db.collection('users');

    // check if the username already exist
    const currentUser = await users.findOne({ username: username });
    // if username not found, return
    if (currentUser != null) {
      return 'username alreay exists';
    }

    // else: save the user info into db
    const newUser = {
      username: username,
      password: password,
      first_name: firstname,
      last_name: lastname,
    };
    await users.insertOne(newUser);

    return 'success';
  } finally {
    client.close();
  }
}

async function getUserDisplayName(username) {
  let client;

  try {
    client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();

    const db = client.db(DB_NAME);
    const users = db.collection('users');

    if (!username) {
      return {};
    }

    // get this user from db
    const currentUser = await users.findOne({ username: username });
    const displayName = currentUser.first_name + ' ' + currentUser.last_name;

    return displayName;
  } finally {
    client.close();
  }
}

module.exports = {
  getData,
  addToCollections,
  deleteFromCollections,
  getUserCollections,
  getUserPosts,
  addCarData,
  deleteFromPosts,
  getPassword,
  registerUser,
  getUserDisplayName,
};

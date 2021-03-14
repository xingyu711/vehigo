const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const DB_NAME = "car_prices_app";
const uri = `mongodb+srv://test_user:password_test@cluster0.aijdj.mongodb.net/${DB_NAME}?retryWrites=true&writeConcern=majority`;

// TODO: Add pagination when rendering data
async function getData() {
  const dataArray = [];
  let client;

  try {
    client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();

    const db = client.db(DB_NAME);
    const cars = db.collection("cars");

    // query all data
    const query = {};

    const findResult = await cars.find(query).limit(10);

    await findResult.forEach((item) => {
      // ignoring these data that have incorrect price value
      if (item.price != "0") {
        dataArray.push(item);
      }
    });

    return dataArray;
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
    const users = db.collection("users");

    // filter using username
    const filter = { username: username };

    // push the car id to existing saved car array
    const updateDoc = { $push: { saved_cars: carId } };

    // check duplicates: avoid adding repetitive data to user's collections
    const document = await users.findOne(filter);
    const existingList = document.saved_cars;
    if (!existingList.includes(carId)) {
      // update document
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
    const users = db.collection("users");

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
    const users = db.collection("users");
    const cars = db.collection("cars");

    // filter using username and get saved cars ids
    const filter = { username: username };
    const document = await users.findOne(filter);
    const savedCarIds = document.saved_cars;

    // find all documents in cars having these car ids
    const savedCars = await cars
      .find({
        _id: { $in: savedCarIds.map((id) => new ObjectId(id)) },
      })
      .toArray();

    return savedCars;
  } finally {
    client.close();
  }
}

module.exports = {
  getData,
  addToCollections,
  deleteFromCollections,
  getUserCollections,
};

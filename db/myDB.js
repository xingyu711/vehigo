const { MongoClient } = require('mongodb');

async function getData() {
  const DB_NAME = 'car_prices_app';
  const uri = `mongodb+srv://test_user:password_test@cluster0.aijdj.mongodb.net/${DB_NAME}?retryWrites=true&writeConcern=majority`;
  const dataArray = [];

  let client;
  try {
    client = new MongoClient(uri, { useUnifiedTopology: true });
    console.log('Connecting to the db');

    await client.connect();
    console.log('Connected!');

    const db = client.db(DB_NAME);
    const cars = db.collection('cars');

    const query = {};
    console.log('Collection ready, querying with ', query);

    const findResult = await cars.find(query).limit(50);

    await findResult.forEach((item) => {
      if (item.price != '0') {
        dataArray.push(item);
      }
    });

    return dataArray;
  } finally {
    client.close();
  }
}

module.exports = { getData };

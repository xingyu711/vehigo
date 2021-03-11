const collectionsBox = document.querySelector('.collections-box');

function renderCard(item) {
  const {
    _id,
    manufacturer,
    model,
    year,
    price,
    odometer,
    drive,
    fuel,
    transmission,
    state,
  } = item;

  const yearTrunc = Math.trunc(year);
  const odometerTrunc = Math.trunc(odometer);

  const divCard = document.createElement('div');
  divCard.className = 'card car-card';

  divCard.innerHTML = `
    <div class="card-body">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <h5 class="card-title">${manufacturer} ${model} ${year} - $${price}</h5>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-5 col-sm-12 car-details"><strong>Manufacturer:</strong> ${manufacturer}</div>
          <div class="col-lg-5 col-sm-12 car-details"><strong>Model:</strong> ${model}</div>
          <div class="col-lg-2 col-sm-12 car-details"><strong>Year:</strong> ${yearTrunc}</div>
        </div>
        <div class="row">
          <div class="col-lg-5 col-sm-12 car-details"><strong>Price:</strong> $${price}</div>
          <div class="col-lg-5 col-sm-12 car-details"><strong>Odometer (miles):</strong> ${odometerTrunc}</div>
          <div class="col-lg-2 col-sm-12 car-details"><strong>Drive:</strong> <span class="upper">${drive}<span></div>
        </div>
        <div class="row">
          <div class="col-lg-5 col-sm-12 car-details"><strong>Fuel:</strong> ${fuel}</div>
          <div class="col-lg-5 col-sm-12 car-details"><strong>Transmission:</strong> ${transmission}</div>
          <div class="col-lg-2 col-sm-12 car-details"><strong>State:</strong> <span class="upper">${state}<span></div>
        </div>
        <hr />
        <div class="row">
          <div class="col-12">
            <a href="#" onclick="unsaveCar('${_id}')" class="card-link">
              Unsave
            </a>
          </div>
        </div>
      </div>
    </div>`;

  collectionsBox.appendChild(divCard);
}

async function loadCollections() {
  // TODO: need to use actual username!!
  const data = { username: 'xingyu711' };

  const resRaw = await fetch('/getCollections', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const res = await resRaw.json();
  // console.log('Got data', res.data);

  // render card if we have data
  if (res.data.length > 0) {
    collectionsBox.innerHTML = '';

    res.data.forEach((item) => {
      renderCard(item);
    });
  } else {
    // user does not have anything in the collections
    collectionsBox.innerHTML = `<p>You don't have any collections</p>`;
  }
}

// call the function to load collections everytime we come to home page
loadCollections();

async function unsaveCar(car_id) {
  // TODO: need to use actual username!!
  const data = { username: 'xingyu711', car_id: car_id };
  const response = await fetch('/unsaveCar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  // need to reload the collections when user delete data from collections
  loadCollections();
}

const collectionsBox = document.querySelector('.collections-box');
const postsBox = document.querySelector('.posts-box');

function renderCard(item, type, parent) {
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
            <a href="#" onclick="onClick('${_id}', '${type}')" class="card-link">
              ${type}
            </a>
          </div>
        </div>
      </div>
    </div>`;

  parent.appendChild(divCard);
}

async function loadPosts() {
  const resRaw = await fetch('/getPosts');
  const res = await resRaw.json();
  // console.log('Got posts data frontend', res.data);

  // if user is not logged in
  if (resRaw.status === 401) {
    window.location.assign('/signin.html');
  }

  // render card if we have data
  if (res.data.length > 0) {
    postsBox.innerHTML = '';

    res.data.forEach((item) => {
      renderCard(item, 'Delete', postsBox);
    });
  } else {
    // user does not have anything in the collections
    postsBox.innerHTML = "<p>You haven't yet post any data</p>";
  }
}

async function loadCollections() {
  const resRaw = await fetch('/getCollections');
  const res = await resRaw.json();
  // console.log('Got data', res.data);

  // if user is not logged in
  if (resRaw.status === 401) {
    window.location.assign('/signin.html');
    return;
  }

  // render card if we have data
  if (res.data.length > 0) {
    collectionsBox.innerHTML = '';

    res.data.forEach((item) => {
      renderCard(item, 'Unsave', collectionsBox);
    });
  } else {
    // user does not have anything in the collections
    collectionsBox.innerHTML = "<p>You don't have any collections</p>";
  }
}

async function onClick(car_id, type) {
  console.log('calling onClick');
  if (type === 'Unsave') {
    unsaveCar(car_id);
  }
  if (type === 'Delete') {
    deletePost(car_id);
  }
}

async function unsaveCar(car_id) {
  console.log('calling unsaveCar');
  const data = { car_id: car_id };
  const resRaw = await fetch('/unsaveCar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  // if user is not logged in
  if (resRaw.status === 401) {
    window.location.assign('/signin.html');
    return;
  }

  // need to reload the collections when user delete data from collections
  loadCollections();
}

async function deletePost(car_id) {
  const data = { car_id: car_id };
  const resRaw = await fetch('/deletePost', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  // if user is not logged in
  if (resRaw.status === 401) {
    window.location.assign('/signin.html');
    return;
  }

  // need to reload the collections when user delete data from collections
  loadPosts();
}

// call the functions to get user's collections and posts everytime when loading home page
loadCollections();
loadPosts();

const contentBox = document.querySelector('.content-box');
const buttonContainer = document.querySelector('.load-button-container');
const formSearch = document.querySelector('#form-search');

let queryStartValue = '';
let manufacturer = '';
let model = '';
let year = '';
let odometer = '';

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
            <h5 class="card-title">${manufacturer} ${model} ${yearTrunc} - $${price}</h5>
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
            <a href="#" onclick="saveCar('${_id}')" class="card-link">
              Save to My Collections
            </a>
          </div>
        </div>
      </div>
    </div>`;

  contentBox.appendChild(divCard);
}

async function loadData() {
  const resRaw = await fetch('/getData');
  const res = await resRaw.json();

  // if user is not logged in
  if (resRaw.status === 401) {
    window.location.assign('/signin.html');
    return;
  }

  contentBox.innerHTML = '';

  res.dataObj.data.forEach((item) => {
    renderCard(item);
  });

  queryStartValue = res.dataObj.endValue;

  // determine whether load more button is needed
  if (res.dataObj.hasMore) {
    buttonContainer.style.display = 'block';
  }
}

loadData();

/* eslint-disable no-unused-vars */
async function loadMoreData() {
  buttonContainer.style.display = 'none';

  const resRaw = await fetch(
    `/getData?startValue=${queryStartValue}&manufacturer=${manufacturer}&model=${model}&year=${year}&odometer=${odometer}`
  );
  const res = await resRaw.json();

  res.dataObj.data.forEach((item) => {
    renderCard(item);
  });

  queryStartValue = res.dataObj.endValue;

  // determine whether load more button is needed
  if (res.dataObj.hasMore) {
    buttonContainer.style.display = 'block';
  }
}

async function saveCar(car_id) {
  const data = { car_id: car_id };
  const resRaw = await fetch('/saveCar', {
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
}

async function onSearchButtonClick(event) {
  buttonContainer.style.display = 'none';

  event.preventDefault();

  const formData = new FormData(formSearch);

  manufacturer = formData.get('manufacturer');
  model = formData.get('model');
  year = formData.get('year');
  odometer = formData.get('odometer');

  const resRaw = await fetch(
    `/getData?manufacturer=${manufacturer}&model=${model}&year=${year}&odometer=${odometer}`
  );
  const res = await resRaw.json();

  // if user is not logged in
  if (resRaw.status === 401) {
    window.location.assign('/signin.html');
    return;
  }

  queryStartValue = res.dataObj.endValue;

  contentBox.innerHTML = '';

  res.dataObj.data.forEach((item) => {
    renderCard(item);
  });

  // determine whether load more button is needed
  if (res.dataObj.hasMore) {
    buttonContainer.style.display = 'block';
  }
}

/* eslint-enable no-unused-vars */

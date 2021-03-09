const contentBox = document.querySelector('.content-box');

function renderCard(item) {
  const {
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
            <a href="#" class="card-link">
              Save to My Collections
            </a>
          </div>
        </div>
      </div>
    </div>`;

  console.log(divCard);
  console.log(contentBox);

  contentBox.appendChild(divCard);
}

async function loadData() {
  const resRaw = await fetch('/getData');
  const res = await resRaw.json();

  console.log('Got data', res.data);
  contentBox.innerHTML = '';

  res.data.forEach((item) => {
    renderCard(item);
  });
}

loadData();

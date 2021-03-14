const contentBox = document.querySelector(".content-box");

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

  const divCard = document.createElement("div");
  divCard.className = "card car-card";

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
  const resRaw = await fetch("/getData");
  const res = await resRaw.json();

  // if user is not logged in
  if (resRaw.status === 401) {
    window.location.assign("/signin.html");
    return;
  }

  contentBox.innerHTML = "";

  res.data.forEach((item) => {
    renderCard(item);
  });
}

loadData();

async function saveCar(car_id) {
  const data = { car_id: car_id };
  const resRaw = await fetch("/saveCar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  // if user is not logged in
  if (resRaw.status === 401) {
    window.location.assign("/signin.html");
    return;
  }
}

async function onSearchButtonClick() {
  var searchInputValue = document.getElementById("input-box").value;
  var year = document.getElementById("select-year").value;
  var mileage = document.getElementById("select-mileage").value;

  // debug console log
  console.log(
    "search=",
    searchInputValue,
    " year=",
    year,
    " mileage=",
    mileage
  );

  // handle empty input
  if (searchInputValue == null) {
    return;
  }

  const data = { inputValue: searchInputValue, year: year, mileage: mileage };

  const resRaw = await fetch("/searchCar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const res = await resRaw.json();
  console.log(res);

  // if user is not logged in
  if (resRaw.status === 401) {
    alert("Cannot find collection!");
    return;
  }

  contentBox.innerHTML = "";

  res.data.forEach((item) => {
    renderCard(item);
  });
}

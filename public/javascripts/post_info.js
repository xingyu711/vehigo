const formCar = document.querySelector('#form-car');
const successMessage = document.querySelector('#success-message');

async function onFormCarSubmit(event) {
  event.preventDefault();

  const formData = new FormData(formCar);

  const data = {
    manufacturer: formData.get('manufacturer').toLowerCase(),
    model: formData.get('model').toLowerCase(),
    year: formData.get('year'),
    price: formData.get('price'),
    odometer: formData.get('odometer'),
    transmission: formData.get('transmission'),
    fuel: formData.get('fuel'),
    drive: formData.get('drive'),
    state: formData.get('state'),
  };

  console.log('Post info:', data);

  const resRaw = await fetch('/postInfo', {
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

  // successfully post data
  if (resRaw.ok) {
    // reset form content
    formCar.reset();

    // show success message to users and delete the message after 3 seconds
    successMessage.innerHTML = '<p>Success!</p>';
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    await delay(3000);
    successMessage.innerHTML = '';
  }
}

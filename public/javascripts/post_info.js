const formCar = document.querySelector('#form-car');
const successMessage = document.querySelector('#success-message');

async function onFormCarSubmit(event) {
  event.preventDefault();
  // TODO: get actual username from session
  const username = 'xingyu711';

  const formData = new FormData(formCar);
  console.log('form data', formData);
  console.log('posting data');

  const data = {
    manufacturer: formData.get('manufacturer'),
    model: formData.get('model'),
    year: formData.get('year'),
    price: formData.get('price'),
    odometer: formData.get('odometer'),
    transmission: formData.get('transmission'),
    fuel: formData.get('fuel'),
    drive: formData.get('drive'),
    state: formData.get('state'),
    username: username,
  };

  console.log('data', data);

  const res = await fetch('/postInfo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    // reset form content
    formCar.reset();

    // show success message to users and delete the message after 3 seconds
    successMessage.innerHTML = '<p>Success!</p>';
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    await delay(3000);
    successMessage.innerHTML = '';
  }

  console.log('res', res);
}

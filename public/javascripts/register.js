const formRegister = document.querySelector('#form-register');
const passwordConfirmInput = document.querySelector('#passwordConfirmInput');
const passwordInput = document.querySelector('#passwordInput');
const alert = document.querySelector('.alert');

/* eslint-disable no-unused-vars */
async function onFormRegisterSubmit(event) {
  event.preventDefault();

  const formData = new FormData(formRegister);

  const firstname = formData.get('first_name');
  const lastname = formData.get('last_name');
  const username = formData.get('username');
  const password = formData.get('password');

  const data = {
    firstname: firstname,
    lastname: lastname,
    username: username,
    password: password,
  };
  const resRaw = await fetch('/userRegister', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  // fail to register
  if (!resRaw.ok) {
    alert.style.display = 'block';
    alert.innerHTML = 'This username already exists. Please go to sign in';

    // hide the alert after 3s
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    await delay(3000);
    alert.style.display = 'none';
    alert.innerHTML = '';
  } else {
    window.location.assign('/home.html');
  }
}

function validatePassword() {
  if (passwordConfirmInput.value != passwordInput.value) {
    passwordConfirmInput.setCustomValidity('Passwords Do not Match');
  } else {
    passwordConfirmInput.setCustomValidity('');
  }
}
/* eslint-enable no-unused-vars */

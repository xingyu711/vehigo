const navbarUsername = document.querySelector('#navbar-person-name');

async function displayPersonName() {
  const resRaw = await fetch('/getPersonName');

  // if user is not logged in
  if (resRaw.status === 401) {
    window.location.assign('/signin.html');
    return;
  }

  const res = await resRaw.json();
  navbarUsername.innerHTML = res.displayName;
}

async function onLogoutButtonClick() {
  const resRaw = await fetch('/userLogout');

  // if user is not logged in
  if (resRaw.status === 401) {
    window.location.assign('/signin.html');
    return;
  }
}

displayPersonName();

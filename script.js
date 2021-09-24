"use strict";

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");
///////////////////////////////////
let map, type, data, Id, time, lat, lng;
const workouts = [];
let checNumber = false;
let work = [];
// APP
const _LoadMap = function () {
  _getPosition();
  _toggelElevationField();
  _moveToPopup();
};

const _getPosition = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (local) {
        const { latitude } = local.coords;
        const { longitude } = local.coords;
        const coords = [latitude, longitude];

        map = L.map("map").setView(coords, 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        _renderWorkoutMarker();
      },
      function () {
        alert("cant read GPS");
      }
    );
  }
};
const _getLocalStorage = function (mark) {
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: `${type}-popup`,
      })
    )
    .setPopupContent(time)
    .openPopup();
};
const _renderWorkout = function () {
  // prettier-ignore
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  data = new Date();
  Id = (Date.now() + "").slice(-10);

  time = `${
    type === "running" ? "🏃‍♂️" : "🚴‍♀️"
  } ${type[0].toUpperCase()}${type.slice(1)} on ${
    months[data.getMonth()]
  } ${data.getDate()}`;

  let html = `
  <li class="workout workout--${type}" data-id="${Id}">
  <h2 class="workout__title">${type[0].toUpperCase()}${type.slice(1)} on ${
    months[data.getMonth()]
  } ${data.getDate()}</h2>
  <div class="workout__details">
    <span class="workout__icon">${type === "running" ? "🏃‍♂️" : "🚴‍♀️"}</span>
    <span class="workout__value">${work[0]}</span>
    <span class="workout__unit">km</span>
  </div>
  <div class="workout__details">
    <span class="workout__icon">⏱</span>
    <span class="workout__value">${work[1]}</span>
    <span class="workout__unit">min</span>
  </div>`;

  if (type === "running") {
    html += `
    <div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${(work[0] / work[1]).toFixed(2)}</span>
      <span class="workout__unit">min/km</span>
     </div>
     <div class="workout__details">
       <span class="workout__icon">🦶🏼</span>
       <span class="workout__value">${work[2]}</span>
       <span class="workout__unit">spm</span>
     </div>
  </li>
    `;
  }
  if (type === "cycling") {
    html += `
    <div class="workout__details">
    <span class="workout__icon">⚡️</span>
    <span class="workout__value">${(work[1] / work[0]).toFixed(2)}</span>
      <span class="workout__unit">km/h</span>
      </div>
        <div class="workout__details">
       <span class="workout__icon">⛰</span>
     <span class="workout__value">${work[2]}</span>
   </div>
    </li>
    `;
  }
  form.insertAdjacentHTML("afterend", html);
  workouts.push([type, Id, [lat, lng], ...work]);
};
const _renderWorkoutMarker = function () {
  map.on("click", function (mark) {
    lat = mark.latlng.lat;
    lng = mark.latlng.lng;
    _showForm();
    showResponisveMenu();
  });
};
form.addEventListener("submit", function (e) {
  e.preventDefault();
  _newWorkout();
  if (checNumber) {
    _renderWorkout();
    _getLocalStorage();
    _hideForm();
    hiddenResponsiveMenu();
  }
});
function _newWorkout() {
  const validInputs = (...inputs) =>
    inputs.every((inp) => Number.isFinite(inp));
  const allPositive = (...inputs) => inputs.every((i) => i >= 0);

  type = inputType.value;
  const distance = +inputDistance.value;
  const duration = +inputDuration.value;
  checNumber = true;
  if (type === "running") {
    const cadence = +inputCadence.value;
    if (
      !validInputs(distance, duration, cadence) ||
      !allPositive(distance, duration, cadence)
    ) {
      return alert("Inputs have to be positive numbers!"), (checNumber = false);
    } else {
      work = [distance, duration, cadence];
      // console.log(work);
    }
  }
  if (type === "cycling") {
    const elevation = +inputElevation.value;

    if (
      !validInputs(distance, duration, elevation) ||
      !allPositive(distance, duration)
    ) {
      return alert("Inputs have to be positive numbers!"), (checNumber = false);
    } else {
      work = [distance, duration, elevation];
      // console.log(work);
    }
  }
}
const _showForm = function () {
  form.classList.remove("hidden");
  inputDistance.value =
    inputDuration.value =
    inputCadence.value =
    inputElevation.value =
      "";
  inputDistance.focus();
};
const _hideForm = function () {
  form.style.display = "none";
  form.classList.add("hidden");
  setTimeout(() => (form.style.display = "grid"), 100);
};
const _toggelElevationField = function () {
  inputType.addEventListener("change", function () {
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  });
};
const _moveToPopup = function (e) {
  containerWorkouts.addEventListener("click", function (e) {
    const getId = e.target.closest(".workout");
    if (!getId) return;
    console.log(getId);
    const workout = workouts.filter((i) => i[1] === getId.dataset.id);
    console.log(workout);
    map.setView(workout[0][2], 13, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  });
};
const _setLocalStorage = function () {};
const _rest = function () {};
_LoadMap();

/// responsive
const list = document.querySelector(".sidebar");
const menu = document.querySelector(".btn-res");
const body = document.querySelector("body");
const showResponisveMenu = function () {
  console.log(screen.width);
  if (screen.width < 520) {
    list.style.display = "block";
    body.style.display = "block";
    list.style.opacity = "0";
    setTimeout(function () {
      list.style.opacity = "1";
    }, 100);
    list.classList.add("act");
  }
};
const hiddenResponsiveMenu = function () {
  if (screen.width < 520) {
    list.style.display = "none";
    body.style.display = "flex";
    body.style.flexDirection = "column";
    list.classList.remove("act");
  }
};
menu.addEventListener("click", function () {
  if (list.classList.contains("act")) {
    hiddenResponsiveMenu();
  } else {
    showResponisveMenu();
  }
});

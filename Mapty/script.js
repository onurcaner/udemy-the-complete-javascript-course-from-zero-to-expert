'use strict';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const App = class {
  #elements;
  #map;
  #last = {};
  #workouts = [];
  constructor({ elements, mapID }) {
    this.#elements = { ...elements };
    this.#map = L.map(mapID);

    this.#elements.form.addEventListener(
      'submit',
      this.#onSubmitFormHandler.bind(this)
    );
    this.#elements.inputType.addEventListener(
      'change',
      this.#onChangeInputTypeHandler.bind(this)
    );
    navigator.geolocation.getCurrentPosition(
      this.#onGeolocationSuccessHandler.bind(this),
      this.#onGeolocationErrorHandler.bind(this)
    );
  }

  /* Geolocation */
  #renderMap() {
    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
  }

  #onGeolocationSuccessHandler({ coords: { longitude, latitude } }) {
    this.#map.setView([latitude, longitude], 13);
    this.#renderMap();
    this.#map.on('click', this.#onClickMapHandler.bind(this));
  }

  #onGeolocationErrorHandler() {
    alert('Could not retrieve your location');
  }

  /* Map */
  #renderMarkerAtLastCoordinates() {
    this.#last.marker?.remove();
    this.#last.marker = L.marker(this.#last.coordinates);
    this.#last.marker.addTo(this.#map);
  }

  #renderMarkers() {
    this.#workouts.forEach(({ marker }) => {
      marker.addTo(this.#map).openPopup();
    });
  }

  #onClickMapHandler({ latlng: { lat, lng } }) {
    this.#last.coordinates = [lat, lng];
    this.#renderMarkerAtLastCoordinates();
    this.#showForm(true);
  }

  /* Form */
  #showForm(shouldShowTheForm) {
    if (shouldShowTheForm) this.#elements.form.classList.remove('hidden');
    else this.#elements.form.classList.add('hidden');
  }

  #onSubmitFormHandler(e) {
    e.preventDefault();
    this.#createWorkout();
    this.#last.marker.remove();
    this.#renderMarkers();
    this.#showForm(false);
  }

  #onChangeInputTypeHandler({ target: { value: selectOption } }) {
    const inputCadenceContainer =
      this.#elements.inputCadence.closest('.form__row');
    const inputElevationContainer =
      this.#elements.inputElevation.closest('.form__row');

    switch (selectOption) {
      case 'running': {
        inputCadenceContainer.classList.remove('form__row--hidden');
        inputElevationContainer.classList.add('form__row--hidden');
        break;
      }
      case 'cycling': {
        inputCadenceContainer.classList.add('form__row--hidden');
        inputElevationContainer.classList.remove('form__row--hidden');
        break;
      }
      default: {
      }
    }
  }

  /* Workouts */
  #createWorkout() {
    const workout = { data: {}, marker: undefined, coordinates: [] };
    workout.coordinates = this.#last.coordinates;
    workout.marker = L.marker(workout.coordinates);

    const templateHTML = `<div>A pretty CSS popup.<br> Easily customizable.</div>`;
    workout.marker.bindPopup(templateHTML, {
      className: 'running-popup',
      autoClose: false,
      closeOnEscapeKey: false,
      closeOnClick: false,
    });

    this.#workouts.push(workout);
    console.log(this.#workouts);
  }
};

const elements = {
  form: document.querySelector('.form'),
  containerWorkouts: document.querySelector('.workouts'),
  inputType: document.querySelector('.form__input--type'),
  inputDistance: document.querySelector('.form__input--distance'),
  inputDuration: document.querySelector('.form__input--duration'),
  inputCadence: document.querySelector('.form__input--cadence'),
  inputElevation: document.querySelector('.form__input--elevation'),
  inputTexts: document.querySelectorAll('input.form__input'),
};

window.addEventListener('load', function (e) {
  const mapty = new App({ elements, mapID: 'map' });
});

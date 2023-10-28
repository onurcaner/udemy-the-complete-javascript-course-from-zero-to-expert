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
  #temp = {};
  #workouts = [];
  #markers = [];
  constructor({ elements, mapID }) {
    this.#elements = { ...elements };
    this.#map = L.map(mapID);
    this.#initializeForm();
    this.#getUserPosition();
  }

  /* Geolocation */
  #getUserPosition() {
    navigator.geolocation.getCurrentPosition(
      this.#onGeolocationSuccessHandler.bind(this),
      this.#onGeolocationErrorHandler.bind(this)
    );
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
  #renderMap() {
    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
  }

  #renderMarkerAtLastCoordinates() {
    this.#temp.marker?.remove();
    this.#temp.marker = L.marker(this.#temp.coordinates);
    this.#temp.marker.addTo(this.#map);
  }

  #renderMarker(workout) {
    let content;
    let className;
    const dateText = new Intl.DateTimeFormat('en-GB', {
      month: 'long',
      day: '2-digit',
    }).format(workout.date);

    if (workout instanceof RunningWorkout) {
      content = `🏃‍♂️ Running on ${dateText}`;
      className = 'running-popup';
    } else if (workout instanceof CyclingWorkout) {
      content = `🚴‍♀️ Cycling on ${dateText}`;
      className = 'cycling-popup';
    } else {
      throw Error();
    }

    const marker = L.marker(workout.coordinates);
    marker
      .bindPopup(content, {
        className,
        autoClose: false,
        closeOnEscapeKey: false,
        closeOnClick: false,
      })
      .addTo(this.#map)
      .openPopup();
    this.#markers.push(marker);

    return this;
  }

  #renderMarkers() {
    this.#markers.forEach((marker) => marker.remove());
    this.#markers = [];
    this.#workouts.forEach(this.#renderMarker.bind(this));
  }

  #onClickMapHandler({ latlng: { lat, lng } }) {
    this.#temp.coordinates = [lat, lng];
    this.#renderMarkerAtLastCoordinates();
    this.#hideForm(false);
    this.#elements.inputDistance.focus();
  }

  /* Form */
  #hideForm(shouldHideTheForm) {
    if (shouldHideTheForm) this.#elements.form.classList.add('hidden');
    else this.#elements.form.classList.remove('hidden');
    return this;
  }

  #swapFormWithWorkout(workout) {
    console.log(this.#elements.form.style.display);
    this.#elements.form.style.display = 'none';
    this.#renderWorkoutOnList(workout);
    this.#hideForm(true).#clearFormFields();
    setTimeout(() => {
      this.#elements.form.style.display = '';
    });
  }

  #isInputsSane() {
    const { type, distance, duration, cadence, elevationGain } =
      this.#readFormFields();
    let isSane = true;
    if (
      distance <= 0 ||
      duration <= 0 ||
      (type === 'running' && cadence <= 0)
    ) {
      isSane = false;
    }
    return isSane;
  }

  #onSubmitFormHandler(e) {
    e.preventDefault();
    if (!this.#isInputsSane.call(this)) {
      return alert('Form is not filled correctly.');
    }

    const workout = this.#createWorkout();
    /* this.#hideForm(true).#renderWorkoutOnList(workout).#clearFormFields(); */
    this.#swapFormWithWorkout(workout);
    this.#renderMarker(workout).#temp.marker.remove();
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

  #readFormFields() {
    const type = this.#elements.inputType.value;
    const distance = +this.#elements.inputDistance.value;
    const duration = +this.#elements.inputDuration.value;
    const cadence = +this.#elements.inputCadence.value;
    const elevationGain = +this.#elements.inputElevation.value;
    return { type, distance, duration, cadence, elevationGain };
  }

  #clearFormFields() {
    this.#elements.inputDistance.value = '';
    this.#elements.inputDuration.value = '';
    this.#elements.inputCadence.value = '';
    this.#elements.inputElevation.value = '';
    return this;
  }

  #initializeForm() {
    this.#elements.form.addEventListener(
      'submit',
      this.#onSubmitFormHandler.bind(this)
    );
    this.#elements.inputType.addEventListener(
      'change',
      this.#onChangeInputTypeHandler.bind(this)
    );
  }

  /* Workouts */
  #createWorkout() {
    const workoutData = this.#readFormFields();
    workoutData.coordinates = this.#temp.coordinates;
    let workout;
    switch (workoutData.type) {
      case 'running': {
        workout = new RunningWorkout(workoutData);
        break;
      }
      case 'cycling': {
        workout = new CyclingWorkout(workoutData);
        break;
      }
      case 'default': {
        throw Error();
      }
    }
    this.#workouts.push(workout);
    return workout;
  }

  /* Sidebar Workoust */
  #createWorkoutElement(workout) {
    let templateHTML = 'SOMETHING WENT WRONG IN #createWorkoutElement(workout)';
    if (workout instanceof RunningWorkout) {
      templateHTML = `
      <li class="workout workout--running" data-id="${workout.id}">
        <h2 class="workout__title">Running on ${new Intl.DateTimeFormat(
          'en-GB',
          { month: 'long', day: '2-digit' }
        ).format(workout.date)}</h2>
        <div class="workout__details">
          <span class="workout__icon">🏃‍♂️</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.pace.toFixed(2)}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${workout.cadence}</span>
          <span class="workout__unit">spm</span>
        </div>
      </li>
      `;
    }
    if (workout instanceof CyclingWorkout) {
      templateHTML = `
      <li class="workout workout--cycling" data-id="${workout.id}">
        <h2 class="workout__title">Cycling on ${new Intl.DateTimeFormat(
          'en-GB',
          { month: 'long', day: '2-digit' }
        ).format(workout.date)}</h2>
        <div class="workout__details">
          <span class="workout__icon">🚴‍♀️</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.speed.toFixed(2)}</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${workout.elevationGain}</span>
          <span class="workout__unit">m</span>
        </div>
      </li>
    `;
    }

    const elementContainer = document.createElement('div');
    elementContainer.innerHTML = templateHTML;
    const workoutElement = elementContainer.querySelector('.workout');
    return workoutElement;
  }

  #renderWorkoutOnList(workout) {
    this.#elements.form.insertAdjacentElement(
      'afterend',
      this.#createWorkoutElement.call(this, workout)
    );
    return this;
  }

  #renderWorkoutsOnList() {
    this.#workouts.forEach(this.#renderWorkoutOnList.bind(this));
  }
};

const Workout = class {
  #id;
  #date;
  #distance;
  #duration;
  #coordinates;
  constructor({ distance, duration, coordinates }) {
    this.#date = new Date();
    this.#id = this.#date.getTime();
    this.#distance = distance;
    this.#duration = duration;
    this.#coordinates = coordinates;
  }

  get id() {
    return this.#id;
  }
  get date() {
    return this.#date;
  }
  get distance() {
    return this.#distance;
  }
  get duration() {
    return this.#duration;
  }
  get coordinates() {
    return this.#coordinates;
  }
};

const RunningWorkout = class extends Workout {
  #cadence;
  #pace;
  constructor({ cadence, ...rest }) {
    super(rest);
    this.#cadence = cadence;
    this.#calculatePace();
  }

  get cadence() {
    return this.#cadence;
  }
  get pace() {
    return this.#pace;
  }

  #calculatePace() {
    this.#pace = this.duration / this.distance;
    return this.#pace;
  }
};

const CyclingWorkout = class extends Workout {
  #elevationGain;
  #speed;
  constructor({ elevationGain, ...rest }) {
    super(rest);
    this.#elevationGain = elevationGain;
    this.#calculateSpeed();
  }

  get elevationGain() {
    return this.#elevationGain;
  }
  get speed() {
    return this.#speed;
  }

  #calculateSpeed() {
    this.#speed = this.distance / this.duration;
    return this.#speed;
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

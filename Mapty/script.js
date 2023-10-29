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
  #IntlDateTimeFormat = new Intl.DateTimeFormat('en-GB', {
    month: 'long',
    day: '2-digit',
  });
  constructor({ elements, mapID }) {
    this.#elements = { ...elements };
    this.#map = L.map(mapID);
    this.#initializeForm();
    this.#initializeWorkoutsContainer();
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
    this.#initializeMap([latitude, longitude]);
    this.#loadWorkouts();
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

  #onClickMapHandler({ latlng: { lat, lng } }) {
    const clickCoordinates = [lat, lng];

    this.#temp.coordinates = clickCoordinates;
    this.#renderTempMarkerAtTempCoordinates();
    this.#hideForm(false);
    this.#elements.inputDistance.focus();
  }

  #initializeMap(coordinates) {
    this.#map.setView(coordinates, 13);
    this.#renderMap();
    this.#map.on('click', this.#onClickMapHandler.bind(this));
  }

  /* Map Markers and Popups */
  #removeTempMarker() {
    this.#temp.marker?.remove();
    return this;
  }

  #renderTempMarkerAtTempCoordinates() {
    this.#removeTempMarker();
    this.#temp.marker = L.marker(this.#temp.coordinates);
    this.#temp.marker.addTo(this.#map);
  }

  #renderMarker(workout) {
    let popupContent;
    let popupClassName;
    const dateText = this.#IntlDateTimeFormat.format(workout.date);

    if (workout instanceof RunningWorkout) {
      popupContent = `🏃‍♂️ Running on ${dateText}`;
      popupClassName = 'running-popup';
    } else if (workout instanceof CyclingWorkout) {
      popupContent = `🚴‍♀️ Cycling on ${dateText}`;
      popupClassName = 'cycling-popup';
    } else {
      throw Error();
    }

    const marker = L.marker(workout.coordinates);
    marker
      .bindPopup(popupContent, {
        className: popupClassName,
        autoClose: false,
        closeOnEscapeKey: false,
        closeOnClick: false,
      })
      .addTo(this.#map)
      .openPopup();
    return this;
  }

  #renderMarkers() {
    this.#workouts.forEach(this.#renderMarker.bind(this));
  }

  /* Workout Instances */
  #createWorkoutInstance(workoutData) {
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
    workoutData.Date = workout.date;
    workoutData.id = workout.id;
    return workout;
  }

  /* Sidebar Form */
  #hideForm(shouldHideTheForm) {
    if (shouldHideTheForm) this.#elements.form.classList.add('hidden');
    else this.#elements.form.classList.remove('hidden');
    return this;
  }

  #swapFormWithWorkout(workout) {
    this.#elements.form.style.display = 'none';
    this.#renderWorkoutOnList(workout);
    this.#hideForm(true).#clearFormFields();
    setTimeout(() => {
      this.#elements.form.style.display = '';
    });
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

  #isInputsSane() {
    const { type, distance, duration, cadence } = this.#readFormFields();

    if (distance <= 0 || duration <= 0 || (type === 'running' && cadence <= 0))
      return false;

    return true;
  }

  #onSubmitFormHandler(e) {
    e.preventDefault();
    if (!this.#isInputsSane.call(this)) {
      return alert('Form is not filled correctly.');
    }
    /* Create workout instance and workout data */
    const workoutData = this.#readFormFields();
    workoutData.coordinates = this.#temp.coordinates;
    const workout = this.#createWorkoutInstance(workoutData);

    /* Save workoutData */
    this.#saveWorkout(workoutData);

    /* Render */
    this.#swapFormWithWorkout(workout);
    this.#renderMarker(workout).#removeTempMarker();
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

  /* Sidebar Workouts */
  #createWorkoutElement(workout) {
    let templateHTML = 'SOMETHING WENT WRONG IN #createWorkoutElement(workout)';
    if (workout instanceof RunningWorkout) {
      templateHTML = `
      <li class="workout workout--running" data-id="${workout.id}">
        <h2 class="workout__title">Running on ${this.#IntlDateTimeFormat.format(
          workout.date
        )}</h2>
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
        <h2 class="workout__title">Cycling on ${this.#IntlDateTimeFormat.format(
          workout.date
        )}</h2>
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

  #isWorkoutElement(element) {
    return element.closest('.workout') || false;
  }

  #onClickWorkoutsContainerHandler({ target }) {
    if (!this.#isWorkoutElement(target)) return;

    const {
      dataset: { id: elementID },
    } = target.closest('.workout');
    const { coordinates } = this.#workouts.find(({ id }) => id === +elementID);

    this.#map.flyTo(coordinates);
  }

  #initializeWorkoutsContainer() {
    this.#elements.containerWorkouts.addEventListener(
      'click',
      this.#onClickWorkoutsContainerHandler.bind(this)
    );
  }

  /* Local Storage */
  flushLocalStorage() {
    localStorage.removeItem('workouts');
    console.log('Removed workouts from local storage!');
  }

  #getSavedWorkouts() {
    const workoutsData = JSON.parse(localStorage.getItem('workouts'));
    return workoutsData ?? [];
  }

  #saveWorkout(workoutData) {
    const workoutsData = this.#getSavedWorkouts();
    workoutsData.push(workoutData);
    localStorage.setItem('workouts', JSON.stringify(workoutsData));
  }

  #loadWorkouts() {
    const workoutsData = this.#getSavedWorkouts();
    if (workoutsData.length < 1) return;

    workoutsData.forEach(this.#createWorkoutInstance.bind(this));
    this.#renderWorkoutsOnList();
    this.#renderMarkers();
  }
};

const Workout = class {
  #id;
  #date;
  #distance;
  #duration;
  #coordinates;
  constructor({ id, date, distance, duration, coordinates }) {
    this.#date = date ? new Date(date) : new Date();
    this.#id = id ?? this.#date.getTime();
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
  containerWorkouts: document.querySelector('.workouts'),
  form: document.querySelector('.form'),
  inputType: document.querySelector('.form__input--type'),
  inputDistance: document.querySelector('.form__input--distance'),
  inputDuration: document.querySelector('.form__input--duration'),
  inputCadence: document.querySelector('.form__input--cadence'),
  inputElevation: document.querySelector('.form__input--elevation'),
};

let flushLocalStorage;

window.addEventListener('load', function (e) {
  const mapty = new App({ elements, mapID: 'map' });
  flushLocalStorage = mapty.flushLocalStorage;
});

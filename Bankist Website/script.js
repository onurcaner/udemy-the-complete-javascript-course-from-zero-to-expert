'use strict';

///////////////////////////////////////////////////////////////////////////////
// Global Objects /////////////////////////////////////////////////////////////
const keyboardCallback = {
  Escape: () => {},
};
///////////////////////////////////////////////////////////////////////////////
// Modal Window ///////////////////////////////////////////////////////////////
const modal = {
  isOpen: false,
  container: document.querySelector('.modal'),
  overlay: document.querySelector('.overlay'),
  buttonClose: document.querySelector('.btn--close-modal'),
  buttonsOpenModal: document.querySelectorAll('.btn--show-modal'),

  openModal() {
    this.isOpen = true;
    this.container.classList.remove('hidden');
    this.overlay.classList.remove('hidden');
  },
  closeModal() {
    this.isOpen = false;
    this.container.classList.add('hidden');
    this.overlay.classList.add('hidden');
  },

  openModalHandler(e) {
    e.preventDefault();
    this.openModal.call(this);
  },
  closeModalHandler(e) {
    e.preventDefault();
    this.closeModal.call(this);
  },

  initializeModalEvents(keyboardCallback) {
    this.buttonsOpenModal.forEach((buttonOpenModal) =>
      buttonOpenModal.addEventListener(
        'click',
        this.openModalHandler.bind(this)
      )
    );

    this.buttonClose.addEventListener(
      'click',
      this.closeModalHandler.bind(this)
    );

    this.overlay.addEventListener('click', this.closeModalHandler.bind(this));

    keyboardCallback['Escape'] &&= this.closeModal.bind(this);
  },
};

///////////////////////////////////////////////////////////////////////////////
// Navigation Bar /////////////////////////////////////////////////////////////
const navbar = {
  scrollOptions: { behavior: 'smooth' },

  header: document.querySelector('.header'),
  nav: document.querySelector('.nav'),
  imglogo: document.querySelector('.nav__logo'),
  buttonContainer: document.querySelector('.nav__links'),
  clickables: [
    document.querySelector('.nav__logo'),
    ...document.querySelectorAll('.nav__link'),
  ],

  isClickable(element) {
    if (
      element.classList.contains('nav__link') ||
      element.classList.contains('nav__logo')
    )
      return true;
    return false;
  },

  isNavigationButton(element) {
    if (
      element.classList.contains('nav__link') &&
      !element.classList.contains('btn--show-modal')
    )
      return true;
    return false;
  },

  onClickLogoHandler(e) {
    e.preventDefault();
    this.header.scrollIntoView(this.scrollOptions);
  },

  onClickButtonHandler(e) {
    e.preventDefault();
    if (!this.isNavigationButton(e.target)) return;

    const targetID = e.target.getAttribute('href');
    document.querySelector(targetID).scrollIntoView(this.scrollOptions);
  },

  onMouseoverHandler(e) {
    if (!this.isClickable(e.target)) return;

    this.clickables.forEach((clickable) =>
      clickable.classList.add('--low-opacity')
    );
    e.target.classList.remove('--low-opacity');
  },

  onMouseoutHandler(e) {
    if (!this.isClickable(e.target)) return;

    this.clickables.forEach((clickable) =>
      clickable.classList.remove('--low-opacity')
    );
  },

  initializeNavEvents() {
    this.imglogo.addEventListener('click', this.onClickLogoHandler.bind(this));

    this.buttonContainer.addEventListener(
      'click',
      this.onClickButtonHandler.bind(this)
    );

    [this.imglogo, this.buttonContainer].forEach((button) => {
      button.addEventListener('mouseover', this.onMouseoverHandler.bind(this));
      button.addEventListener('mouseout', this.onMouseoutHandler.bind(this));
    });
  },
};

///////////////////////////////////////////////////////////////////////////////
// Operations /////////////////////////////////////////////////////////////////
const operations = {
  container: document.querySelector('.operations'),
  buttonContainer: document.querySelector('.operations__tab-container'),
  buttons: document.querySelectorAll('.operations__tab'),
  contents: document.querySelectorAll('.operations__content'),

  showContent(contentNumber) {
    const activeClassName = 'operations__content--active';
    this.contents.forEach((content) =>
      content.classList.remove(activeClassName)
    );
    this.container
      .querySelector(`.operations__content--${contentNumber}`)
      .classList.add(activeClassName);
  },

  highlightButton(buttonNumber) {
    const activeClassName = 'operations__tab--active';
    this.buttons.forEach((button) => button.classList.remove(activeClassName));
    this.buttonContainer
      .querySelector(`.operations__tab--${buttonNumber}`)
      .classList.add(activeClassName);
  },

  showContentHandler(e) {
    e.preventDefault();
    if (
      !e.target.classList.contains('operations__tab') &&
      !e.target.parentElement.classList.contains('operations__tab')
    )
      return;

    const tabNumber = e.target.dataset.tab ?? +e.target.textContent;
    this.showContent.call(this, tabNumber);
    this.highlightButton.call(this, tabNumber);
  },

  initializeOperationsEvents() {
    this.buttonContainer.addEventListener(
      'click',
      this.showContentHandler.bind(this)
    );
  },
};

///////////////////////////////////////////////////////////////////////////////
// Keyboard ///////////////////////////////////////////////////////////////////
const keyboardEventHandler = function (e) {
  switch (e.key) {
    case 'Escape':
      modal.isOpen && keyboardCallback[e.key]();
      break;
  }
};

const initializeKeyboardEvents = function () {
  document.addEventListener('keydown', keyboardEventHandler);
};

///////////////////////////////////////////////////////////////////////////////
// Scroll /////////////////////////////////////////////////////////////////////
const intersectionObserver = {
  headerObserver: {
    observer: null,
    observeTargets: document.querySelector('.header'),
    modifyTarget: document.querySelector('.nav'),

    makeSticky(makeSticky) {
      if (makeSticky) this.modifyTarget.classList.add('sticky');
      else this.modifyTarget.classList.remove('sticky');
    },

    intersectionHandler(entries, observer) {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) this.makeSticky.call(this, true);
        else this.makeSticky.call(this, false);
      });
    },

    initialize() {
      const options = { threshold: 0 };
      this.observer = new IntersectionObserver(
        this.intersectionHandler.bind(this),
        options
      );
      this.observer.observe(this.observeTargets);
    },
  },
};

///////////////////////////////////////////////////////////////////////////////
// Initialize /////////////////////////////////////////////////////////////////
modal.initializeModalEvents(keyboardCallback);
navbar.initializeNavEvents();
operations.initializeOperationsEvents();
intersectionObserver.headerObserver.initialize();
initializeKeyboardEvents();

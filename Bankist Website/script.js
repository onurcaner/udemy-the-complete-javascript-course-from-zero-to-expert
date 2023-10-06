'use strict';

///////////////////////////////////////////////////////////////////////////////
// Global Objects /////////////////////////////////////////////////////////////

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

  // mouse methods
  openModalHandler(e) {
    e.preventDefault();
    this.openModal.call(this);
  },
  closeModalHandler(e) {
    e.preventDefault();
    this.closeModal.call(this);
  },

  // keyboard methods
  keyboardEventHandler(e) {
    if (e.key === 'Escape') {
      this.isOpen && this.closeModal.call(this);
    }
  },

  initialize() {
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

    document.addEventListener('keydown', this.keyboardEventHandler.bind(this));
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

  observer: new IntersectionObserver(() => {}),

  // mouse related methods
  isClickable(element) {
    return (
      element.classList.contains('nav__link') ||
      element.classList.contains('nav__logo')
    );
  },

  isNavigationButton(element) {
    return (
      element.classList.contains('nav__link') &&
      !element.classList.contains('btn--show-modal')
    );
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

  // IntersectionObserver methods
  makeSticky() {
    this.nav.classList.add('sticky');
  },
  makeUnsticky() {
    this.nav.classList.remove('sticky');
  },

  intersectionHandler(entries, observer) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) this.makeSticky.call(this);
      else this.makeUnsticky.call(this);
    });
  },

  initialize() {
    // add click events
    this.imglogo.addEventListener('click', this.onClickLogoHandler.bind(this));
    this.buttonContainer.addEventListener(
      'click',
      this.onClickButtonHandler.bind(this)
    );
    // add hover events
    [this.imglogo, this.buttonContainer].forEach((button) => {
      button.addEventListener('mouseover', this.onMouseoverHandler.bind(this));
      button.addEventListener('mouseout', this.onMouseoutHandler.bind(this));
    });
    // add intersection events
    const options = {
      threshold: 0,
      rootMargin: `-${this.nav.getBoundingClientRect().height}px`,
    };
    this.observer = new IntersectionObserver(
      this.intersectionHandler.bind(this),
      options
    );
    this.observer.observe(this.header);
  },
};

///////////////////////////////////////////////////////////////////////////////
// Operations /////////////////////////////////////////////////////////////////
const operations = {
  container: document.querySelector('.operations'),
  buttonContainer: document.querySelector('.operations__tab-container'),
  buttons: document.querySelectorAll('.operations__tab'),
  contents: document.querySelectorAll('.operations__content'),

  isButton(element) {
    return (
      element.classList.contains('operations__tab') ||
      element.parentElement.classList.contains('operations__tab')
    );
  },

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
    if (!this.isButton(e.target)) return;

    const tabNumber = e.target.dataset.tab ?? +e.target.textContent;
    this.showContent.call(this, tabNumber);
    this.highlightButton.call(this, tabNumber);
  },

  initialize() {
    this.buttonContainer.addEventListener(
      'click',
      this.showContentHandler.bind(this)
    );
  },
};

///////////////////////////////////////////////////////////////////////////////
// Sections ///////////////////////////////////////////////////////////////////
const sections = {
  observer: new IntersectionObserver(() => {}),
  nav: document.querySelector('.nav'),
  sections: document.querySelectorAll('.section'),

  revealSection(element) {
    element.classList.remove('section--hidden');
  },

  intersectionHandler(entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.revealSection.call(this, entry.target);
        observer.unobserve(entry.target);
      }
    });
  },

  initialize() {
    const options = {
      threshold: 0,
      rootMargin: `-${this.nav.getBoundingClientRect().height}px`, //9rem
    };
    this.observer = new IntersectionObserver(
      this.intersectionHandler.bind(this),
      options
    );
    this.sections.forEach((section) => {
      this.observer.observe(section);
      section.classList.add('section--hidden');
    });
  },
};

///////////////////////////////////////////////////////////////////////////////
// Lazy Loaded Images /////////////////////////////////////////////////////////
const lazyLoading = {
  images: [...document.querySelectorAll('.lazy-img[data-src]')],
  observer: new IntersectionObserver(() => {}),

  loadImage(element) {
    element.setAttribute('src', element.dataset.src);
    element.addEventListener('load', this.onLoadImageHandler.bind(this));
  },

  onLoadImageHandler(e) {
    e.preventDefault();
    e.target.classList.remove('lazy-img');
    this.observer.unobserve(e.target);
  },

  intersectionHandler(entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) this.loadImage.call(this, entry.target);
    });
  },

  initialize() {
    const options = {
      threshold: 0,
      rootMargin: `${window.innerHeight * 0.25}px`,
    };
    this.observer = new IntersectionObserver(
      this.intersectionHandler.bind(this),
      options
    );
    this.images.forEach((image) => this.observer.observe(image));
  },
};

///////////////////////////////////////////////////////////////////////////////
// Initialize /////////////////////////////////////////////////////////////////
modal.initialize();
navbar.initialize();
sections.initialize();
operations.initialize();
lazyLoading.initialize();

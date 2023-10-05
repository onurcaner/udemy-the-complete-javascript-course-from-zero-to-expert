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

  openModalHandler(e) {
    e.preventDefault();
    this.openModal.call(this);
  },
  closeModalHandler(e) {
    e.preventDefault();
    this.closeModal.call(this);
  },
};

const initializeModal = function (keyboardCallback) {
  modal.buttonsOpenModal.forEach((buttonOpenModal) =>
    buttonOpenModal.addEventListener(
      'click',
      modal.openModalHandler.bind(modal)
    )
  );
  modal.buttonClose.addEventListener(
    'click',
    modal.closeModalHandler.bind(modal)
  );
  modal.overlay.addEventListener('click', modal.closeModalHandler.bind(modal));

  keyboardCallback['Escape'] &&= modal.closeModal.bind(modal);
};

///////////////////////////////////////////////////////////////////////////////
// Keyboard ///////////////////////////////////////////////////////////////////
const keyboardCallback = {
  Escape: () => {},
};
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
// Initialize /////////////////////////////////////////////////////////////////
initializeModal(keyboardCallback);
initializeKeyboardEvents();
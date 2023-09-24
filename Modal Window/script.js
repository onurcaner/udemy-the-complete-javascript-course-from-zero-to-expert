'use strict';

const modalButtons = document.querySelectorAll('.show-modal');
const closeModalButton = document.querySelector('.close-modal');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');

const showModal = (event) => {
  if (modal.classList.contains('hidden')) modal.classList.remove('hidden');
  if (overlay.classList.contains('hidden')) overlay.classList.remove('hidden');
};

const hideModal = (event) => {
  if (!modal.classList.contains('hidden')) modal.classList.add('hidden');
  if (!overlay.classList.contains('hidden')) overlay.classList.add('hidden');
};

const handleKeydown = (event) => {
  console.log(event);
  switch (event.key) {
    case 'Escape':
      hideModal();
      break;
    default:
      break;
  }
};

// initialize show modal buttons' click events
for (const modalButton of modalButtons) {
  modalButton.addEventListener('click', showModal);
}

// initialize overlay click events
closeModalButton.addEventListener('click', hideModal);
overlay.addEventListener('click', hideModal);

// initialize global keydown event
document.addEventListener('keydown', handleKeydown);

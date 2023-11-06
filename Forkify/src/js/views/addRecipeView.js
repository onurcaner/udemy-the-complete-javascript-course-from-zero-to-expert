import FormView from './FormView';

const AddRecipeView = class extends FormView {
  _formElement = document.querySelector('.upload');
  _overlayElement = document.querySelector('.overlay');
  _modalElement = document.querySelector('.add-recipe-window');
  _closeModalButton = document.querySelector('.btn--close-modal');
  _openModalButton = document.querySelector('.nav__btn--add-recipe');

  constructor() {
    super();
    this._addEventListenerToToggleButtons();
  }

  _toggleModalWindow() {
    [this._overlayElement, this._modalElement].forEach(({ classList }) =>
      classList.toggle('hidden')
    );
  }

  _addEventListenerToToggleButtons() {
    [
      this._overlayElement,
      this._closeModalButton,
      this._openModalButton,
    ].forEach((element) => {
      element.addEventListener('click', this._toggleModalWindow.bind(this));
    });
  }
};

export default new AddRecipeView();

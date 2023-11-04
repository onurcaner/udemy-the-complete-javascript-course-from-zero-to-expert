import {
  SEARCH_FORM_ELEMENT_QUERY,
  SEARCH_INPUT_ELEMENT_QUERY,
} from '../config';

const SearchFormView = class {
  #containerElement = document.querySelector(SEARCH_FORM_ELEMENT_QUERY);
  #inputElement = document.querySelector(SEARCH_INPUT_ELEMENT_QUERY);

  #clearInputValue() {
    this.#inputElement.value = '';
  }

  #getInputValue() {
    return this.#inputElement.value;
  }

  getQuery() {
    const query = this.#getInputValue();
    this.#clearInputValue();
    return query;
  }

  addHandlerToOnSubmit(handlerFunction) {
    this.#containerElement.addEventListener('submit', handlerFunction);
  }
};

export default new SearchFormView();

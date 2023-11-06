const SearchFormView = class {
  _containerElement = document.querySelector('.search');
  _inputElement = document.querySelector('.search__field');

  _clearInputValue() {
    this._inputElement.value = '';
    return this;
  }

  _getInputValue() {
    return this._inputElement.value;
  }

  getQuery() {
    const query = this._getInputValue();
    this._clearInputValue();
    return query;
  }

  /* Events - Publisher, Subscriber pattern */
  addHandlerToOnSubmit(handler) {
    this._containerElement.addEventListener('submit', handler);
  }
};

export default new SearchFormView();

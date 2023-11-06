const FormView = class {
  _formElement = document.querySelector('.form');

  _clearValue(inputElement) {
    inputElement.value = '';
  }

  _clearValues() {
    const inputElements = Array.from(
      this._formElement.querySelectorAll('input')
    );
    inputElements.forEach(this._clearValue);
    return this;
  }

  _readValues() {
    const formData = Array.from(new FormData(this._formElement).entries());
    const data = Object.fromEntries(formData);
    return data;
  }

  getValues() {
    const data = this._readValues();
    this._clearValues();
    return data;
  }

  /* Events - Publisher, Subscriber pattern */
  addHandlerToOnSubmit(handler) {
    this._formElement.addEventListener('submit', handler);
  }
};

export default FormView;

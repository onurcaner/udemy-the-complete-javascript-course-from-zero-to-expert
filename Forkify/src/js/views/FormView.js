const FormView = class {
  _formElement = document.querySelector('.form');

  _clearValue(inputElement) {
    inputElement.value = '';
  }

  clearValues() {
    const inputElements = Array.from(
      this._formElement.querySelectorAll('input')
    );
    inputElements.forEach(this._clearValue);
    return this;
  }

  readValues() {
    const formData = Array.from(new FormData(this._formElement).entries());
    formData.forEach((entry) => {
      entry[1] = entry[1].trim();
    });
    const data = Object.fromEntries(formData);
    return data;
  }

  getValues() {
    const data = this.readValues();
    this.clearValues();
    return data;
  }

  /* Events - Publisher, Subscriber pattern */
  addHandlerToOnSubmit(handler) {
    this._formElement.addEventListener('submit', handler);
  }
};

export default FormView;

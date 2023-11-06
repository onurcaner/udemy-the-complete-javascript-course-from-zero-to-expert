import icons from 'url:../../img/icons.svg';

const View = class {
  _icons = icons;
  _containerElement = document.querySelector('.temp');
  _defaultErrorMessage = 'Something went wrong';
  _defaultMessage = 'Hello, world';

  /* DOM manipulation methods */
  _manipulateDOMInnerHTML(html) {
    this._containerElement.innerHTML = html;
    return this;
  }

  _manipulateDOMInsertElement(element) {
    this._containerElement.insertAdjacentElement('afterbegin', element);
    return this;
  }

  /* Create Element from HTML that wrapped from single HTML tag */
  _createElementFromHTML(html) {
    const divElement = document.createElement('div');
    divElement.innerHTML = html;
    return divElement.firstElementChild;
  }

  /* Create HTML strings */
  _createSpinnerHTML() {
    const html = `
      <div class="spinner">
        <svg>
          <use href="${this._icons}#icon-loader"></use>
        </svg>
      </div>
    `;
    return html;
  }

  _createErrorHTML(message) {
    const html = `
      <div class="error">
        <div>
          <svg>
            <use href="${this._icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>ERROR:
        <br />${message}</p>
      </div>
    `;
    return html;
  }

  _createMessageHTML(message) {
    const html = `
      <div class="message">
        <div>
          <svg>
            <use href="${this._icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    return html;
  }

  /* Render */
  renderSpinner() {
    const html = this._createSpinnerHTML();
    return this._manipulateDOMInnerHTML(html);
  }

  renderError(message = this._defaultErrorMessage) {
    const html = this._createErrorHTML(message);
    return this._manipulateDOMInnerHTML(html);
  }

  renderMessage(message = this._defaultMessage) {
    const html = this._createMessageHTML(message);
    return this._manipulateDOMInnerHTML(html);
  }

  renderClear() {
    return this._manipulateDOMInnerHTML('');
  }

  /* Events - Publisher, Subscriber pattern */
  addHandlerToOnHashChange(handler) {
    ['hashchange', 'load'].forEach((eventType) =>
      window.addEventListener(eventType, handler)
    );
  }
};

export default View;

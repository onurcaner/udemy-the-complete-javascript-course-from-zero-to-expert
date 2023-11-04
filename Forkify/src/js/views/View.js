import icons from 'url:../../img/icons.svg';

const View = class {
  _icons = icons;
  _containerElement = document.querySelector('.temp');
  _defaultErrorMessage = 'Something went wrong';
  _defaultMessage = 'Hello, world';

  _manipulateDOM(html) {
    this._containerElement.innerHTML = html;
    return this;
  }

  renderSpinner() {
    const html = `
      <div class="spinner">
        <svg>
          <use href="${this._icons}#icon-loader"></use>
        </svg>
      </div>
    `;

    return this._manipulateDOM(html);
  }

  renderError(message = this._defaultErrorMessage) {
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

    return this._manipulateDOM(html);
  }

  renderMessage(message = this._defaultMessage) {
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

    return this._manipulateDOM(html);
  }
};

export default View;

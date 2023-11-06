import View from './View';

const PaginationView = class extends View {
  _page = 0;
  _pages = 0;
  _containerElement = document.querySelector('.pagination');
  _constructHandlerForPagination = (targetPage) => {};

  /* Create Elements */
  _createPageButtonElement(html, targetPage) {
    const buttonElement = this._createElementFromHTML(html);
    this._addEventListenerToButtonElement(buttonElement, targetPage);
    return buttonElement;
  }

  _createPreviousPageButtonElement() {
    const targetPage = this._page - 1;
    const html = `
      <button class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${this._icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${targetPage}</span>
      </button>
    `;

    return this._createPageButtonElement(html, targetPage);
  }

  _createNextPageButtonElement() {
    const targetPage = this._page + 1;
    const html = `
      <button class="btn--inline pagination__btn--next">
        <svg class="search__icon">
          <use href="${this._icons}#icon-arrow-right"></use>
        </svg>
        <span>Page ${targetPage}</span>
      </button>
    `;

    return this._createPageButtonElement(html, targetPage);
  }

  /* Render */
  _renderPageButtons() {
    this.renderClear();

    /* Single page result */
    if (this._page === 1 && this._pages === 1) {
      /* Render none */
    }

    /* At first page and there exists next page */
    if (this._page === 1 && this._pages > 1) {
      const nextPageButton = this._createNextPageButtonElement();
      this._manipulateDOMInsertElement(nextPageButton);
    }

    /* At some page >1 and there exists a next page */
    if (this._page > 1 && this._pages > this._page) {
      const previousPageButton = this._createPreviousPageButtonElement();
      const nextPageButton = this._createNextPageButtonElement();
      this._manipulateDOMInsertElement(
        previousPageButton
      )._manipulateDOMInsertElement(nextPageButton);
    }

    /* At some page >1 and there exists NO next page */
    if (this._page > 1 && this._pages === this._page) {
      const previousPageButton = this._createPreviousPageButtonElement();
      this._manipulateDOMInsertElement(previousPageButton);
    }

    return this;
  }

  render(page, pages) {
    this._page = page;
    this._pages = pages;
    this._renderPageButtons();
    return this;
  }

  renderError() {
    this._page = 0;
    this._pages = 0;
    return this.renderClear();
  }

  /* Events - Linking handlers */
  _addEventListenerToButtonElement(buttonElement, targetPage) {
    buttonElement.addEventListener(
      'click',
      this._constructHandlerForPagination(targetPage)
    );
    return this;
  }

  /* Events - Publisher, Subscriber pattern */
  addHandlerConstructor(handlerConstructor) {
    this._constructHandlerForPagination = handlerConstructor;
  }
};

export default new PaginationView();

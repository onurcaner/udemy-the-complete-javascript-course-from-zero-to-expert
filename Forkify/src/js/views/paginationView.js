import View from './View';
import { PAGINATION_CONTAINER_ELEMENT_QUERY } from '../config';

const PaginationView = class extends View {
  _page = 0;
  _pages = 0;
  _containerElement = document.querySelector(
    PAGINATION_CONTAINER_ELEMENT_QUERY
  );
  _constructHandlerForPagination = (targetPage) => {};

  _clearPageButtons() {
    this._containerElement.innerHTML = '';
    return this;
  }

  _renderPageButton(html, targetPage) {
    const buttonElement = this._createElementFromHTML(html);
    buttonElement.addEventListener(
      'click',
      this._constructHandlerForPagination(targetPage)
    );
    this._manipulateDOMInsertElement(buttonElement);
    return this;
  }

  _renderPreviousPageButton() {
    const targetPage = this._page - 1;
    const html = `
      <button class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${this._icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${targetPage}</span>
      </button>
    `;

    return this._renderPageButton(html, targetPage);
  }

  _renderNextPageButton() {
    const targetPage = this._page + 1;
    const html = `
      <button class="btn--inline pagination__btn--next">
        <svg class="search__icon">
          <use href="${this._icons}#icon-arrow-right"></use>
        </svg>
        <span>Page ${targetPage}</span>
      </button>
    `;

    return this._renderPageButton(html, targetPage);
  }

  _renderPageButtons() {
    this._clearPageButtons();
    /* Single page result */
    if (this._page === 1 && this._pages === 1) {
      /* Render none */
    }
    /* At first page and there exists next page */
    if (this._page === 1 && this._pages > 1) {
      this._renderNextPageButton();
    }
    /* At some page >1 and there exists a next page */
    if (this._page > 1 && this._pages > this._page) {
      this._renderPreviousPageButton()._renderNextPageButton();
    }
    /* At some page >1 and there exists NO next page */
    if (this._page > 1 && this._pages === this._page) {
      this._renderPreviousPageButton();
    }
    return this;
  }

  render(page, pages) {
    this._page = page;
    this._pages = pages;
    this._renderPageButtons();
  }

  renderError() {
    this._page = 0;
    this._pages = 0;
    this._clearPageButtons();
    return this;
  }

  addHandlerConstructor(handlerConstructor) {
    this._constructHandlerForPagination = handlerConstructor;
  }
};

export default new PaginationView();

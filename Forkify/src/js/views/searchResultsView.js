import View from './View';
import { SEARCH_RESULTS_CONTAINER_ELEMENT_QUERY } from '../config';
import { getHash } from '../helpers';

const SearchResultView = class extends View {
  _containerElement = document.querySelector(
    SEARCH_RESULTS_CONTAINER_ELEMENT_QUERY
  );
  errorMessage = {
    emptyInput: 'Search field is empty',
    noResults: 'Could not find any recipe with the searched keyword:',
  };

  _createRecipeHTML(recipe) {
    const { bookmarked, id, imageURL, publisher, title, userGenerated } =
      recipe;
    const hash = getHash();
    // prettier-ignore
    return `
      <li class="preview">
        <a class="preview__link ${id === hash && 'preview__link--active'}" href="#${id}">
          <figure class="preview__fig">
            <img src="${imageURL}" alt="${title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${title}</h4>
            <p class="preview__publisher">${publisher}</p>
            ${
              userGenerated ?
              `<div class="preview__user-generated">
                <svg>
                  <use href="${this._icons}#icon-user"></use>
                </svg>
              </div>`
              : ''
            }
          </div>
        </a>
      </li>
    `;
  }

  render(recipes) {
    const html = `
      ${recipes.map(this._createRecipeHTML.bind(this)).join('')}
    `;

    this._manipulateDOMInnerHTML(html);
  }
};

export default new SearchResultView();

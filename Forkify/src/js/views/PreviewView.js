import View from './View';
import { getHash } from '../helpers';

const PreviewView = class extends View {
  _containerElement = document.querySelector('.temp');

  /* Create HTML strings */
  _createPreviewHTML(recipe) {
    const { id, imageURL, publisher, title, userGenerated } = recipe;
    const hash = getHash();
    // prettier-ignore
    const html = `
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
    return html;
  }

  _createPreviewsHTML(recipes) {
    const html = `
      ${recipes.map(this._createPreviewHTML.bind(this)).join('')}
    `;
    return html;
  }

  /* Render */
  render(recipes) {
    const html = this._createPreviewsHTML(recipes);
    return this._manipulateDOMInnerHTML(html);
  }
};

export default PreviewView;

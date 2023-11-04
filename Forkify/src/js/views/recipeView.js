import View from './View';
import { Fraction } from 'fractional';
import { RECIPE_CONTAINER_ELEMENT_QUERY } from '../config';

const RecipeView = class extends View {
  _containerElement = document.querySelector(RECIPE_CONTAINER_ELEMENT_QUERY);
  _recipeData;

  _createIngredientHTML(ingredient) {
    const { description, quantity, unit } = ingredient;
    return `
      <li class="recipe__ingredient">
        <svg class="recipe__icon">
          <use href="${this._icons}#icon-check"></use>
        </svg>
        <div class="recipe__quantity">${
          quantity ? new Fraction(quantity).toString() : ''
        }</div>
        <div class="recipe__description">
          <span class="recipe__unit">${unit}</span>${description}
        </div>
      </li>
    `;
  }

  render(recipe = this._recipeData) {
    this._recipeData = recipe;
    const {
      id,
      ingredients,
      publisher,
      servings,
      title,
      cookingTime,
      imageURL,
      sourceURL,
    } = this._recipeData;

    const html = `
      <figure class="recipe__fig">
        <img src="${imageURL}" alt="${title}" class="recipe__img" />
        <h1 class="recipe__title">
          <span>${title}</span>
        </h1>
      </figure>
  
      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${this._icons}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${cookingTime}</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${this._icons}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${servings}</span>
          <span class="recipe__info-text">servings</span>
  
          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--increase-servings">
              <svg>
                <use href="${this._icons}#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--increase-servings">
              <svg>
                <use href="${this._icons}#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>
  
        <div class="recipe__user-generated">
          <svg>
            <use href="${this._icons}#icon-user"></use>
          </svg>
        </div>
        <button class="btn--round">
          <svg class="">
            <use href="${this._icons}#icon-bookmark-fill"></use>
          </svg>
        </button>
      </div>
  
      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
          ${ingredients.map(this._createIngredientHTML.bind(this)).join('')}
        </ul>
      </div>
  
      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${publisher}</span>. Please check out
          directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href="${sourceURL}"
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="${this._icons}#icon-arrow-right"></use>
          </svg>
        </a>
      </div>
    `;

    return this._manipulateDOM(html);
  }

  addHandlerToOnHashchange(handlerFunction) {
    ['hashchange', 'load'].forEach((eventType) =>
      window.addEventListener(eventType, handlerFunction)
    );
  }
};

export default new RecipeView();

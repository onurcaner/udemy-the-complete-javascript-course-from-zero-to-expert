import View from './View';
import { Fraction } from 'fractional';

const RecipeView = class extends View {
  _containerElement = document.querySelector('.recipe');
  _constructHandlerToChangeServings = (targetServings) => {};
  _onClickHandlerForBookmark = (shouldAdd) => {};
  _servings = 4;
  _id = '';

  /* Create HTML strings */
  _createIngredientHTML(ingredient) {
    const { description, quantity, unit } = ingredient;
    const html = `
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
    return html;
  }

  _createRecipeDetailsHTML(recipe) {
    const {
      bookmarked,
      ingredients,
      publisher,
      servings,
      title,
      cookingTime,
      imageURL,
      sourceURL,
      userGenerated,
    } = recipe;

    // prettier-ignore
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
            <button class="btn--tiny btn--decrease-servings">
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
          ${userGenerated
            ? `<svg>
                <use href="${this._icons}#icon-user"></use>
              </svg>`
            : ''
          }
        </div>

        <button class="btn--round btn--bookmark">
          <svg class="">
            <use href="${this._icons}${bookmarked ? '#icon-bookmark-fill' : '#icon-bookmark'}"></use>
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
    return html;
  }

  /* Render */
  render(recipe) {
    const { id, servings } = recipe;

    this._id = id;
    this._servings = servings;
    const html = this._createRecipeDetailsHTML(recipe);

    this._manipulateDOMInnerHTML(html)
      ._addEventListenerToServingButtons()
      ._addEventListenerToBookmarkButton();
    return this;
  }

  /* Events - Linking handlers */
  _addEventListenerToServingButtons() {
    const decreaseButton = document.querySelector('.btn--decrease-servings');
    const increaseButton = document.querySelector('.btn--increase-servings');
    decreaseButton.addEventListener(
      'click',
      this._constructHandlerToChangeServings(this._servings - 1)
    );
    increaseButton.addEventListener(
      'click',
      this._constructHandlerToChangeServings(this._servings + 1)
    );
    return this;
  }

  _addEventListenerToBookmarkButton() {
    const bookmarkButton = document.querySelector('.btn--bookmark');
    bookmarkButton.addEventListener('click', this._onClickHandlerForBookmark);
  }

  /* Events - Publisher, Subscriber pattern */
  addHandlerConstructorForRecipeServings(handlerConstructor) {
    this._constructHandlerToChangeServings = handlerConstructor;
  }

  addHandlerForBookmark(handler) {
    this._onClickHandlerForBookmark = handler;
  }
};

export default new RecipeView();

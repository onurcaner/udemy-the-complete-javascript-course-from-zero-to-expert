import icons from 'url:../img/icons.svg';

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const getRecipe = async function (recipeID) {
  /* Return the new recipe object with camelCase notation */
  const reStructureRecipe = (recipeFromDB) => {
    const {
      id,
      ingredients,
      publisher,
      servings,
      title,
      cooking_time: cookingTime,
      image_url: imageURL,
      source_url: sourceURL,
    } = recipeFromDB;

    return {
      id,
      ingredients,
      publisher,
      servings,
      title,
      cookingTime,
      imageURL,
      sourceURL,
    };
  };

  try {
    /* GET recipe from ID */
    const URL = `https://forkify-api.herokuapp.com/api/v2/recipes/${recipeID}`;
    const response = await fetch(URL);
    const data = await response.json();
    if (!response.ok || !data.status === 'success')
      throw new Error(`ERROR(${response.status}) - ${data?.message}`);

    return reStructureRecipe(data.data.recipe);
  } catch (err) {
    console.error('##ERROR##:', err);
    throw err;
  }
};

const renderRecipe = function ({ recipe, recipeContainerElement, icons }) {
  const {
    id,
    ingredients,
    publisher,
    servings,
    title,
    cookingTime,
    imageURL,
    sourceURL,
  } = recipe;

  /* Create templateHTML string */
  recipeContainerElement.innerHTML = `
    <figure class="recipe__fig">
      <img src="${imageURL}" alt="${title}" class="recipe__img" />
      <h1 class="recipe__title">
        <span>${title}</span>
      </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${cookingTime}</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${servings}</span>
        <span class="recipe__info-text">servings</span>

        <div class="recipe__info-buttons">
          <button class="btn--tiny btn--increase-servings">
            <svg>
              <use href="${icons}#icon-minus-circle"></use>
            </svg>
          </button>
          <button class="btn--tiny btn--increase-servings">
            <svg>
              <use href="${icons}#icon-plus-circle"></use>
            </svg>
          </button>
        </div>
      </div>

      <div class="recipe__user-generated">
        <svg>
          <use href="${icons}#icon-user"></use>
        </svg>
      </div>
      <button class="btn--round">
        <svg class="">
          <use href="${icons}#icon-bookmark-fill"></use>
        </svg>
      </button>
    </div>

    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">
        ${ingredients
          .map(
            ({ description, quantity, unit }) => `
          <li class="recipe__ingredient">
            <svg class="recipe__icon">
              <use href="${icons}#icon-check"></use>
            </svg>
            <div class="recipe__quantity">${quantity ?? ''}</div>
            <div class="recipe__description">
              <span class="recipe__unit">${unit}</span>
              ${description}
            </div>
          </li>
        `
          )
          .join('')}
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
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </a>
    </div>
  `;
};

const renderSpinner = function ({ recipeContainerElement, icons }) {
  recipeContainerElement.innerHTML = `
  <div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div>
  `;
};

const renderError = function ({ err, recipeContainerElement, icons }) {
  recipeContainerElement.innerHTML = `
  <div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${err}</p>
  </div>
  `;
};

/* (async function () {
  try {
    renderSpinner({ recipeContainerElement: recipeContainer, icons });
    const recipe = await getRecipe('5ed6604591c37cdc054bc886');
    console.log(recipe);
    renderRecipe({ recipe, recipeContainerElement: recipeContainer, icons });
  } catch (err) {
    renderError({ err, recipeContainerElement: recipeContainer, icons });
  }
})(); */

window.addEventListener('hashchange', (e) => {
  const hash = window.location.hash.slice(1);
  console.log(hash);
});

window.addEventListener('load', (e) => {
  const hash = window.location.hash.slice(1);
  console.log(hash);
});

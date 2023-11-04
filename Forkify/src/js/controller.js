import { getHash } from './helpers.js';
import model from './model.js';
import RecipeView from './views/recipeView.js';
import SearchFormView from './views/searchFormView.js';
import searchResultsView from './views/searchResultsView.js';
import paginationView from './views/paginationView.js';

const Controller = class {
  constructor() {
    RecipeView.addHandlerToOnHashchange(this.#onHashchangeHandler.bind(this));
    SearchFormView.addHandlerToOnSubmit(this.#onSubmitHandler.bind(this));
  }

  async #dispatchRecipeDetailsAction(recipeID) {
    try {
      /* Render spinner and get recipe */
      RecipeView.renderSpinner();
      const recipe = await model.getRecipeDetails(recipeID);
      /* Render recipe on success */
      RecipeView.render(recipe);
      return this;
    } catch (err) {
      /* Render error on error */
      RecipeView.renderError(err.message);
      console.error(err);
    }
  }

  async #dispatchSearchRecipesAction({ keyword, page }) {
    /* If keyword is empty string */
    if (keyword.length === 0) {
      searchResultsView.renderError(searchResultsView.errorMessage.emptyInput);
      return this;
    }
    try {
      /* Render spinner and get search results */
      searchResultsView.renderSpinner();
      const recipes = await model.getSearchResults({ keyword, page });
      /* Check search results on success */
      if (!recipes?.length)
        throw new Error(
          `${searchResultsView.errorMessage.noResults} ${keyword}`
        );
      /* Then render the results */
      searchResultsView.render(recipes);
      return this;
    } catch (err) {
      /* Render error on error */
      searchResultsView.renderError(err.message);
      console.error(err);
    }
  }

  #onHashchangeHandler(e) {
    e.preventDefault();
    const hash = getHash();
    if (!hash) return;

    this.#dispatchRecipeDetailsAction(hash);
  }

  #onSubmitHandler(e) {
    e.preventDefault();

    const keyword = SearchFormView.getQuery().trim();
    console.log(keyword);
    this.#dispatchSearchRecipesAction({ keyword, page: 1 });
  }
};

new Controller();

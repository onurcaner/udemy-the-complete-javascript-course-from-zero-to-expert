import { getHash } from './helpers.js';
import model from './model.js';
import recipeView from './views/recipeView.js';
import searchFormView from './views/searchFormView.js';
import searchResultsView from './views/searchResultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';

const Controller = class {
  #recipeID = '';
  #searchRecipes = { keyword: '', page: 0 };
  constructor() {
    recipeView.addHandlerToOnHashChange(
      this.#onHashChangeHandlerForRecipeView.bind(this)
    );
    recipeView.addHandlerConstructorForRecipeServings(
      this.#constructHandlerForRecipeServings.bind(this)
    );
    recipeView.addHandlerForBookmark(
      this.#onClickHandlerForBookmark.bind(this)
    );
    searchFormView.addHandlerToOnSubmit(this.#onSubmitHandler.bind(this));
    searchResultsView.addHandlerToOnHashChange(
      this.#onHashChangeHandlerForSearchResultsView.bind(this)
    );
    paginationView.addHandlerConstructor(
      this.#constructHandlerForPagination.bind(this)
    );
    bookmarksView.addHandlerToOnHashChange(
      this.#onHashChangeHandlerForBookmarksView.bind(this)
    );
  }

  /* Recipe Details */
  async #dispatchRecipeDetailsAction(recipeID, servings) {
    this.#recipeID = recipeID;
    try {
      /* Render spinner and get recipe */
      recipeView.renderSpinner();
      const recipe = await model.getRecipeDetails(recipeID, servings);
      /* Render recipe on success */
      recipeView.render(recipe);
      return this;
    } catch (err) {
      /* Render error on error */
      recipeView.renderError(err.message);
      console.error(err);
    }
  }

  #onHashChangeHandlerForRecipeView(e) {
    e.preventDefault();
    const hash = getHash();
    if (!hash) return;

    this.#dispatchRecipeDetailsAction(hash);
  }

  /* Recipe Details - Change Servings */
  #constructHandlerForRecipeServings(servings) {
    const recipeID = this.#recipeID;
    return (e) => {
      e.preventDefault();
      this.#dispatchRecipeDetailsAction(recipeID, servings);
    };
  }

  /* Recipe Details - Bookmarking */
  #onClickHandlerForBookmark(e) {
    e.preventDefault();
    const hash = getHash();
    if (!hash) return;

    model.toggleBookmark(hash);
    this.#dispatchRecipeDetailsAction(hash);
    this.#dispatchBookmarksAction();
  }

  /* Search Recipes */
  async #dispatchSearchRecipesAction(keyword, page = 1) {
    this.#searchRecipes.keyword = keyword;
    this.#searchRecipes.page = page;
    /* If keyword is empty string */
    if (keyword.length === 0) {
      searchResultsView.renderError(searchResultsView.errorMessage.emptyInput);
      return this;
    }
    try {
      /* Render spinner and get search results */
      searchResultsView.renderSpinner();
      const { results, pages } = await model.getSearchResults(keyword, page);
      /* Check search results on success */
      if (!pages)
        throw new Error(
          `${searchResultsView.errorMessage.noResults} ${keyword}`
        );
      /* Then render the results */
      searchResultsView.render(results);
      paginationView.render(page, pages);
      return this;
    } catch (err) {
      /* Render error on error */
      searchResultsView.renderError(err.message);
      paginationView.renderError();
      console.error(err);
      this.#searchRecipes.page = 0;
    }
  }

  #onSubmitHandler(e) {
    e.preventDefault();

    const keyword = searchFormView.getQuery().trim();
    this.#dispatchSearchRecipesAction(keyword);
  }

  #onHashChangeHandlerForSearchResultsView(e) {
    e.preventDefault();
    const { keyword, page } = this.#searchRecipes;
    if (!page) return;

    this.#dispatchSearchRecipesAction(keyword, page);
  }

  /* Search Recipes - Pagination */
  #constructHandlerForPagination(page) {
    const keyword = this.#searchRecipes.keyword;
    return (e) => {
      e.preventDefault();
      this.#dispatchSearchRecipesAction(keyword, page);
    };
  }

  /* Bookmarks */
  #dispatchBookmarksAction() {
    try {
      /* Fetch bookmarks from local storage */
      const bookmarkedRecipes = model.getBookmarkedRecipes();
      if (!bookmarkedRecipes || bookmarkedRecipes.length === 0)
        throw new Error(bookmarksView.message.noBookmarks);

      /* Render */
      bookmarksView.render(bookmarkedRecipes);
    } catch (err) {
      bookmarksView.renderMessage(err.message);
    }
  }

  #onHashChangeHandlerForBookmarksView(e) {
    e.preventDefault();
    this.#dispatchBookmarksAction();
  }
};

new Controller();

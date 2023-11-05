import {
  FORKIFY_RECIPE_URL,
  RECIPE_CACHE_LIMIT,
  PER_PAGE_SEARCH_RESULTS,
} from './config.js';
import { getForkifyJSON } from './helpers.js';

const State = class {
  #state = {
    recipes: [],
    search: { keyword: '', results: [], pages: 0 },
    bookmarks: [],
  };

  /* Helpers for mathing properties */
  #isID(recipeID) {
    return ({ id }) => id === recipeID;
  }

  /* Get */
  async getRecipeDetails(recipeID, servings) {
    /* return recipe if it is inside the cached recipes */
    const recipe = this.#state.recipes.find(this.#isID(recipeID));
    if (recipe) return this.#cloneRecipe(recipe, servings);

    try {
      /* Fetch the recipe by ID */
      const recipe = await this.#fetchRecipeDetails(recipeID);
      /* Push to recipes on success */
      if (this.#state.recipes.length === RECIPE_CACHE_LIMIT)
        this.#state.recipes.shift();
      this.#state.recipes.push(recipe);

      return this.#cloneRecipe(recipe, servings);
    } catch (err) {
      throw err;
    }
  }

  async getSearchResults(keyword, page = 1) {
    /* return cached search results if keyword matches */
    if (keyword === this.#state.search.keyword) return this.#cloneSearch(page);

    try {
      /* Modify state on success */
      this.#state.search.results = await this.#fetchSearchResults(keyword);
      this.#state.search.keyword = keyword;
      this.#state.search.pages = Math.ceil(
        this.#state.search.results.length / PER_PAGE_SEARCH_RESULTS
      );

      return this.#cloneSearch(page);
    } catch (err) {
      /* Modify state on error */
      this.#state.search.results = [];
      this.#state.search.keyword = keyword;
      this.#state.search.pages = 0;
      throw err;
    }
  }

  /* Helpers for cloning states */
  #cloneSearch(page) {
    /* Clone search results */
    const start = (page - 1) * PER_PAGE_SEARCH_RESULTS;
    const end = page * PER_PAGE_SEARCH_RESULTS;
    const clonedSearch = { ...this.#state.search };
    clonedSearch.results.map((result) => ({ ...result }));

    /* Modify cloned search results */
    clonedSearch.results.forEach(this.#addCustomProperties.bind(this));
    clonedSearch.results = clonedSearch.results.slice(start, end);
    return clonedSearch;
  }

  #cloneRecipe(recipe, servings) {
    /* Start cloning */
    const clonedRecipe = { ...recipe };
    clonedRecipe.ingredients = clonedRecipe.ingredients.map((ingredient) => ({
      ...ingredient,
    }));

    /* Modify cloned recipe */
    this.#addCustomProperties(clonedRecipe);

    if (!servings) return clonedRecipe;
    const multiplier = servings / clonedRecipe.servings;
    clonedRecipe.servings = servings;
    clonedRecipe.ingredients = clonedRecipe.ingredients.map((ingredient) => ({
      ...ingredient,
      quantity: ingredient.quantity * multiplier,
    }));

    return clonedRecipe;
  }

  /* Helpers for converting incoming properties to camelcase */
  #reStructureRecipe(recipeFromDB) {
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
  }

  #reStructureSearchResult(searchResultFromDB) {
    const { id, publisher, title, image_url: imageURL } = searchResultFromDB;
    return { id, publisher, title, imageURL };
  }

  /* Fetch */
  async #fetchRecipeDetails(id) {
    console.log('Accessing DB to fetch recipe details by id:', id);
    try {
      /* GET recipe from ID */
      const URL = `${FORKIFY_RECIPE_URL}/${id}`;
      const data = await getForkifyJSON(URL);

      return this.#reStructureRecipe(data.data.recipe);
    } catch (err) {
      throw err;
    }
  }

  async #fetchSearchResults(keyword) {
    console.log('Accessing DB to fetch search result by keyword:', keyword);
    try {
      /* Get recipes from keyword */
      const URL = `${FORKIFY_RECIPE_URL}?search=${keyword}`;
      const data = await getForkifyJSON(URL);

      return data.data.recipes.map(this.#reStructureSearchResult);
    } catch (err) {
      throw err;
    }
  }

  /* Bookmarks */
  toggleBookmark(recipeID) {
    if (this.#isBookmarked(recipeID)) this.#removeFromBookmarks(recipeID);
    else this.#addToBookmarks(recipeID);
    return this;
  }

  #addToBookmarks(recipeID) {
    const recipe = this.#state.recipes.find(this.#isID(recipeID));
    if (!recipe) return;

    this.#state.bookmarks.push(recipe);
    return this;
  }

  #removeFromBookmarks(recipeID) {
    const index = this.#state.bookmarks.findIndex(this.#isID(recipeID));
    if (index === -1) return;

    this.#state.bookmarks.splice(index, 1);
    return this;
  }

  #isBookmarked(recipeID) {
    return this.#state.bookmarks.some(this.#isID(recipeID));
  }

  #addCustomProperties(objectWithID) {
    if (this.#isBookmarked(objectWithID.id)) objectWithID.bookmarked = true;
    return this;
  }
};

export default new State();

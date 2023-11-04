import {
  FORKIFY_RECIPE_URL,
  RECIPE_CACHE_LIMIT,
  PER_PAGE_SEARCH_RESULTS,
} from './config.js';
import { getForkifyJSON } from './helpers.js';

const State = class {
  #state = {
    recipes: [{}],
    search: { keyword: '', results: [{}], pages: 0, page: 0 },
    bookmarks: [],
  };

  /* Get */
  async getRecipeDetails(recipeId) {
    /* return recipe if it is inside the cached recipes */
    const recipe = this.#state.recipes.find(({ id }) => id === recipeId);
    if (recipe) return { ...recipe };

    try {
      /* Fetch the recipe by ID */
      const recipe = await this.#fetchRecipeDetails(recipeId);
      /* Push to recipes on success */
      if (this.#state.recipes.length === RECIPE_CACHE_LIMIT)
        this.#state.recipes.shift();
      this.#state.recipes.push(recipe);

      return { ...recipe };
    } catch (err) {
      throw err;
    }
  }

  async getSearchResults({ keyword, page = 0 }) {
    /* return cached search results if keyword matches */
    if (keyword === this.#state.search.keyword)
      return this.#cloneSearchResults(page);

    try {
      /* Modify state on success */
      this.#state.search.results = await this.#fetchSearchResults(keyword);
      this.#state.search.keyword = keyword;
      this.#state.search.pages = Math.ceil(
        this.#state.search.results.length / PER_PAGE_SEARCH_RESULTS
      );

      return this.#cloneSearchResults(page);
    } catch (err) {
      /* Modify state on error */
      this.#state.search.results = [];
      this.#state.search.keyword = keyword;
      this.#state.search.pages = 0;
      throw err;
    }
  }

  #cloneSearchResults(page) {
    this.#state.search.results.page = page;
    const clonedSearchResults = this.#state.search.results.map((result) => ({
      ...result,
    }));
    /* If no page number is asked return all objects */
    if (!this.#state.search.results.page) return clonedSearchResults;

    const start = (page - 1) * PER_PAGE_SEARCH_RESULTS;
    const end = page * PER_PAGE_SEARCH_RESULTS;
    return clonedSearchResults.slice(start, end);
  }

  /* Helpers. Convert properties to camelcase */
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
    try {
      /* Get recipes from keyword */
      const URL = `${FORKIFY_RECIPE_URL}?search=${keyword}`;
      const data = await getForkifyJSON(URL);

      return data.data.recipes.map(this.#reStructureSearchResult);
    } catch (err) {
      throw err;
    }
  }
};

export default new State();

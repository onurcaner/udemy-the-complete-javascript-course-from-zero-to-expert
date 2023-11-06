import {
  FORKIFY_RECIPE_URL,
  RECIPE_CACHE_LIMIT,
  PER_PAGE_SEARCH_RESULTS,
  LOCAL_STORAGE_KEY_FOR_BOOKMARKED_RECIPES,
  FORKIFY_API_KEY,
} from './config.js';
import { fetchForkifyJSON } from './helpers.js';

const State = class {
  #state = {
    recipes: [],
    search: { keyword: '', results: [], pages: 0 },
    bookmarks: [],
  };

  constructor() {
    this.#state.bookmarks = this.#fetchBookmarkedRecipes();
  }

  /* Helpers for matching properties */
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

  getBookmarkedRecipes() {
    const clonedBookmarks = this.#cloneBookmarkedRecipes();
    clonedBookmarks.forEach(this.#addCustomProperties.bind(this));
    return clonedBookmarks;
  }

  /* Post */
  async postRecipe(formData) {
    try {
      /* Convert formData into recipe that comes from database */
      const recipeToDB = this.#reStructureFormData(formData);
      /* Post recipe */
      const recipe = await this.#postRecipeToDB(recipeToDB);
      /* Push the returned recipe to state */
      if (this.#state.recipes.length === RECIPE_CACHE_LIMIT)
        this.#state.recipes.shift();
      this.#state.recipes.push(recipe);
      this.#addToBookmarks(recipe.id);
      return this.#cloneRecipe(recipe, recipe.servings);
    } catch (err) {
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

  #cloneBookmarkedRecipes() {
    return JSON.parse(JSON.stringify(this.#state.bookmarks));
  }

  /* Helpers for adding bookmarked and userGenerated fields */
  #addCustomProperties(recipe) {
    if (this.#isBookmarked(recipe.id)) recipe.bookmarked = true;
    if (this.#isUserGenerated(recipe)) recipe.userGenerated = true;
    return this;
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
      ...(recipeFromDB.key && { key: recipeFromDB.key }),
    };
  }

  #reStructureSearchResult(searchResultFromDB) {
    const { id, publisher, title, image_url: imageURL } = searchResultFromDB;
    return {
      id,
      publisher,
      title,
      imageURL,
      ...(searchResultFromDB.key && { key: searchResultFromDB.key }),
    };
  }

  /* Helpers for converting form data into recipe object for database */
  #isIngredientEntry([key, value]) {
    return key.includes('ingredient') && value.length > 0;
  }

  #createIngredientObject([, ingredientData]) {
    try {
      const ingredientArray = ingredientData.split(',');
      if (ingredientArray.length !== 3)
        throw new Error('Ingredient is not formatted properly');

      const quantity = +ingredientArray[0].replaceAll(' ', '') || null;
      const unit = ingredientArray[1].trim();
      const description = ingredientArray[2].trim();
      return { quantity, unit, description };
    } catch (err) {
      throw err;
    }
  }

  #createIngredientsArray(formData) {
    try {
      const entries = Object.entries(formData).filter(this.#isIngredientEntry);
      if (entries.length < 1) throw new Error('No ingredients detected');

      const ingredients = entries.map(this.#createIngredientObject);
      return ingredients;
    } catch (err) {
      throw err;
    }
  }

  #reStructureFormData(formData) {
    try {
      const { cookingTime, publisher, servings, title, image, sourceUrl } =
        formData;
      const ingredients = this.#createIngredientsArray(formData);

      const recipeToDB = {
        publisher,
        title,
        ingredients,
        cooking_time: +cookingTime,
        servings: +servings,
        image_url: image,
        source_url: sourceUrl,
      };

      Object.entries(recipeToDB).forEach(([key, value]) => {
        if (!value) throw new Error(`Required form field is empty`);
      });
      return recipeToDB;
    } catch (err) {
      throw err;
    }
  }

  /* Fetch - Database */
  async #fetchRecipeDetails(id) {
    console.log('Accessing DB to fetch recipe details by id:', id);
    try {
      /* GET recipe from ID */
      const url = `${FORKIFY_RECIPE_URL}/${id}?key=${FORKIFY_API_KEY}`;
      const data = await fetchForkifyJSON(url);
      return this.#reStructureRecipe(data.data.recipe);
    } catch (err) {
      throw err;
    }
  }

  async #fetchSearchResults(keyword) {
    console.log('Accessing DB to fetch search result by keyword:', keyword);
    try {
      /* Get recipes from keyword */
      const url = `${FORKIFY_RECIPE_URL}?search=${keyword}&key=${FORKIFY_API_KEY}`;
      const data = await fetchForkifyJSON(url);

      return data.data.recipes.map(this.#reStructureSearchResult);
    } catch (err) {
      throw err;
    }
  }

  async #postRecipeToDB(recipe) {
    console.log('Accessing DB to post recipe:', recipe.title);
    try {
      const url = `${FORKIFY_RECIPE_URL}?key=${FORKIFY_API_KEY}`;
      const data = await fetchForkifyJSON(url, recipe);
      return this.#reStructureRecipe(data.data.recipe);
    } catch (err) {
      throw err;
    }
  }

  /* Local storage */
  #fetchBookmarkedRecipes() {
    console.log('Accessing localStorage to load bookmarked recipes');
    const bookmarks = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEY_FOR_BOOKMARKED_RECIPES)
    );
    if (!bookmarks || !Array.isArray(bookmarks)) return [];
    else return bookmarks;
  }

  #storeBookmarkedRecipes() {
    console.log('Accessing localStorage to store bookmarked recipes');
    localStorage.setItem(
      LOCAL_STORAGE_KEY_FOR_BOOKMARKED_RECIPES,
      JSON.stringify(this.#state.bookmarks)
    );
    return this;
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
    return this.#storeBookmarkedRecipes();
  }

  #removeFromBookmarks(recipeID) {
    const index = this.#state.bookmarks.findIndex(this.#isID(recipeID));
    if (index === -1) return;

    this.#state.bookmarks.splice(index, 1);
    return this.#storeBookmarkedRecipes();
  }

  #isBookmarked(recipeID) {
    return this.#state.bookmarks.some(this.#isID(recipeID));
  }

  /* User generated */
  #isUserGenerated(recipe) {
    const recipeKey = recipe?.key;
    return recipeKey === FORKIFY_API_KEY;
  }
};

export default new State();

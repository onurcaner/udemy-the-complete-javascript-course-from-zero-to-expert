import { FORKIFY_RECIPE_URL } from './config.js';
import { getForkifyJSON } from './helpers.js';

const State = class {
  #state = {
    recipe: {},
    search: {},
    bookmarks: [],
  };

  getRecipe() {
    return { ...this.#state.recipe };
  }

  /* fetch recipe */
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

  async fetchRecipe(recipeID) {
    try {
      /* GET recipe from ID */
      const URL = `${FORKIFY_RECIPE_URL}/${recipeID}`;
      const data = await getForkifyJSON(URL);
      this.#state.recipe = this.#reStructureRecipe(data.data.recipe);
      return this.getRecipe();
    } catch (err) {
      throw err;
    }
  }
};

export default new State();

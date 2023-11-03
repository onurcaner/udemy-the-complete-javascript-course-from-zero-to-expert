import model from './model.js';
import viewRecipe from './views/viewRecipe.js';
import { getHash } from './helpers.js';

const Controller = class {
  constructor() {
    viewRecipe.addHandlerToHash(this.#hashHandler.bind(this));
  }

  async #dispatchViewRecipeAction(recipeID) {
    try {
      /* const recipe = await model.fetchRecipe('5ed6604591c37cdc054bc886'); */
      viewRecipe.renderSpinner();
      const recipe = await model.fetchRecipe(recipeID);
      viewRecipe.render(recipe);
      return this;
    } catch (err) {
      console.error(err);
      viewRecipe.renderError(err.message);
    }
  }

  #hashHandler(e) {
    e.preventDefault();
    const hash = getHash();
    if (!hash) return;

    this.#dispatchViewRecipeAction(hash);
  }
};

new Controller();

import model from './model.js';
import viewRecipe from './views/viewRecipe.js';
import { getHash } from './helpers.js';

const Controller = class {
  constructor() {
    ['hashchange', 'load'].forEach((eventType) =>
      window.addEventListener(eventType, this.#handleHash.bind(this))
    );
  }

  async #dispatchRecipeAction(recipeID) {
    try {
      /* const recipe = await model.fetchRecipe('5ed6604591c37cdc054bc886'); */
      viewRecipe.renderSpinner();
      const recipe = await model.fetchRecipe(recipeID);
      viewRecipe.render(recipe);
      return this;
    } catch (err) {
      viewRecipe.renderError(err);
      console.error(err);
    }
  }

  #handleHash(e) {
    e.preventDefault();
    const hash = getHash();
    if (!hash) return;

    this.#dispatchRecipeAction(hash);
  }
};

new Controller();

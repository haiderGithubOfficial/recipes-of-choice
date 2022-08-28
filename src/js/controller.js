import 'core-js/stable'; // poolly fill everything else
import 'regenerator-runtime/runtime'; // for polyfill async await

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import { async } from 'regenerator-runtime';
import { windowCloseDelay } from './config.js';

if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

//renderSpinner

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    resultView.update(model.getSearchResultPage());
    bookmarkView.update(model.state.bookmarks);
    await model.loadRecipe(id);
    const { recipe } = model.state;
    recipeView.render(model.state.recipe);
    // rendering recipe
  } catch (err) {
    recipeView.renderError();
    console.log(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResults(query);
    // console.log(model.state.search.result);
    resultView.render(model.getSearchResultPage());
    paginationView.render(model.state.search);
  } catch (err) {}
};

const controlPagination = function (pageNo) {
  try {
    resultView.render(model.getSearchResultPage(pageNo));
    paginationView.render(model.state.search);
  } catch (err) {}
};

const controlServings = function (servings) {
  //update the recipe in the state
  try {
    if (servings < 1) return;
    model.updateRecipe(servings);
    recipeView.update(model.state.recipe);
    // rendering recipe
  } catch (err) {
    recipeView.renderError(console.error(err));
  }

  // redering the updated recipe
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBoookmark(model.state.recipe.id);
  }
  recipeView.update(model.state.recipe);
  bookmarkView.render(model.state.bookmarks);
  console.log(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    await model.uploadNewRecipe(newRecipe);
    recipeView.render(model.state.recipe);
    bookmarkView.render(model.state.bookmarks);
    addRecipeView.renderSpinner();

    setTimeout(function () {
      addRecipeView.renderMessage('Your Recipe is Sucessfully Uploaded! :)');
      setTimeout(function () {
        addRecipeView.toggleClass();
      }, 3000);
    }, windowCloseDelay * 1000);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const controlSavedBookmarks = function () {
  model.init();
  bookmarkView.render(model.state.bookmarks);
};

function init() {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  bookmarkView.addHandlerSavedBookmarks(controlSavedBookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}

init();

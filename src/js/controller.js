import recipeView from './view/recipeView.js';
import * as model from './model.js';
import searchView from './view/searchView.js';
import resultsView from './view/resultsView.js';
import paginationView from './view/paginationView.js';
import bookmarksView from './view/bookmarksView.js';
import addRecipeView from './view/addRecipeView.js';
import shoppingListView from './view/shoppingListView.js';
import { MODAL_TIME_OUT } from './config.js';
import weekMealsView from './view/weekMealsView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import addIngredientView from './view/addIngredientView.js';
import weekMealsPreviewView from './view/weekMealsPreviewView.js';

// hot module to prevent page from loading
// if (module.hot) {
//   module.hot.accept();
// }

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    // Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    // loading recipe
    await model.loadRecipe(id);
    // rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlAddToList = async function () {
  const test = model.state.recipe.ingredients.map(ing => {
    model.state.shoppingList.push(Object.values(ing));
  });

  const ingredient = model.state.shoppingList.map(ing => ing.join(' '));

  model.addShoppingListToStorage();

  shoppingListView.addToShopping(ingredient);
  // RENDER SUCCESS MESSAGE
  shoppingListView.renderSuccessMessage(
    shoppingListView._successMessage,
    document.querySelector('.recipe__add-shopping-list')
  );
  setTimeout(function () {
    location.reload();
  }, 1000 * MODAL_TIME_OUT);
};

const controlLoadStateList = function () {
  const ingredient = model.state.shoppingList.map(ing =>
    ing.join(' ').replaceAll(',', ' ')
  );
  shoppingListView.addToShopping(ingredient);
};

const controlRemoveFromList = function (li) {
  model.deleteFromList(li.textContent.slice(0, -2).replaceAll(',', ' '));
  shoppingListView._clear();
  shoppingListView.addToShopping(model.state.shoppingList);
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // getting the query from search input form
    const query = searchView.getQuery();
    if (!query) return;

    // load search results
    await model.loadSeaarchResults(`${query}`);

    // render search results
    resultsView.render(model.getSearchResultsPage(1));

    // render initial pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // render new search results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // render new pagination button
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update the servings(in state)
  model.updateServings(newServings);
  // update the receipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookMark = function () {
  // Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else model.deleteBookMark(model.state.recipe.id);

  // Update the recipe view
  recipeView.update(model.state.recipe);

  // Render bookmark
  bookmarksView.render(model.state.bookmarks);
};

const controlBookMarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // render spinner
    addRecipeView.renderSpinner();
    // upload new recipe
    await model.uploadRecipe(newRecipe);
    // render that recipe
    recipeView.render(model.state.recipe);
    // render success message
    addRecipeView.renderSuccessMessage();
    // render bookmarks
    bookmarksView.render(model.state.bookmarks);
    // change id in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // close the window
    setTimeout(function () {
      addRecipeView.toggleWindow();
      location.reload();
    }, 1000 * MODAL_TIME_OUT);
  } catch (err) {
    // addRecipeView.renderError(err.message);
    addRecipeView.renderError(err.message);
  }
};

const controlAddIngredient = function (counter) {};

const controlAddToMealPlan = async function (day) {
  let alreadyExist = false;
  let recDay = false;
  Object.values(model.state.weekMeals).forEach(d =>
    d.forEach(rec => {
      if (rec.recipe.id === model.state.recipe.id) alreadyExist = true;
      if (rec.day === day) recDay = true;
    })
  );
  if (alreadyExist || recDay) return;
  model.addWeekMeal(day, model.state.recipe);
  weekMealsView.render(model.state.weekMeals, true, day);
  model.saveWeekMeals();
};

const controlDeleteMeal = function (meals, id) {
  model.deleteFromWeekMeals(id, meals);
  weekMealsView.render(model.state.weekMeals, true);
};

const controlLoadStateMeals = function () {
  weekMealsView.render(model.state.weekMeals, true);
};

// code knows what to execute (subscriber)
function init() {
  bookmarksView.addHandlerBookmark(controlBookMarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookMark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  addIngredientView.addHandlerNewIng(controlAddIngredient);
  recipeView.addHandlerAddToList(controlAddToList);
  shoppingListView.addHandlerRemoveFromList(controlRemoveFromList);
  recipeView.addHandlerAddToMeals(controlAddToMealPlan);
  weekMealsView.addHandlerDeleteMeals(controlDeleteMeal);
  // recipeView.addHandlerCalcCalories(controlCalcCalories);
  controlLoadStateList();
  controlLoadStateMeals();
}
init();

import { async } from 'regenerator-runtime';
import { API_URL } from './config.js';

// import { getJSON } from './helpers.js';
import { RESULTS_PER_PAGE } from './config.js';
// import { sendJSON } from './helpers.js';
import { KEY } from './config.js';
import { AJAX } from './helpers.js';
import { sponacularAPI_KEY } from './config.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RESULTS_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
  shoppingList: [],
  weekMeals: {
    Sunday: [],
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
  },
};
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    state.recipe.calories = await sponacularAPI(state.recipe.title);
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSeaarchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const saveBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookMark = function (receipe) {
  // Add bookmark
  state.bookmarks.push(receipe);
  // Mark current receipe as bookmarked
  if (receipe.id === state.recipe.id) state.recipe.bookmarked = true;

  // localstorage
  saveBookmarks();
};

export const addShoppingListToStorage = function () {
  saveShoppingList();
};

export const deleteBookMark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(rec => rec.id === id);
  state.bookmarks.splice(index, 1);
  // Mark current receipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  // localstorage
  saveBookmarks();
};

export const deleteFromList = function (el) {
  const index = state.shoppingList
    .map(ing => ing.join(' ').replaceAll(',', ' '))
    .indexOf(el);
  state.shoppingList.splice(index, 1);
  // localstorage
  saveShoppingList();
};

export const init = function () {
  // get data from localStorage
  const storage1 = localStorage.getItem('bookmarks');
  // check if their is data (not empty)
  // if their is data store it in state.bookmarks
  if (storage1) state.bookmarks = JSON.parse(storage1);

  const storage2 = localStorage.getItem('shoppingList');
  if (storage2) state.shoppingList = JSON.parse(storage2);

  const storage3 = localStorage.getItem('weekMeals');
  if (storage3) state.weekMeals = JSON.parse(storage3);
};

init();

// export const uploadRecipe = async function (newRecipe) {
//   try {
//     const ingredients = Object.entries(newRecipe)
//       .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
//       .map(ing => {
//         const ingArr = ing[1].split(',').map(el => el.trim());
//         // const ingArr = ing[1].replaceAll(' ', '').split(',');
//         // checking that the array is following the correct format to avoid undefined if no value entered (not following the correct format that contains 3 elements)
//         if (ingArr.length !== 3)
//           throw new Error(
//             'Wrong ingredient format!, please use the correct format'
//           );
//         const [quantity, unit, description] = ingArr;
//         return { quantity: quantity ? +quantity : null, unit, description };
//       });
//     const recipe = {
//       id: newRecipe.id,
//       title: newRecipe.title,
//       publisher: newRecipe.publisher,
//       source_url: newRecipe.sourceUrl,
//       image_url: newRecipe.image,
//       servings: +newRecipe.servings,
//       cooking_time: +newRecipe.cookingTime,
//       ingredients,
//     };
//     const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
//     state.recipe = createRecipeObject(data);
//     addBookMark(state.recipe);
//   } catch (err) {
//     throw err;
//   }

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredient = Object.entries(newRecipe).filter(
      entry => entry[0].startsWith('Ingredient') && entry[1] !== ''
    );

    const ingredients = [];
    const ingredientObj = Object.fromEntries(ingredient);

    let counter = 0;

    const ingredientObjKeys = Object.keys(ingredientObj);
    for (let i = 0; i < ingredientObjKeys.length; i += 3) {
      const ingNum = +ingredientObjKeys[i].slice(-1);
      counter = ingNum > counter ? ingNum : counter;
    }

    let ingredientsObj2;
    for (let i = 1; i <= counter; i++) {
      ingredientsObj2 = {
        quantity: +ingredientObj[`Ingredient-Quantity_${i}`],
        unit: ingredientObj[`Ingredient-Unit_${i}`],
        description: ingredientObj[`Ingredient-Description_${i}`],
      };
      ingredients.push(ingredientsObj2);
    }

    const recipe = {
      id: newRecipe.id,
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookMark(state.recipe);
  } catch (err) {
    throw err;
  }
};

const saveShoppingList = function () {
  localStorage.setItem('shoppingList', JSON.stringify(state.shoppingList));
};

// const clearLocalStorage = function (item) {
//   window.localStorage.removeItem(`${item}`);
// };
// clearLocalStorage('shoppingList');
// clearLocalStorage('weekMeals');

export const addWeekMeal = function (day, recipe) {
  state.weekMeals[day].push({ recipe: recipe, day: day });
};

export const saveWeekMeals = function () {
  localStorage.setItem('weekMeals', JSON.stringify(state.weekMeals));
};

export const deleteFromWeekMeals = function (id, meal) {
  let deletedDay = [];
  const mealDay = Object.values(meal).forEach(day =>
    day.forEach(rec => {
      if (rec.recipe.id === id) {
        deletedDay = rec.day;
      }
    })
  );

  const mealArr = Object.values(meal);
  Object.keys(meal).forEach(day => {
    if (day === deletedDay) {
      state.weekMeals[deletedDay] = [];
    }
  });

  saveWeekMeals();
};

export const sponacularAPI = async function (recipeName) {
  try {
    const rec = await AJAX(
      `https://api.spoonacular.com/recipes/complexSearch?query=${recipeName}&apiKey=${sponacularAPI_KEY}`
    );
    const recId = rec.results[0].id;
    if (!recId) return;
    const calories = await AJAX(
      `https://api.spoonacular.com/recipes/${recId}/nutritionWidget.json?apiKey=${sponacularAPI_KEY}`
    );
    const recipeCalories = calories.calories;
    return recipeCalories;
  } catch (err) {}
};

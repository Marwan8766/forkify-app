import view from './View.js';

import icons from 'url:../../img/icons.svg';
// import { Fraction } from 'fractional';
import fracty from 'fracty';

class RecipeView extends view {
  _parentElement = document.querySelector('.recipe');
  _errMessage = "Couldn't find that recipe,Please try another one! ";
  _successMessage = '';
  _shoppingList = document.querySelector('.shopping');
  // _addToListBtn = document.querySelector('.recipe__add-shopping-list');
  _addToListBtn = document.querySelector('.shopping-btn');
  _shoppingListEl = document.querySelector('.recipe__add-shopping-list');
  _calories = document.querySelector('.calories');

  _generateMarkup() {
    return `
    <figure class="recipe__fig">
          <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this._data.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this._data.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--update-servings" data-update-to="${
                this._data.servings - 1
              }" >
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--update-servings" data-update-to="${
                this._data.servings + 1
              }">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

         
          <div class="dropdown">
          <button class="dropbtn">Week Days</button>
          <div class="dropdown-content">
           <button class="btn-days btn-sunday">Sunday<button>
           <button class="btn-days btn-monday">Monday<button>
           <button class="btn-days btn-tuesday">Tuesday<button>
           <button class="btn-days btn-wednesday">Wednesday<button>
           <button class="btn-days btn-thursday">Thursday<button>
           <button class="btn-days btn-friday">Friday<button>
           <button class="btn-days btn-sunday">Saturday<button>
          </div>
        </div>


          <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
          <svg>
          <use href="${icons}#icon-user"></use>
        </svg>
          </div>
          
          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <h3 style="margin-bottom:25px">${
            this._data.calories
              ? 'Calories = ' + this._data.calories
              : 'Sorry can`t calculate calories for this recipe, Try another one'
          } </h3>
          <ul class="recipe__ingredient-list">
           ${this._data.ingredients
             .map(ing => this._generateMarkupIngredient(ing))
             .join('')}
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              this._data.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this._data.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
         
         
        </div>
   
        <div class="recipe__add-shopping-list">
        <button
        class="btn--small recipe__btn shopping-btn"
        
        target="_blank"
      >
        <span>Add to Shopping List</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
      </div>
    `;
  }

  _generateMarkupIngredient(ing) {
    return `<li class="recipe__ingredient">
    <svg class="recipe__icon">
      <use href="${icons}#icon-check"></use>
    </svg>
    <div class="recipe__quantity">${
      ing.quantity ? fracty(ing.quantity.toFixed(2)).toString() : ''
    }</div>
    <div class="recipe__description">
      <span class="recipe__unit">${ing.unit}</span>
      ${ing.description}
    </div>
  </li>`;
  }

  generateMarkupIngredientList(ing) {
    return `<li class="recipe__ingredient">
    <svg class="recipe__icon">
      <use href="${icons}#icon-check"></use>
    </svg>
    <div class="recipe__quantity">${
      ing.quantity ? fracty(ing.quantity.toFixed(2)).toString() : ''
    }</div>
    <div class="recipe__description">
      <span class="recipe__unit">${ing.unit}</span>
      ${ing.description}
    </div>
  </li>`;
  }
  addHandlerAddToList(handler, ing) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.shopping-btn');
      if (!btn) return;
      handler();
    });
  }

  // code knows when to execute (publisher)
  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;
      const updateTo = +btn.dataset.updateTo;
      if (updateTo < 1) return;
      handler(updateTo);
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  addHandlerAddToMeals(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn-days');
      if (!btn) return;
      handler(btn.textContent, this._parentElement);
    });
  }
}

export default new RecipeView();

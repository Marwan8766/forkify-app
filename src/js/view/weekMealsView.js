import view from './View';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';
import weekMealsPreviewView from './weekMealsPreviewView';

class weekMealsView extends view {
  _parentElement = document.querySelector('.weekMeals');
  _window = document.querySelector('.week-meals-window');
  _overlay = document.querySelector('.overlay-meals');
  _btnOpen = document.querySelector('.nav__btn--week-meals');
  _btnClose = document.querySelector('.btn--close-meals');
  _recipe = document.querySelector('.recipe');
  _successMessage = 'The meal is successfully added to your week meal plan';

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerCloseWindow();
  }

  toggleWindow() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerCloseWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  _generateMarkup(day) {
    const dayMeals = Object.values(this._data);
    return dayMeals
      .map(meal =>
        meal.map(m => weekMealsPreviewView.render(m.recipe, false, m.day))
      )
      .join('');
  }

  addHandlerDeleteMeals(handler) {
    this._parentElement.addEventListener(
      'click',
      this.test.bind(this, handler)
    );
  }

  test(handler) {
    const btn = event.target.closest('.btn-delete-meal');
    if (!btn) return;
    handler(
      this._data,
      event.target
        .closest('li')
        .querySelector('.preview__link')
        .getAttribute('href')
        .slice(1)
    );
  }

}
export default new weekMealsView();

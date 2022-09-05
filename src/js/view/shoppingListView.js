import view from './View';
import icons from 'url:../../img/icons.svg';

class ShoppingListView extends view {
  _parentElement = document.querySelector('.shopping');
  _window = document.querySelector('.shopping-list-window');
  _overlay = document.querySelector('.overlay-shopping');
  _btnOpen = document.querySelector('.nav__btn--shooping-list');
  _btnClose = document.querySelector('.btn--close-shopping');
  _recipe = document.querySelector('.recipe');
  _successMessage = 'Ingridients successfully added to shopping cart';

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

  addToShopping(ingArr) {
    ingArr.map(ing => {
      const markup = this.generateMarkupIng(ing);
      this.renderToList(markup);
    });
  }

  addHandlerRemoveFromList(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn-delete-list');
      if (!btn) return;
      handler(e.target.closest('li'));
    });
  }

  renderToList(markup) {
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  generateMarkupIng(ing) {
    return `
    <ul>
    <li>${ing}<button class="btn-delete-list"style="font-size:22px;color:red;background-color:white;border:0px;margin-left:22px">&times;</button> </li>  
  </ul>
  
    `;
  }
}
export default new ShoppingListView();

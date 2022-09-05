import icons from 'url:../../img/icons.svg';
import view from './View.js';

class WeekMealsPreviewView extends view {
  _parentElement = '';

  // addHandlerDeleteMeal(handler) {
  //   this._parentElement.addEventListener('click', function (e) {
  //     const btn = e.target.closest('.btn-delete-meal');
  //     if (!btn) return;
  //     handler(e.target.closest('li'));
  //   });
  // }

  addToWeekMeals(ingArr) {
    ingArr.map(ing => {
      const markup = this.generateMarkupIng(ing);
      this.renderToList(markup);
    });
  }

  _generateMarkup(day) {
    const id = window.location.hash.slice(1);

    return `
   
    
    <li class="preview">
    
    <button class="btn-delete-meal"style="font-size:22px;color:red;background-color:white;border:0px;margin-left:22px">&times;</button> ${day}
  
     <a class="preview__link ${
       this._data.id === id ? 'preview__link--active' : ''
     }" href="#${this._data.id}">
   
    
      <figure class="preview__fig">
        <img src="${this._data.image}" alt="${this._data.title}" />
      </figure>
      <div class="preview__data">
        <h4 class="preview__title">${this._data.title}</h4>
        <p class="preview__publisher">${this._data.publisher}</p>
        <div class="preview__user-generated ${this._data.key ? '' : 'hidden'}">
        <svg>
        <use href="${icons}#icon-user"></use>
      </svg>
        </div>
      </div>
    </a>

  </li>
    `;
  }
}

export default new WeekMealsPreviewView();

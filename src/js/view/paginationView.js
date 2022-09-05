import view from './View';
import icons from 'url:../../img/icons.svg';
import { RESULTS_PER_PAGE } from '../config';

class PaginationView extends view {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    //  on page 1 and there is other pages
    if (curPage === 1 && numPages > 1) {
      return `
     ${this._generateMarkupBtn('next', true, false)}
      `;
    }
    // on last page
    if (curPage === numPages) {
      return `
      ${this._generateMarkupBtn('prev', false, true)}
      `;
    }
    // on other middle page
    if (curPage < numPages) {
      return `
      ${this._generateMarkupBtn('prev', false, true)}
      ${this._generateMarkupBtn('next', false, true)}
    `;
    }
    // on page 1 and there is no other pages
    return '';
  }

  _generateMarkupBtn(btnType, isFirstPage, isMidOrLastPage) {
    const curPage = this._data.page;
    // const totalPagesLeft = Math.ceil(
    //   this._data.results.length / this._data.resultsPerPage - curPage
    // );
    // const pagesLeft = totalPagesLeft > 0 ? totalPagesLeft + ' pages left' : '';

    const pagesLeft =
      'Page ' +
      this._data.page +
      ' / ' +
      Math.ceil(this._data.results.length / this._data.resultsPerPage);

    const page1LeftMarkup = `<h2 class=" pagination__btn--prev" style="margin-left:30px;color:#F38E82"">
    <span>${pagesLeft}</span>
  </h2>`;
    const page2LeftMarkup = `<h2 class=" pagination__btn--prev" style="margin-left:124px;color:#F38E82">
  <span>${pagesLeft}</span>
  </h2>`;

    if (btnType === 'prev')
      return `
      <button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${curPage - 1}</span>
  </button>

  ${isMidOrLastPage ? page1LeftMarkup : ''}
  `;

    if (btnType === 'next')
      return `
      
    ${isFirstPage ? page2LeftMarkup : ''}
      <button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
  <span>Page ${curPage + 1}</span>
  <svg class="search__icon">
    <use href="${icons}#icon-arrow-right"></use>
  </svg>
</button>`;
  }
}

export default new PaginationView();

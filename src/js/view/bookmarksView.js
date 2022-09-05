import icons from 'url:../../img/icons.svg';
import view from './View.js';
import previewView from './previewView.js';

class BookmarksView extends view {
  _parentElement = document.querySelector('.bookmarks__list');
  _errMessage = 'No bookmarks added yet ';
  _successMessage = '';

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }

  addHandlerBookmark(handler) {
    window.addEventListener('load', function () {
      handler();
    });
  }
}

export default new BookmarksView();

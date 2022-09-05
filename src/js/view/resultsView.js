import icons from 'url:../../img/icons.svg';
import view from './View.js';
import previewView from './previewView.js';

class ResultsView extends view {
  _parentElement = document.querySelector('.results');
  _errMessage = 'No recipes found for your query,Please try again! ';
  _successMessage = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();

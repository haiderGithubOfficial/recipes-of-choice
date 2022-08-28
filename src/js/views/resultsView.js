import View from './View.js';
import icons from '../../img/icons.svg';
import previewView from './previewView.js';

class ResultView extends View {
  _errorMessage = 'We could not find the recipe, Please try another one!';
  _message = '';
  _parentElement = document.querySelector('.results');
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultView();

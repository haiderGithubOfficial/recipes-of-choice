import View from './View.js';
import previewView from './previewView.js';
import icons from '../../img/icons.svg';

class BookmarkView extends View {
  _errorMessage =
    'We could not find bookmark. Please choose a recipe and bookmark it!';
  _message = '';
  _parentElement = document.querySelector('.bookmarks');
  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }

  addHandlerSavedBookmarks(handler) {
    window.addEventListener('load', handler);
  }
}

export default new BookmarkView();

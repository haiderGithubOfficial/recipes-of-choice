import View from './View.js';
import icons from '../../img/icons.svg';

class AddRecipeView extends View {
  constructor() {
    super();
    this._addHandlerAddRecipeWindow();
  }
  _parentElement = document.querySelector('.upload');
  _overlay = document.querySelector('.overlay');
  _addRecipeWindow = document.querySelector('.add-recipe-window');
  _openRecipeWindowBtn = document.querySelector('.nav__btn--add-recipe');
  _closeRecipeWindowBtn = document.querySelector('.btn--close-modal');

  toggleClass() {
    this._overlay.classList.toggle('hidden');
    this._addRecipeWindow.classList.toggle('hidden');
  }

  _addHandlerAddRecipeWindow() {
    this._openRecipeWindowBtn.addEventListener(
      'click',
      this.toggleClass.bind(this)
    );
    this._closeRecipeWindowBtn.addEventListener(
      'click',
      this.toggleClass.bind(this)
    );
    this._overlay.addEventListener('click', this.toggleClass.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      let data = 0;
      const formDataArr = [...new FormData(this)];
      const formData = Object.fromEntries(formDataArr);
      console.log(formDataArr);
      console.log(formData);
      handler(formData);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();

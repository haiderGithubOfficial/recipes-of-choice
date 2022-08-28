import View from './View.js';
import icons from '../../img/icons.svg';
import { NoOfSearchResultPerPage } from '../config.js';

class paginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const curPage = this._data.pageNo;
    const noOfPages = Math.ceil(
      this._data.result.length / NoOfSearchResultPerPage
    );

    // page1, and there are some other pages
    if (curPage === 1 && noOfPages > 1) {
      return `<button <button value=${
        curPage + 1
      } class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }
    // page1, and there are no pages
    if (curPage === 1 && noOfPages === 1) {
      return '';
    }
    // last page
    if (curPage === noOfPages && noOfPages > 1) {
      return `<button value=${
        curPage - 1
      }  class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>`;
    }
    // other page
    if (curPage !== 1 && noOfPages > 1) {
      return `<button <button value=${
        curPage + 1
      } class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
          <button  <button value=${
            curPage - 1
          } class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>`;
    }
    return `${noOfPages}`;
  }

  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const curPage = Number(btn.value);
      handler(curPage);
    });
  }
}
export default new paginationView();

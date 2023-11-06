import FormView from './FormView';

const SearchFormView = class extends FormView {
  _formElement = document.querySelector('.search');

  getSearchedWord() {
    const { keyword } = this.getValues();
    return keyword;
  }
};

export default new SearchFormView();

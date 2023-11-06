import ViewPreview from './ViewPreview';

const SearchResultView = class extends ViewPreview {
  _containerElement = document.querySelector('.results');

  errorMessage = {
    emptyInput: 'Search field is empty',
    noResults: 'Could not find any recipe with the searched keyword:',
  };
};

export default new SearchResultView();

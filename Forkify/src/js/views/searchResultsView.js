import PreviewView from './PreviewView';

const SearchResultView = class extends PreviewView {
  _containerElement = document.querySelector('.results');

  errorMessage = {
    emptyInput: 'Search field is empty',
    noResults: 'Could not find any recipe with the searched keyword:',
  };
};

export default new SearchResultView();

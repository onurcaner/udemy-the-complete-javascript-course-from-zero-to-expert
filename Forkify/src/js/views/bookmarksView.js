import ViewPreview from './ViewPreview';

const BookmarksView = class extends ViewPreview {
  _containerElement = document.querySelector('.bookmarks__list');

  message = {
    noBookmarks: 'No bookmarks yet. Find a nice recipe and bookmark it',
  };
};

export default new BookmarksView();

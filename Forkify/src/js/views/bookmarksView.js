import PreviewView from './PreviewView';

const BookmarksView = class extends PreviewView {
  _containerElement = document.querySelector('.bookmarks__list');

  message = {
    noBookmarks: 'No bookmarks yet. Find a nice recipe and bookmark it',
  };
};

export default new BookmarksView();

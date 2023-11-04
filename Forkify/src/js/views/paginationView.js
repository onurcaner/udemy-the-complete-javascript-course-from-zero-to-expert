import View from './View';
import { PAGINATION_CONTAINER_ELEMENT_QUERY } from '../config';

const PaginationView = class extends View {
  _containerElement = document.querySelector(
    PAGINATION_CONTAINER_ELEMENT_QUERY
  );
};

export default new PaginationView();

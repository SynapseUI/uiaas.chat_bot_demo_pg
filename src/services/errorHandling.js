import { updateBanner } from '../actions/bankLoginActions';

import store from '../store/store';
import utils from './utils';

export default function displayErrorBanner(err, callback) {
  switch (err.http_code) {
    case '500':
      store.dispatch(updateBanner({
        isOpen: true,
        content: 'The server is down, please try again later.'
      }));
      break;
    case '429':
      store.dispatch(updateBanner({
        isOpen: true,
        content: 'The server is busy, please try again later.'
      }));
      break;
    case '503':
      store.dispatch(updateBanner({
        isOpen: true,
        content: 'The server is busy, please try again later.'
      }));
      break;
    case '504':
      store.dispatch(updateBanner({
        isOpen: true,
        content: 'The server is busy, please try again later.'
      }));
      break;
    default:
      store.dispatch(updateBanner({
        isOpen: true,
        content: 'The server is busy, please try again later.'
      }));
  }
}

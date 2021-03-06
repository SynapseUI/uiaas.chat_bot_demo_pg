import {
  UPDATE_NEW_NODES,
  UPDATE_USER_INFO,
  UPDATE_BANNER
} from '../constants/actionConstants';

export function updateNewNodes(nodeLinked) {
  return ({
    type: UPDATE_NEW_NODES,
    payload: {
      nodeLinked
    }
  });
}

export function updateUserInfo(field, value) {
  // use this if you want to update 1 item at a time
  return ({
    type: UPDATE_USER_INFO,
    payload: {
      field,
      value
    }
  });
}

export function updateBanner(value) {
  return ({
    type: UPDATE_BANNER,
    payload: value
  });
}

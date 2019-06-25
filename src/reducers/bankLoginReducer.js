import {
  UPDATE_NEW_NODES,
  UPDATE_USER_INFO
} from '../constants/actionConstants';

const initialState = {
  newNodes: {
    nodeLinked: []
  },

  id: null,
  refreshToken: null,
  oauth_key: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_NEW_NODES:
      return {
        ...state,
        newNodes: {
          nodeLinked: action.payload.nodeLinked ? action.payload.nodeLinked : state.newNodes.nodeLinked,
        },
      };
    case UPDATE_USER_INFO:
      return {
        ...state,
        [action.payload.field]: action.payload.value
      };
    default:
      return state;
  }
};

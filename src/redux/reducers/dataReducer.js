import dataActions from '../actions/dataActions';
import {
  SET_SCREAMS,
  LIKE_SCREAMS,
  UNLIKE_SCREAM,
  LOADING_DATA,
  LIKE_SCREAM,
} from '../types';

const initialState = {
  screams: [],
  scream: {},
  loading: false,
};

export default function (state = initialState, actions) {
  switch (actions.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true,
      };
    case SET_SCREAMS:
      return {
        ...state,
        screams: actions.payload,
        loading: false,
      };

    case LIKE_SCREAM:
    case UNLIKE_SCREAM:
      let index = state.screams.findIndex(
        (scream) => scream.screamId === actions.payload.screamId
      );
      state.scream[index] = actions.payload;
      return {
        ...state,
      };

    default:
      return state;
  }
}

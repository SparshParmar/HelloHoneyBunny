import dataActions from '../actions/dataActions';
import {
  SET_SCREAMS,
  UNLIKE_SCREAM,
  LOADING_DATA,
  LIKE_SCREAM,
  DELETE_SCREAM,
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
      state.screams[index] = actions.payload;
      if (state.scream.screamId === actions.payload.screamId) {
        state.scream = actions.payload;
      }
      return {
        ...state,
      };
    case DELETE_SCREAM:
      let i_dex = state.screams.findIndex(
        (scream) => scream.screamId === actions.payload
      );
      state.screams.splice(i_dex, 1);
      return {
        ...state,
      };
    default:
      return state;
  }
}

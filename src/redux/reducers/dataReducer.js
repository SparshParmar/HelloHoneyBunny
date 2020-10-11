import dataActions from '../actions/dataActions';
import {
  SET_SCREAMS,
  SET_SCREAM,

  UNLIKE_SCREAM,
  LOADING_DATA,
  LIKE_SCREAM,
  DELETE_SCREAM,
  POST_SCREAM,
  STOP_LOADING_UI
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

    case POST_SCREAM:
    return {
        ...state,
        screams: [actions.payload.resScream, ...state.screams],
      };
      case SET_SCREAM:
        console.log(actions.payload)
        return{
          ...state,
          scream:actions.payload
        }
    default:
      return state;
  }
}

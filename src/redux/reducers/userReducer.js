import { findAllByDisplayValue } from '@testing-library/react';
import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  UNLIKE_SCREAM,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  LIKE_SCREAM,
} from '../types';

const initialState = {
  authenticated: false,
  credentials: {},
  like: [],
  notifications: [],
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
      };
    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_USER:
      return {
        authenticated: true,
        ...action.payload,
        loading: false,
      };
    case LOADING_USER:
      return {
        ...state,
        loading: true,
      };
    case LIKE_SCREAM:
      return {
        ...state,
        likes: [
          ...state.likes,
          {
            userHandle: state.credentails.handle,
            screamId: action.payload.screamId,
          },
        ],
      };
    case UNLIKE_SCREAM:
      return {
        ...state,
        likes: state.like.filter(
          (like) => like.screamId === action.payload.screamId
        ),
      };
    default:
      return state;
  }
}

const ADD_ERROR = 'ADD_ERROR';
const CLEAR_ERROR = 'CLEAR_ERROR';

export function addError(error) {
  return {
    type: ADD_ERROR,
    payload: error
  };
}

export function clearError() {
  return { type: CLEAR_ERROR };
}

export default (state = null, action) => {
  switch (action.type) {
    case 'ADD_ERROR':
      return action.payload;

    case 'CLEAR_ERROR':
      return null;

    default:
      return state;
  }
};

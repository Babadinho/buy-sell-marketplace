// let userState;

// if (window.localStorage.getItem('buynsell')) {
//   userState = JSON.parse(window.localStorage.getItem('buynsell'));
// } else {
//   userState = null;
// }

export const authReducer = (state = {}, action) => {
  switch (action.type) {
    case 'LOGGED_IN_USER':
      return { ...state, ...action.payload };
    case 'LOGOUT':
      return action.payload;
    default:
      return state;
  }
};

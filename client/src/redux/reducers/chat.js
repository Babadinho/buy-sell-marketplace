export const chatReducer = (state = [], action) => {
  switch (action.type) {
    case 'CHAT_DETAILS':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

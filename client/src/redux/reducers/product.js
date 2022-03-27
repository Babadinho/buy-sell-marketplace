export const productReducer = (state = {}, action) => {
  switch (action.type) {
    case 'PRODUCT_DETAILS':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

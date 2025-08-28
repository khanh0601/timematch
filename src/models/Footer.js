export default {
  namespace: 'FOOTER',
  state: {
    isScroll: false,
  },
  reducers: {
    setIsScroll(state, action) {
      return {
        ...state,
        isScroll: action.payload,
      };
    },
  },
};

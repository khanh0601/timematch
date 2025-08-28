export const loadingData = payload => {
  return {
    type: 'PREVIEW/loadingData',
    payload,
  };
};

export const backToEventTypeList = () => {
  return {
    type: 'EVENT/backToEventTypeList',
  };
};

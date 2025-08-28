import teamRequest from '../services/teamRequest';
import { message } from 'antd';
import { history } from 'umi';
export default {
  namespace: 'DOCUMENT',
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

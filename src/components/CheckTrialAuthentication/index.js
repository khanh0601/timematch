import { Redirect } from 'umi';
import UserPage from '../../pages/User/index.js';
import { getCookie } from '@/commons/function.js';
import { ACCOUNT_TYPE_BUSINESS } from '@/constant';

export default props => {
  const isLogin = getCookie('token');
  const checkTrial = getCookie('checkTrial');
  const is_expired = getCookie('is_expired');
  const accountType = getCookie('accountType');

  if (isLogin) {
    if (accountType == ACCOUNT_TYPE_BUSINESS && is_expired == 'true') {
      return <Redirect to="/expired-free" />;
    } else {
      return <UserPage />;
    }
  } else {
    return <Redirect to="/login" />;
  }
};

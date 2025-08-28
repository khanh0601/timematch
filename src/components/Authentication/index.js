import { Redirect } from 'umi';
import UserPage from '../../pages/User/index.js';
import { getCookie } from '@/commons/function.js';

export default props => {
  const isLogin = getCookie('token');
  if (isLogin) {
    return <UserPage />;
  } else {
    return <Redirect to="/login" />;
  }
};

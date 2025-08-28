import ReactGA from 'react-ga';
import { getCookie, setCookie } from '@/commons/function.js';
import config from '@/config';
import UserRequest from '@/services/userRequest.js';
import 'antd/dist/antd.css';
import cookie from 'js-cookie';
import Echo from 'laravel-echo';
import { history } from 'umi';
import './base.less';
import usePageViews from '@/commons/googleAnalytics.js';

ReactGA.initialize('UA-213371681-1', {
  debug: true,
});

// import TagManager from 'react-gtm-module';
//
// const tagManagerArgs = {
//   gtmId: 'G-3P0BNS5MHV',
// };
//
// TagManager.initialize(tagManagerArgs);

const isLogin = getCookie('token');
if (
  isLogin &&
  !history.location.pathname.includes('/schedule-adjustment') &&
  window.location.hostname !== config.ADMIN_HOSTNAME
) {
  (async () => {
    const res = await UserRequest.getProfile({});
    localStorage.setItem('profile', JSON.stringify(res.body.data));

    if (res.body.data) {
      const { is_expired } = res.body.data;
      setCookie('is_expired', is_expired);
    }
  })();
}

if (isLogin) {
  // Setup:
  window.io = require('socket.io-client');
  window.Echo = new Echo({
    broadcaster: 'socket.io',
    host: `${config.SOCKET_DOMAIN}`,
    auth: {
      headers: {
        Authorization: 'Bearer ' + cookie.get('token'),
      },
    },
    transports: ['websocket', 'polling', 'flashsocket'], // Fix CORS error!
  });
} else {
  // Setup if user not login:
  window.io = require('socket.io-client');
  window.Echo = new Echo({
    broadcaster: 'socket.io',
    host: `${config.SOCKET_DOMAIN}`,
    transports: ['websocket', 'polling', 'flashsocket'], // Fix CORS error!
  });
}

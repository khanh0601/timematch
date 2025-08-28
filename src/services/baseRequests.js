import superagent from 'superagent';
import cookie from 'js-cookie';
import { history } from 'umi';
import { message, Modal } from 'antd';
import config from '@/config';
import {
  deleteLocalInfo,
  personalExpiredModal,
  businessExpiredModal,
  isBusiness,
  notify,
} from '../commons/function';

const _errorHandler = err => {
  switch (err.status) {
    case 501: {
      notify('このアカウントは利用停止されています。');
      deleteLocalInfo();
      history.push('/');
      break;
    }

    case 401: {
      cookie.remove('token');
      history.push({ pathname: '/' });
      location.reload();

      break;
    }

    case 402: {
      const { code } = err.response.body;

      if ([900, 904, 905].includes(code)) {
        if (isBusiness()) {
          businessExpiredModal();
          return;
        }

        personalExpiredModal();
        return;
      }

      if ([800, 801, 802].includes(code)) {
        history.push({
          pathname: '/expired-free',
          query: { code: err.status },
        });
      }
    }
  }
};

export default {
  get: (url, data = {}) =>
    superagent
      .get(config.API_DOMAIN + url)
      .query(data)
      .set('Authorization', 'Bearer ' + cookie.get('token'))
      .set('Accept', 'application/json')
      .use(req =>
        req.on('error', err => {
          _errorHandler(err);
        }),
      ),

  post: (url, data = {}) =>
    superagent
      .post(config.API_DOMAIN + url)
      .send(data)
      .set('Authorization', 'Bearer ' + cookie.get('token'))
      .set('Accept', 'application/json, multipart/form-data')
      .use(req =>
        req.on('error', err => {
          _errorHandler(err);
        }),
      ),

  put: (url, data = {}) =>
    superagent
      .put(config.API_DOMAIN + url)
      .send(data)
      .set('Authorization', 'Bearer ' + cookie.get('token'))
      .set('Accept', 'application/json')
      .use(req =>
        req.on('error', err => {
          _errorHandler(err);
        }),
      ),

  delete: (url, data = {}) =>
    superagent
      .delete(config.API_DOMAIN + url)
      .send(data)
      .set('Authorization', 'Bearer ' + cookie.get('token'))
      .set('Accept', 'application/json')
      .use(req =>
        req.on('error', err => {
          _errorHandler(err);
        }),
      ),
};

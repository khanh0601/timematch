import rf from './baseRequests.js';

export default {
  getUserConnectionPlans: (data = {}) => {
    const url = '/api/user/user_connection_plans';
    return rf.get(url, data);
  },
  verifiedLinkAccount: (data = {}) => {
    const url = '/api/user/user_connections/verified-link-account';
    return rf.post(url, data);
  },
  getUserConnectionsByOwnerId: (data = {}) => {
    const url = '/api/user/user-connections/get-by-owner';
    return rf.get(url, data);
  },
  updateUserConnection: (id, data = {}) => {
    const url = `/api/user/user_connections/${id}`;
    return rf.put(url, data);
  },
  deleteUserConnection: id => {
    const url = `/api/user/user_connections/${id}`;
    return rf.delete(url);
  },
};

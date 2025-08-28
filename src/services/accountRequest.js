import rf from './baseRequests.js';

export default {
  getUserConnectionPlans: (data = {}) => {
    const url = '/api/user/user_connection_plans';
    return rf.get(url, data);
  },

  createConnections: (data = {}) => {
    const url = '/api/user/user_connections';
    return rf.post(url, data);
  },

  getUserConnections: (data = {}) => {
    const url = '/api/user/user_connections';
    return rf.get(url, data);
  },

  deleteUserConnection: id => {
    const url = `/api/user/user_connections/${id}`;
    return rf.delete(url);
  },

  updateUserConnection: (id, data = {}) => {
    const url = `/api/user/user_connections/${id}`;
    return rf.put(url, data);
  },

  sendEmailInvitations: (data = {}) => {
    const url = `/api/user/send_mail_connection`;
    return rf.post(url, data);
  },
  changePassword: (data = {}) => {
    const url = '/api/profiles/change_password';
    return rf.put(url, data);
  },
};

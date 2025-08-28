import rf from './baseRequests.js';

export default {
  getUserEvents: (data = {}) => {
    const url = '/api/user/events';
    return rf.get(url, data);
  },
  getAccountTeam: (data = {}) => {
    const url = '/api/users/teams/members';
    return rf.get(url, data);
  },
  deletePaginateTeam: (data = {}) => {
    const url = '/api/users/teams/delete';
    return rf.post(url, data);
  },
};

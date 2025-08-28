import rf from './baseRequests.js';

export default {
  getCreateTeam: (data = {}) => {
    const url = '/api/users/teams/create';
    return rf.get(url, data);
  },
  postCreateTeam: (data = {}) => {
    const url = '/api/users/teams';
    return rf.post(url, data);
  },
  getTeam: (data = {}) => {
    const url = '/api/users/teams';
    return rf.get(url, data);
  },
  getTeamEdit: (data = {}) => {
    const url = '/api/users/teams/edit';
    return rf.get(url, data);
  },
  postTeamEdit: (data = {}) => {
    const url = '/api/users/teams/update';
    return rf.post(url, data);
  },
  getTeamOption: (data = {}) => {
    const url = '/api/users/teams/options';
    return rf.get(url, data);
  },
};

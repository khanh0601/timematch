import rf from './baseRequests.js';

export default {
  getPaginateEvents: (data = {}) => {
    const url = '/api/users/teams/paginate-events';
    return rf.get(url, data);
  },
  postTeamEvents: (data = {}) => {
    const url = `/api/users/events`;
    return rf.post(url, data);
  },
  getPaginateTeam: (data = {}) => {
    const url = '/api/users/teams/paginate-teams';
    return rf.get(url, data);
  },
  deletePaginateTeam: (data = {}) => {
    const url = '/api/users/teams/delete';
    return rf.post(url, data);
  },
};

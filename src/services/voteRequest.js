import rf from './baseRequests.js';

export default {
  getVoteShow: (data = {}) => {
    const url = `/api/guests/votes`;
    return rf.get(url, data);
  },
  postVoteGuestConfirm: (data = {}) => {
    const url = `/api/guests/votes`;
    return rf.post(url, data);
  },
  getVoteGuestSummary: (data = {}) => {
    const { vote, user_code, type, start, end, timeZone } = data;
    const url = `/api/guests/votes/${vote}/summary?async=true&user_code=${user_code}&type=${type}&start=${start}&end=${end}&timeZone=${timeZone}`;
    return rf.get(url);
  },
  getVoteUserShow: (data = {}) => {
    const url = `/api/users/votes/${data.vote}/users/${data.user}`;
    return rf.get(url);
  },
  postVoteUserSendEmail: (data = {}) => {
    const url = `/api/users/votes/send-mail-to-invitees`;
    return rf.post(url, data);
  },
  getVoteUserSummary: (data = {}) => {
    const { vote, type, start, end, timeZone } = data;
    const url = `/api/users/votes/${vote}/summary?async=true&type=${type}&start=${start}&end=${end}&timeZone=${timeZone}`;
    return rf.get(url);
  },
  postUserVote: (data = {}) => {
    const url = `/api/users/votes`;
    return rf.post(url, data);
  },
  getCodeUser: (data = {}) => {
    const url = `/api/users/votes/${data.vote}/code `;
    return rf.get(url);
  },
};

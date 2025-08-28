import rf from './baseRequests.js';

export default {
  googleLogin: (data = {}) => {
    const url = '/api/auth/google/login';
    return rf.get(url, data);
  },
  getProfile: (data = {}) => {
    const url = '/api/profiles/me';
    return rf.get(url, data);
  },
  updateLinkUrl: (data = {}) => {
    const url = '/api/profiles/me';
    return rf.put(url, data);
  },
  microsoftLogin: (data = {}) => {
    const url = '/api/auth/microsoft/login';
    return rf.get(url, data);
  },
  updateTimeDefault: (data = {}) => {
    const url = '/api/user/datetimes';
    return rf.post(url, data);
  },
  zoomLogin: (data = {}) => {
    const url = '/api/auth/zoom/login';
    return rf.post(url, data);
  },
  googleMeetLogin: (data = {}) => {
    const url = '/api/auth/google/integrate_login';
    return rf.post(url, data);
  },
  registerEmail: (data = {}) => {
    const url = '/api/auth/register';
    return rf.post(url, data);
  },
  verifyRegister: (data = {}) => {
    const url = '/api/auth/verify_register';
    return rf.post(url, data);
  },
  emailLogin: (data = {}) => {
    const url = '/api/auth/email/login';
    return rf.get(url, data);
  },
  sendMailResetPassword: (data = {}) => {
    const url = '/api/auth/send_mail_reset_password';
    return rf.post(url, data);
  },
  resetPassword: (data = {}) => {
    const url = `/api/profiles/change_password/${data.token}`;
    return rf.post(url, data.data);
  },
  updateProfile: (data = {}) => {
    const url = `/api/profiles/me`;
    return rf.post(url, data);
  },
  cancelPlan: (data = {}) => {
    const url = `/api/user/contract/cancel_plan`;
    return rf.post(url, data);
  },
  checkSlotStatus: (data = {}) => {
    const url = `/api/user/contract/slot_status`;
    return rf.get(url, data);
  },
  deleteProfile: (data = {}) => {
    const url = `/api/profiles/me`;
    return rf.delete(url, data);
  },
  cancelIntegrates: (data = {}) => {
    const url = `/api/user/cancel_integrates`;
    return rf.post(url, data);
  },
  getLinkConnectGGCalendar: (data = {}) => {
    const url = `/api/guest/google/integrate_url`;
    return rf.get(url, data);
  },
  syncGoogleCalendar: (data = {}) => {
    const url = `/api/guest/google/sync_event`;
    return rf.post(url, data);
  },
  syncMicrosoft365: (data = {}) => {
    const url = `/api/guest/microsoft/sync_event`;
    return rf.post(url, data);
  },
  getLinkConnectMicrosoft365: (data = {}) => {
    const url = `/api/guest/microsoft/integrate_url`;
    return rf.get(url, data);
  },
  googleSignUp: (data = {}) => {
    const url = `/api/auth/google/signup`;
    return rf.get(url, data);
  },
  microsoftSignUp: (data = {}) => {
    const url = `/api/auth/microsoft/signup`;
    return rf.get(url, data);
  },
  microsoftTeamLogin: (data = {}) => {
    const url = '/api/auth/microsoft/integrate_microsoft';
    return rf.post(url, data);
  },
  syncUser: (data = {}) => {
    const url = '/api/user/sync_user';
    return rf.get(url, data);
  },
  microsoftConnect: (data = {}) => {
    const url = '/api/auth/microsoft/integrate_microsoft';
    return rf.post(url, data);
  },
  shareMicrosoftCalendar: (data = {}) => {
    const url = '/api/auth/share-calendar/microsoft';
    return rf.post(url, data);
  },

  shareGoogleCalendar: (data = {}) => {
    const url = '/api/auth/share-calendar/google';
    return rf.post(url, data);
  },
  registerEmailApp: (data = {}) => {
    const url = '/api/auth/register-app';
    return rf.post(url, data);
  },
  verifyRegisterApp: (data = {}) => {
    const url = '/api/auth/verify-register-app';
    return rf.post(url, data);
  },
  registerPassword: (data = {}) => {
    const url = '/api/auth/register-password';
    return rf.post(url, data);
  },
  getHistoryInvitation: (data = {}) => {
    const url = '/api/user/history_invite';
    return rf.get(url, data);
  },
  deleteHistoryInvitation: (data = {}) => {
    const url = `/api/user/history_invite/${data.id}`;
    return rf.delete(url, data);
  },
};

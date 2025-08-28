import rf from './baseRequests.js';

export default {
  getListUser: (data = {}) => {
    const url = '/api/admin/users';
    return rf.get(url, data);
  },

  deleteUser: id => {
    const url = `/api/admin/users/${id}`;
    return rf.delete(url);
  },

  updateUsers: (data = {}) => {
    const url = '/api/admin/users';
    return rf.put(url, data);
  },

  checkContractExists: (data = {}) => {
    const url = '/api/admin/check-contract-exists';
    return rf.get(url, data);
  },

  updateAccountStatus: (data = {}) => {
    const url = '/api/admin/user/account-status';
    return rf.put(url, data);
  },

  getAgencies: (data = {}) => {
    const url = '/api/admin/agencies';
    return rf.get(url, data);
  },

  createAgency: (data = {}) => {
    const url = '/api/admin/agencies';
    return rf.post(url, data);
  },

  updateAgency: (data = {}, id) => {
    const url = `/api/admin/agencies/${id}`;
    return rf.put(url, data);
  },

  createAccount: (data = {}) => {
    const url = '/api/admin/users';
    return rf.post(url, data);
  },

  bulkCreateAccount: (data = {}) => {
    const url = '/api/admin/user/import_excel';
    return rf.post(url, data);
  },

  getInvoice: id => {
    const url = `/api/admin/user_invoices/${id}`;
    return rf.get(url);
  },

  exportInvoice: body => {
    const url = '/api/admin/user_invoices/export';
    return rf.post(url, body);
  },

  adminLogin: (data = {}) => {
    const url = '/api/auth/email/login';
    return rf.get(url, data);
  },

  changePassword: (data = {}) => {
    const url = '/api/admin/change_password';
    return rf.post(url, data);
  },

  updateExpireForm: (data = {}) => {
    const url = '/api/admin/form/update-expire';
    return rf.put(url, data);
  },
};

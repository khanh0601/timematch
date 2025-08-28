import rf from './baseRequests.js';

export default {
  getContracts: (data = {}) => {
    const url = '/api/master/contracts';
    return rf.get(url, data);
  },

  createTransactions: (data = {}) => {
    const url = '/api/user/transactions';
    return rf.post(url, data);
  },

  changeCard: (data = {}) => {
    const url = '/api/user/user_cards';
    return rf.post(url, data);
  },

  getListTransaction: (data = {}) => {
    const url = '/api/user/transactions';
    return rf.get(url, data);
  },

  sendContactInvoice: (data = {}) => {
    const url = '/api/user/send_contact_invoice_mail';
    return rf.post(url, data);
  },

  sendContactEmail: (data = {}) => {
    const url = '/api/auth/send_contact_mail';
    return rf.post(url, data);
  },

  changeTypePayment: (data = {}) => {
    const url = '/api/user/change_type_payment';
    return rf.post(url, data);
  },

  changePlanCreditCard: (data = {}) => {
    const url = '/api/user/change_plans';
    return rf.post(url, data);
  },
};

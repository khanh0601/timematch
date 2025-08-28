import rf from './baseRequests';

export default {
  createTemplateSetting: (data = {}) => {
    const url = `/api/form`;
    return rf.post(url, data);
  },
  createAnswerTemplate: payload => {
    const { id, data } = payload;
    const url = `/api/guests/forms/reply-form/${id}`;
    return rf.post(url, data);
  },
  updateTemplateSetting: (data = {}) => {
    const url = `/api/form/update`;
    return rf.post(url, data);
  },
  deleteTemplateSetting: () => {
    const url = `/api/form`;
    return rf.delete(url);
  },
  getTemplateSetting: (data = {}) => {
    const url = '/api/form/edit';
    return rf.get(url, data);
  },
  getTemplateGuest: (data = {}) => {
    const url = '/api/guests/forms';
    return rf.get(url, data);
  },
  getViewTemplate: (data = {}) => {
    const url = '/api/form/generate-form';
    return rf.get(url, data);
  },
  createGoogleAnalyticOrAd: (data = {}) => {
    const url = '/api/form/store-google-analytics';
    return rf.post(url, data);
  },
};

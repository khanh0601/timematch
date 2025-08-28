import {
  convertDataToString,
  deepCopyData,
  notify,
  objValid,
} from '@/commons/function';
import {
  SETTING_TEMPLATE,
  STEP_NEXT_SETTING_TEMPLATE,
  UNPROCESSABLE_ENTITY_STATUS,
} from '@/constant';
import update from 'immutability-helper';
import { v4 as uuid } from 'uuid';
import {
  INPUT_TYPE,
  DEFAULT_POLICY,
  DEFAULT_INPUT_TEXT,
  DEFAULT_INPUT_CHECKBOX,
} from '@/constant';
import SettingTemplateRequest from '../services/settingTemplateRequest.js';
import { DEFAULT_LIST_INPUT } from '@/constant';
import EventRequest from '@/services/eventRequest';
import {
  handlePrepareAnswer,
  notifyMessage,
  sortData,
} from '@/commons/function';
import config from '@/config';

const initState = {
  addInputQuestion: false,
  currentPage: 1,
  dataButtonEmbedTemplate: {
    text: '',
    styles: '',
  },
  dataViewTemplate: {},
  dataCalendarTemplate: {
    hideTitleCalendar: false,
    nameCalendar: {
      text: '',
      styles: convertDataToString({
        fontSize: '14px',
      }),
    },
    backgroundImage: {
      files: '',
      urlImage: '',
    },
    descriptionCalendar: {
      title: {
        text: '',
        styles: convertDataToString({
          fontSize: '14px',
        }),
      },
      content: {
        text: '',
        styles: convertDataToString({
          fontSize: '14px',
        }),
      },
    },
    calendar: {},
  },
  editTemplate: false,
  isLoadingTemplate: false,
  isSuccess: false,
  isValidCalendar: false,
  isValidConfirm: false,
  isErrorForm: false,
  idEdit: '',
  userId: '',
  listValidError: {
    nameCalendar: {
      isValid: false,
      message: '必須項目を入力してください。',
    },
    backgroundImage: {
      isValid: false,
      message: '必須項目を入力してください。',
    },
    descriptionCalendar: {
      isValid: false,
      message: '必須項目を入力してください。',
    },
    calendar: {
      isValid: false,
      message: '必須項目を入力してください。',
    },
  },
  listQuestion: DEFAULT_LIST_INPUT,
  listAnswers: [],
  lastPage: 1,
  templateActive: SETTING_TEMPLATE.buttonEmbedTemplate,
  totalCount: 0,
  policy: null,
  policies: [],
  policyDelete: [],
  questionDelete: [],
  questionSelected: {},
  optionSelected: '',
};

export default {
  namespace: 'SETTING_TEMPLATE',
  state: deepCopyData(initState),
  reducers: {
    updateErrorForm(state, action) {
      return update(state, {
        isErrorForm: { $set: action.payload.value },
      });
    },
    // * START nav to list
    updateListCheckbox(state, action) {
      const { keyId, contents } = action.payload;
      const list = state.listQuestion || [];
      const { questionSelected } = state;
      const indexOfQuestion = list.findIndex(i => i.key_id === keyId);
      if (
        indexOfQuestion > -1 &&
        list[indexOfQuestion].type === INPUT_TYPE.checkbox
      ) {
        return update(state, {
          listQuestion: {
            [indexOfQuestion]: {
              contents: { $set: contents },
            },
          },
          questionSelected: {
            contents: { $set: contents },
          },
        });
      }

      return state;
    },
    updateTitleOrPlaceholder(state, action) {
      const { keyId, fieldValue, fieldName } = action.payload;
      const list = state.listQuestion || [];
      const indexOfQuestion = list.findIndex(i => i.key_id === keyId);
      if (indexOfQuestion > -1) {
        return update(state, {
          listQuestion: {
            [indexOfQuestion]: {
              [fieldName]: { $set: fieldValue },
            },
          },
          questionSelected: {
            [fieldName]: { $set: fieldValue },
          },
        });
      }

      return state;
    },
    // * END nav to list

    // * START list to nav
    onChangeDataInput(state, action) {
      const { keyId, keyName, value, typeInput } = action.payload;
      const list = state.listQuestion || [];
      const indexOfQuestion = list.findIndex(i => i.key_id === keyId);
      if (indexOfQuestion > -1 && list[indexOfQuestion].type === typeInput) {
        return update(state, {
          listQuestion: {
            [indexOfQuestion]: {
              [keyName]: { $set: value },
            },
          },
          questionSelected: {
            [keyName]: { $set: value },
          },
        });
      }

      return state;
    },
    onChangePlaceholderOrTitle(state, action) {
      const { keyId, keyName, value } = action.payload;
      const list = state.listQuestion || [];
      const indexOfQuestion = list.findIndex(i => i.key_id === keyId);
      if (
        indexOfQuestion > -1 &&
        list[indexOfQuestion].type === INPUT_TYPE.text
      ) {
        return update(state, {
          listQuestion: {
            [indexOfQuestion]: {
              [keyName]: { $set: value },
            },
          },
          questionSelected: {
            [keyName]: { $set: value },
          },
        });
      }

      return state;
    },
    onChangeTitleCheckbox(state, action) {
      const { keyId, keyName, value } = action.payload;
      const list = state.listQuestion || [];
      const indexOfQuestion = list.findIndex(i => i.key_id === keyId);
      if (
        indexOfQuestion > -1 &&
        list[indexOfQuestion].type === INPUT_TYPE.checkbox
      ) {
        return update(state, {
          listQuestion: {
            [indexOfQuestion]: {
              [keyName]: { $set: value },
            },
          },
          questionSelected: {
            [keyName]: { $set: value },
          },
        });
      }

      return state;
    },
    onChangeNote(state, action) {
      const { keyId, value } = action.payload;
      const list = state.listQuestion || [];
      const indexOfQuestion = list.findIndex(i => i.key_id === keyId);
      if (
        indexOfQuestion > -1 &&
        list[indexOfQuestion].type === INPUT_TYPE.policy
      ) {
        return update(state, {
          listQuestion: {
            [indexOfQuestion]: {
              content: { $set: value },
            },
          },
          questionSelected: {
            content: { $set: value },
          },
        });
      }

      return state;
    },
    // * END list to nav
    getAnswersSuccess(state, action) {
      return update(state, {
        listAnswers: { $set: action.payload.items },
        currentPage: { $set: action.payload.page },
        lastPage: { $set: action.payload.lastPage },
        totalCount: { $set: action.payload.totalCount },
      });
    },
    resetStore(state, action) {
      return update(state, {
        questionSelected: { $set: {} },
      });
    },
    updateQuestion(state, action) {
      const { keyId, name, placeholder, status } = action.payload;
      const list = state.listQuestion || [];
      const indexOfQuestion = list.findIndex(i => i.key_id === keyId);
      if (indexOfQuestion > -1) {
        return update(state, {
          listQuestion: {
            [indexOfQuestion]: {
              question_name: { $set: name },
              placeholder: { $set: placeholder },
              status: { $set: status ? 1 : 0 },
            },
          },
          questionSelected: { $set: null },
        });
      }
      return state;
    },
    updateCheckBox(state, action) {
      const { key_id } = action.payload;
      const list = state.listQuestion || [];

      const indexOfQuestion = list.findIndex(i => i.key_id === key_id);
      if (indexOfQuestion > -1) {
        return update(state, {
          listQuestion: {
            [indexOfQuestion]: {
              $set: action.payload,
            },
          },
          questionSelected: { $set: null },
        });
      }
      return state;
    },
    updatePolicy(state, action) {
      const {
        keyId,
        content,
        link,
        note,
        text_require,
        title,
        checkbox,
      } = action.payload;
      const list = state.listQuestion || [];
      const indexOfQuestion = list.findIndex(i => i.key_id === keyId);
      if (indexOfQuestion > -1) {
        return update(state, {
          listQuestion: {
            [indexOfQuestion]: {
              content: { $set: content },
              link: { $set: link },
              note: { $set: note },
              text_require: { $set: text_require },
              title: { $set: title },
              checkbox: { $set: checkbox },
            },
          },
          questionSelected: { $set: null },
        });
      }
      return state;
    },
    moveQuestion(state, action) {
      const { keyId, direction } = action.payload;
      const list = state.listQuestion || [];
      const indexOfItem = list.findIndex(i => i.key_id === keyId);
      if (
        indexOfItem === -1 ||
        (indexOfItem === 0 && direction === 'up') ||
        (indexOfItem === list.length - 1 && direction === 'down')
      ) {
        return state;
      }
      let newList = [];
      if (direction === 'up') {
        const firstPart = list.slice(0, indexOfItem - 1);
        const lastPart = list.slice(indexOfItem + 1);
        newList = [
          ...firstPart,
          list[indexOfItem],
          list[indexOfItem - 1],
          ...lastPart,
        ];
      } else {
        const firstPart = list.slice(0, indexOfItem);
        const lastPart = list.slice(indexOfItem + 2);
        newList = [
          ...firstPart,
          list[indexOfItem + 1],
          list[indexOfItem],
          ...lastPart,
        ];
      }
      return update(state, {
        listQuestion: { $set: newList },
      });
    },
    selectQuestion(state, action) {
      const { keyId } = action.payload;
      // check navigator don't have empty input
      if (state.isErrorForm) {
        notifyMessage([
          '未入力の項目があるため、入力後に',
          '「保存」をクリックください。',
        ]);
        return state;
      }

      const listQuestion = state.listQuestion || [];
      const indexOfQuestion = listQuestion.findIndex(q => q.key_id === keyId);
      if (indexOfQuestion > -1) {
        return update(state, {
          questionSelected: { $set: listQuestion[indexOfQuestion] },
        });
      }
      return state;
    },
    deleteQuestion(state, action) {
      const { keyId } = action.payload;
      const listQuestion = state.listQuestion || [];
      const indexOfQuestion = listQuestion.findIndex(q => q.key_id === keyId);
      if (indexOfQuestion > -1) {
        if (listQuestion[indexOfQuestion].type === INPUT_TYPE.policy) {
          return update(state, {
            listQuestion: { $splice: [[indexOfQuestion, 1]] },
            policyDelete: { $push: [listQuestion[indexOfQuestion]] },
            questionSelected: { $set: null },
          });
        }

        if (listQuestion[indexOfQuestion].type === INPUT_TYPE.text) {
          return update(state, {
            listQuestion: { $splice: [[indexOfQuestion, 1]] },
            questionDelete: { $push: [listQuestion[indexOfQuestion]] },
            questionSelected: { $set: null },
          });
        }

        if (listQuestion[indexOfQuestion].type === INPUT_TYPE.checkbox) {
          return update(state, {
            listQuestion: { $splice: [[indexOfQuestion, 1]] },
            questionDelete: { $push: [listQuestion[indexOfQuestion]] },
            questionSelected: { $set: null },
          });
        }

        return update(state, {
          listQuestion: { $splice: [[indexOfQuestion, 1]] },
          questionSelected: { $set: null },
        });
      }
      return state;
    },
    cancelSelectQuestion(state, action) {
      return update(state, {
        questionSelected: { $set: null },
      });
    },
    addQuestion(state, action) {
      const { type } = action.payload;
      let newInput = { index: state.listQuestion.length };
      if (type === INPUT_TYPE.text) {
        const defaultInput = deepCopyData(DEFAULT_INPUT_TEXT);
        newInput = {
          ...defaultInput,
          key_id: uuid(),
          type: INPUT_TYPE.text,
        };
      } else if (type === INPUT_TYPE.checkbox) {
        const defaultInput = deepCopyData(DEFAULT_INPUT_CHECKBOX);
        newInput = {
          ...defaultInput,
          key_id: uuid(),
          type: INPUT_TYPE.checkbox,
        };
      } else {
        const defaultInput = deepCopyData(DEFAULT_POLICY);
        newInput = newInput = {
          ...defaultInput,
          key_id: uuid(),
          type: INPUT_TYPE.policy,
        };
      }
      return update(state, {
        listQuestion: { $push: [newInput] },
        addInputQuestion: { $set: true },
        questionSelected: { $set: newInput },
      });
    },
    clearAddQuestion(state, action) {
      return update(state, {
        addInputQuestion: { $set: false },
      });
    },
    buttonTemplateActive(state, action) {
      return {
        ...state,
        templateActive: SETTING_TEMPLATE.buttonEmbedTemplate,
      };
    },
    calendarTemplateActive(state, action) {
      return {
        ...state,
        templateActive: SETTING_TEMPLATE.calendarTemplate,
      };
    },
    confirmTemplateActive(state, action) {
      return {
        ...state,
        templateActive: SETTING_TEMPLATE.confirmTemplate,
      };
    },
    onActiveTemplate(state, action) {
      const { payload } = action;
      return {
        ...state,
        templateActive: payload,
      };
    },
    updateDataCalendarTemplate(state, action) {
      const { dataCalendarTemplate } = state;
      const { key, value } = action.payload;
      return {
        ...state,
        dataCalendarTemplate: {
          ...dataCalendarTemplate,
          [key]: value,
        },
      };
    },
    updateButtonEmbedTemplate(state, action) {
      const { payload } = action;
      return {
        ...state,
        dataButtonEmbedTemplate: payload,
      };
    },
    reset(state, action) {
      const { payload } = action;
      let dataInit = deepCopyData(initState);
      if (payload) {
        dataInit = { ...dataInit, ...payload };
      }
      return dataInit;
    },
    setDataViewTemplate(state, action) {
      const { payload } = action;
      return {
        ...state,
        dataViewTemplate: payload,
      };
    },
    setLoading(state, action) {
      const { payload } = action;
      return {
        ...state,
        isLoadingTemplate: payload,
      };
    },
    setIsSuccess(state, action) {
      const { isSuccess } = action.payload;
      return {
        ...state,
        isSuccess,
      };
    },
    setKeyValid(state, action) {
      const { payload } = action;
      return {
        ...state,
        listValidError: {
          ...state.listValidError,
          ...payload,
        },
      };
    },
    setDataEdit(state, action) {
      const { payload } = action;
      return {
        ...state,
        ...payload,
      };
    },
    setOptionSelected(state, action) {
      const { payload } = action;
      return {
        ...state,
        optionSelected: payload,
      };
    },
  },
  effects: {
    *deleteTemplate(action, { put }) {
      try {
        yield put({
          type: 'setLoading',
          payload: true,
        });
        const res = yield SettingTemplateRequest.deleteTemplateSetting();
        const { status, body } = res;
        if (status === 200) {
          const { status } = body;
          notify(status.message);
        }
      } catch (e) {
        console.log('error', e);
      } finally {
        yield put({
          type: 'setLoading',
          payload: false,
        });
      }
    },
    *getAnswers(action, { put }) {
      try {
        yield put({
          type: 'setLoading',
          payload: true,
        });

        const { id, data } = action.payload;
        const response = yield EventRequest.getAnswers(id, data);
        let items = [];
        const { statusCode, body } = response;

        if (statusCode === 200) {
          if (body?.result?.data?.length > 0) {
            items = body.result.data.map(item =>
              handlePrepareAnswer(item.id, item.answers || [], item.created_at),
            );
            const { current_page, last_page, total } = body.result;
            yield put({
              type: 'getAnswersSuccess',
              payload: {
                items,
                page: current_page,
                lastPage: last_page,
                totalCount: total,
              },
            });
          }
        } else {
        }
      } catch (error) {
      } finally {
        yield put({
          type: 'setLoading',
          payload: false,
        });
      }
    },
    *getDataViewTemplate(action, { put }) {
      try {
        yield put({
          type: 'setLoading',
          payload: true,
        });

        const response = yield SettingTemplateRequest.getViewTemplate();
        const { status, body } = response;
        if (status === 200) {
          const { status, result } = body;
          if (status.code !== 'F00') {
            notify(status.message);
            return false;
          }
          yield put({
            type: 'setDataViewTemplate',
            payload: result,
          });
          return true;
        }
        return false;
      } catch (error) {
        return false;
      } finally {
        yield put({
          type: 'setLoading',
          payload: false,
        });
      }
    },
    *onSubmitData(action, { call, put }) {
      const { data, callback } = action.payload;
      try {
        yield put({
          type: 'setLoading',
          payload: true,
        });
        let res;
        if (!data?.id) {
          res = yield SettingTemplateRequest.createTemplateSetting(data);
        }
        if (data?.id) {
          res = yield SettingTemplateRequest.updateTemplateSetting(data);
        }
        const { status, body } = res;
        if (status === 201 || status === 200) {
          callback(body.result.id);
        }
      } catch (e) {
        if (e.response.status === UNPROCESSABLE_ENTITY_STATUS) {
          notify([
            '未入力の項目があるため、入力後に\n',
            '「次へ」をクリックください。',
          ]);
        } else {
          notify(e.response?.body?.message || 'error');
        }
      } finally {
        yield put({
          type: 'setLoading',
          payload: false,
        });
      }
    },
    *loadDataByUser(action, { call, put }) {
      const { typeButtonEmbed } = action.payload;
      try {
        yield put({
          type: 'setLoading',
          payload: true,
        });
        const res = yield SettingTemplateRequest.getTemplateSetting();
        const { body, status } = res;
        if (status === 200) {
          const { result } = body;
          if (objValid(result)) {
            const { id, user_id, buttonEmbed, calendar, confirm } = result;
            const { listInput, policies, policy_checkbox, ...rest } = confirm;
            const addKeyId = listInput.map(item => {
              const { contents } = item;
              if (contents && contents.length > 0) {
                item.contents = contents.map(item => ({
                  ...item,
                  key_id: uuid(),
                }));
              }
              return {
                ...item,
                key_id: uuid(),
              };
            });

            const policiesWithKeyId = policies.map(p => ({
              ...p,
              key_id: uuid(),
              type: INPUT_TYPE.policy,
            }));

            let data = {
              idEdit: id,
              userId: user_id,
              listQuestion: sortData([...addKeyId, ...policiesWithKeyId]),
              dataCalendarTemplate: {
                ...calendar,
                hideTitleCalendar: !!calendar.hideTitleCalendar,
                backgroundImage: {
                  files: calendar.backgroundImage.files,
                  urlImage:
                    config.API_DOMAIN +
                    '/storage/' +
                    calendar.backgroundImage.files,
                },
              },
            };

            if (policy_checkbox !== 1) {
              data.policy = {
                ...rest,
                policy_checkbox,
              };
            }
            if (buttonEmbed && result.status === Number(typeButtonEmbed)) {
              data.dataButtonEmbedTemplate = buttonEmbed;
            }

            const resEvent = yield EventRequest.checkEventCode({
              event_code: calendar?.calendar?.event_code,
              user_code: calendar?.calendar?.user_code,
            });
            const { status, body } = resEvent;

            if (status && body?.data) {
              data.dataCalendarTemplate.calendar = {
                ...body?.data,
                user_code: calendar?.calendar?.user_code,
              };
            }
            yield put({
              type: 'setDataEdit',
              payload: data,
            });
            return true;
          }
          return false;
        }
        return false;
      } catch (e) {
      } finally {
        yield put({
          type: 'setLoading',
          payload: false,
        });
      }
    },
    *loadTemplateGuest(action, { call, put }) {
      const { payload } = action;
      let isValid = false;
      try {
        yield put({
          type: 'setLoading',
          payload: true,
        });
        const res = yield SettingTemplateRequest.getTemplateGuest(payload);
        const { status, body } = res;
        if (status === 200) {
          const { result } = body;
          if (objValid(result)) {
            const { id, calendar, confirm } = result;
            const { listInput, policies, ...rest } = confirm;
            const addKeyId = listInput.map(item => {
              const { contents } = item;
              if (contents && contents.length > 0) {
                item.contents = contents.map(item => ({
                  ...item,
                  key_id: uuid(),
                }));
              }
              return {
                ...item,
                key_id: uuid(),
              };
            });

            const policiesWithKeyId = policies.map(p => ({
              ...p,
              key_id: uuid(),
              type: INPUT_TYPE.policy,
            }));

            let data = {
              idEdit: id,
              listQuestion: sortData([...addKeyId, ...policiesWithKeyId]),
              dataCalendarTemplate: {
                ...calendar,
                hideTitleCalendar: !!calendar.hideTitleCalendar,
                backgroundImage: {
                  files: calendar.backgroundImage.files,
                  urlImage:
                    config.API_DOMAIN +
                    '/storage/' +
                    calendar.backgroundImage.files,
                },
              },
            };
            yield put({
              type: 'setDataEdit',
              payload: data,
            });
            return {
              ...result,
              isValid: true,
            };
          }
          return {
            isValid: false,
          };
        }
      } catch (e) {
        console.log('e', e.response);
        return {
          status: e.response.status,
          isValid: isValid,
        };
      } finally {
        yield put({
          type: 'setLoading',
          payload: false,
        });
      }
    },
    *updateDataButtonEmbedTemplate(action, { put }) {
      const { data, keyNext } = action.payload;
      yield put({
        type: 'updateButtonEmbedTemplate',
        payload: data,
      });
      yield put({
        type: 'onActiveTemplate',
        payload: STEP_NEXT_SETTING_TEMPLATE[keyNext],
      });
    },
    *onSubmitDataEmbed(action, { call, put }) {
      const { data, func } = action.payload;

      try {
        yield put({
          type: 'setLoading',
          payload: true,
        });
        yield put({
          type: 'setIsSuccess',
          payload: {
            isSuccess: false,
          },
        });
        let res = yield SettingTemplateRequest.createAnswerTemplate(data);
        const { status, body } = res;
        if (status === 201) {
          yield put({
            type: 'setIsSuccess',
            payload: {
              isSuccess: true,
            },
          });
        }
      } catch (e) {
        notify(
          e.response.body.status.message,
          null,
          'error',
          e.response.body.status.code,
          func,
        );
      } finally {
        yield put({
          type: 'setLoading',
          payload: false,
        });
      }
    },
  },
};

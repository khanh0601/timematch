import PaymentRequest from '../services/paymentRequest.js';
import { message as showMessage } from 'antd';
import { history } from 'umi';
import { notify, setCookie } from '../commons/function.js';

const initPaymentInfo = {
  quantity: 1,
  contractId: 1,
};

export default {
  namespace: 'PAYMENT',
  state: {
    paymentInfo: initPaymentInfo,
    contracts: [],
    contractDetail: {},
  },
  reducers: {
    updatePaymentInfoSuccess(state, action) {
      return {
        ...state,
        paymentInfo: {
          ...state.paymentInfo,
          ...action.payload,
        },
      };
    },
    setContractsSuccess(state, action) {
      return {
        ...state,
        contracts: action.payload,
      };
    },
    getContractDetailSuccess(state, action) {
      return {
        ...state,
        contractDetail: action.payload,
      };
    },
  },
  effects: {
    *updatePaymentInfo(action, { put }) {
      yield put({ type: 'updatePaymentInfoSuccess', payload: action.payload });
    },
    *getContracts(action, { put }) {
      try {
        const { body } = yield PaymentRequest.getContracts(action.payload);
        if (body.status) {
          yield put({ type: 'setContractsSuccess', payload: body.data });
        }
      } catch (error) {}
    },
    *createTransaction(action, { put }) {
      const { reqBody, loadingFunc, createTransFunc } = action.payload;
      loadingFunc(true);
      try {
        const { status } = yield PaymentRequest.createTransactions(reqBody);
        if (status) {
          createTransFunc(status);
        }
      } catch (error) {
        const { body } = error.response;
        const { data } = body;
        notify(data);
      }
      loadingFunc(false);
    },
    *changeCard(action) {
      const { reqBody, setLoadingButton, formatMessage } = action.payload;
      setLoadingButton(true);
      try {
        const { body } = yield PaymentRequest.changeCard(reqBody);
        const { status } = body;
        if (status) {
          showMessage.success(
            formatMessage({ id: 'i18n_change_payment_card_success' }),
          );
          history.push('/contract-detail');
        }
      } catch (error) {
        const { body } = error.response;
        const { data } = body;
        notify(data);
      }
      setLoadingButton(false);
    },
    *getContractDetail(action, { put }) {
      const { setLoading } = action.payload;
      setLoading(true);
      try {
        const { body } = yield PaymentRequest.getListTransaction();
        const { data, status } = body;
        if (status) {
          localStorage.setItem('subId', data.subscription_id);
          yield put({ type: 'getContractDetailSuccess', payload: data });
        }
      } catch (error) {}
      setLoading(false);
    },
    *sendContactInvoice(action, { put }) {
      const { setLoading, reqBody, setInvoiceSuccess } = action.payload;
      setLoading(true);
      try {
        const { body } = yield PaymentRequest.sendContactInvoice(reqBody);
        const { status } = body;
        if (status) {
          setInvoiceSuccess(true);
        }
      } catch (error) {
        const { body } = error.response;
        const { data } = body;
        notify(data);
      }
      setLoading(false);
    },
    *sendContactEmail(action, { put }) {
      const { setLoading, reqBody } = action.payload;
      setLoading(true);
      try {
        const { body } = yield PaymentRequest.sendContactEmail(reqBody);
        const { status } = body;
        if (status) {
          showMessage.success('送信しました。');
        }
      } catch (error) {
        const { body } = error.response;
        const { data } = body;
        notify(data);
      }
      setLoading(false);
    },
    *changeTypePayment(action) {
      const { reqBody, setLoading, changePaymentSuccess } = action.payload;
      setLoading(true);
      try {
        const { status } = yield PaymentRequest.changeTypePayment(reqBody);
        if (status) {
          changePaymentSuccess(status);
        }
      } catch (error) {
        const { body } = error.response;
        const { data } = body;
        notify(data);
      }
      setLoading(false);
    },
    *changePlanCreditCard(action) {
      const { reqBody, setLoading, createTransFunc } = action.payload;
      setLoading(true);
      try {
        const { status } = yield PaymentRequest.changePlanCreditCard(reqBody);
        if (status) {
          createTransFunc(status);
        }
      } catch (error) {
        const { body } = error.response;
        const { data } = body;
        notify(data);
      }
      setLoading(false);
    },
  },
};

import React, { useState } from 'react';
import styles from '../styles.less';
import { useIntl, withRouter, useHistory } from 'umi';
import { Button, Input, Form } from 'antd';
import { connect } from 'dva';
import Footer from '@/components/Footer';
import { TYPE_INVOICE } from '@/constant';
import config from '../../../config';

const { TextArea } = Input;
function Invoice(props) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const { dispatch, setInvoiceSuccess, paymentStore, location } = props;
  const { query } = location;
  const { contractDetail } = paymentStore;
  const { type_payment } = contractDetail;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSubmitForm = values => {
    const reqBody = {
      email: values.email,
      name: values.userName,
      phone: values.phoneNumber,
      company: values.companyName,
      description: values.contentInquiry,
    };
    if (!type_payment || query.sendContact === 'invoice') {
      dispatch({
        type: 'PAYMENT/sendContactInvoice',
        payload: { reqBody, setLoading, setInvoiceSuccess },
      });
    } else {
      reqBody.type_payment = TYPE_INVOICE;
      dispatch({
        type: 'PAYMENT/changeTypePayment',
        payload: {
          reqBody,
          setLoading,
          changePaymentSuccess: setInvoiceSuccess,
        },
      });
    }
  };
  return (
    <div>
      <div className={styles.invoice}>
        <div className={styles.title}>
          {formatMessage({ id: 'i18n_invoice_description_title' })}
        </div>
        <div className={styles.link}>
          <a href={config.URL_COMPANY}>{config.URL_COMPANY}</a>
        </div>
        <div className={styles.description}>
          <div className={styles.descriptionLeft}>
            {formatMessage({ id: 'i18n_invoice_payment' })}
          </div>
          <div>
            <div>{formatMessage({ id: 'i18n_invoice_payment_1' })}</div>
            <div>{formatMessage({ id: 'i18n_invoice_payment_2' })}</div>
            <div>{formatMessage({ id: 'i18n_invoice_payment_3' })}</div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default connect(({ PAYMENT }) => ({ paymentStore: PAYMENT }))(
  withRouter(Invoice),
);

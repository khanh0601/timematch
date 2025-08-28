import React, { useState } from 'react';
import styles from './styles.less';
import { useIntl, history } from 'umi';
import { Button, Input, Form } from 'antd';
import { connect } from 'dva';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

function SendContactEmail(props) {
  const { TextArea } = Input;
  const intl = useIntl();
  const { formatMessage } = intl;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { dispatch, setInvoiceSuccess } = props;

  const handleSubmitForm = values => {
    const reqBody = {
      email: values.email,
      name: values.userName,
      phone: values.phoneNumber,
      company: values.companyName,
      description: values.contentInquiry,
    };
    dispatch({
      type: 'PAYMENT/sendContactEmail',
      payload: { reqBody, setLoading },
    });
  };

  return (
    <div>
      <Header />
      <div className={styles.sendContactEmail}>
        <div className={styles.numberAccountContent}>
          <div className={styles.numberAccountBorder}></div>
          <div className={styles.numberAccountTitle}>
            {formatMessage({ id: 'i18n_inquiry_form' })}
          </div>
        </div>
        <Form form={form} onFinish={handleSubmitForm}>
          <Form.Item
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'i18n_required_text' }),
              },
            ]}
            name={'userName'}
            className={styles.formItem}
          >
            <div>
              <label className={styles.label}>
                {formatMessage({ id: 'i18n_label_name' })}
                <span className={styles.required}>
                  {formatMessage({ id: 'i18n_required' })}
                </span>
              </label>
              <Input
                className={styles.input}
                placeholder={formatMessage({
                  id: 'i18n_name_placeholder',
                })}
              />
            </div>
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'i18n_required_text' }),
              },
              {
                type: 'email',
                message: formatMessage({ id: 'i18n_invalid_email' }),
              },
            ]}
            name={'email'}
            className={styles.formItem}
          >
            <div>
              <label className={styles.label}>
                {formatMessage({ id: 'i18n_email' })}
                <span className={styles.required}>
                  {formatMessage({ id: 'i18n_required' })}
                </span>
              </label>
              <Input
                className={styles.input}
                placeholder={formatMessage({
                  id: 'i18n_email_placeholder',
                })}
              />
            </div>
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'i18n_required_text' }),
              },
              {
                pattern: '^[0-9]*$',
                message: formatMessage({
                  id: 'i18n_invalid_phone_number',
                }),
              },
            ]}
            name={'phoneNumber'}
            className={styles.formItem}
          >
            <div>
              <label className={styles.label}>
                {formatMessage({ id: 'i18n_phone_number' })}
                <span className={styles.required}>
                  {formatMessage({ id: 'i18n_required' })}
                </span>
              </label>
              <Input
                className={styles.input}
                placeholder={formatMessage({
                  id: 'i18n_phone_number_placeholder',
                })}
              />
            </div>
          </Form.Item>
          <Form.Item name={'companyName'} className={styles.formItem}>
            <div>
              <label className={styles.label}>
                {formatMessage({ id: 'i18n_company_name' })}
              </label>
              <Input
                className={styles.input}
                placeholder={formatMessage({
                  id: 'i18n_company_name_placeholder',
                })}
              />
            </div>
          </Form.Item>
          <Form.Item name={'contentInquiry'} className={styles.formItem}>
            <div>
              <label className={styles.label}>
                {formatMessage({ id: 'i18n_content_inquiry' })}
              </label>
              <TextArea
                className={styles.textarea}
                placeholder={formatMessage({
                  id: 'i18n_content_inquiry_placeholder',
                })}
              />
            </div>
          </Form.Item>
          <Form.Item>
            <div className={styles.paymentBtnGroup}>
              <Button
                disabled={loading}
                className={`btn btn-white__shadow btn-custom-height`}
                onClick={() => history.push('/')}
              >
                {formatMessage({ id: 'i18n_back_to_homepage' })}
              </Button>
              <Button
                htmlType="submit"
                loading={loading}
                className={`btn btnGreen btn-custom-height`}
              >
                {formatMessage({ id: 'i18n_send' })}
              </Button>
            </div>
          </Form.Item>
        </Form>
        <Footer />
      </div>
    </div>
  );
}

export default connect(({ PAYMENT }) => ({ paymentStore: PAYMENT }))(
  SendContactEmail,
);

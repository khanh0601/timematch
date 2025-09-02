import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { Form, Input, Button, Checkbox } from 'antd';
import { formatMessage, useIntl } from 'umi';
import { Link } from 'umi';
import { useState, useEffect } from 'react';
import styles from './styles.less';
import { connect } from 'dva';
import { withRouter } from 'umi';
import {
  meetingMethod,
  getJPFullDate,
  getStep,
  createTimeAsync,
  profileFromStorage,
  tz,
} from '@/commons/function.js';
import { notify } from '../../commons/function';
const AppointmentSelectionForm = props => {
  const intl = useIntl();
  const { eventStore, masterStore, dispatch } = props;
  const [form] = Form.useForm();
  const [savePolicy, setSavePolicy] = useState(false);
  const [loading, setLoading] = useState(false);
  const { profile } = masterStore;
  const onCheck = event => {
    setSavePolicy(event.target.checked);
  };

  const getData = async () => {
    const profile = profileFromStorage();
    const payload = {
      vote: history.location.query.id,
      user_code: profile ? profile.code : '',
      type: 2, // screen B
    };
    const payloadShow = {
      id: history.location.query.id,
    };
    if (history.location.query.name) {
      payloadShow.name = history.location.query.name;
    } else if (history.location.query.invitee) {
      payloadShow.invitee = history.location.query.invitee;
    } else if (history.location.query.code) {
      payloadShow.code = history.location.query.code;
    }
    await dispatch({ type: 'VOTE/getVoteShow', payload: payloadShow });
    const { startTime, endTime } = createTimeAsync();
    await dispatch({
      type: 'VOTE/getVoteGuestSummary',
      payload: {
        ...payload,
        start: startTime,
        end: endTime,
        timeZone: tz(),
      },
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const onSubmit = async value => {
    setLoading(true);
    let finalListInvitee = [];

    const info = {
      name: form.getFieldValue('name'),
      confirm_email: form.getFieldValue('email') ?? null,
      company: form.getFieldValue('companyName') ?? null,
      role: form.getFieldValue('role') ?? null,
      comment: history.location.state.comment ?? null,
      guests: finalListInvitee,
    };

    const payload = {
      id: history.location.query.id,
      name: history.location.query.name || null,
      invitee: history.location.query.invitee || null,
      code: history.location.query.code || null,
      choices: history.location.state.choices.map(item => ({
        event_datetime_id: item.id,
        option: item.isOk === true ? 1 : 2,
      })),
      information: info,
      time_zone: tz(),
      user_code: profile ? profile.code : null,
    };
    const res = await dispatch({
      type: 'VOTE/postVoteGuestConfirm',
      payload,
    });
    if (!res?.result?.result) return;
    console.log('>>> history form: ', history);
    history.push(
      `/appointment-selection-completed?id=${history.location.query.id}&name=${history.location.query.name}`,
      {
        information: info,
        choices: history.location.state.choices.map(item => ({
          event_datetime_id: item.id,
          option: item.isOk === true ? 1 : 2,
        })),
        comment: history.location.state?.comment,
      },
    );
    setLoading(false);
  };

  return (
    <div className={styles.appointmentSelectionConfirmContainer}>
      <div
        style={{
          padding: 10,
        }}
      >
        {' '}
        <div style={{ marginBottom: 20, textAlign: 'center' }}>
          ご自身のお名前、メールアドレスをご登録ください。
        </div>
        <Form onFinish={onSubmit} form={form}>
          <div className={styles.inputField}>
            <div className={styles.fieldLabel}>
              {formatMessage({ id: 'i18n_full_name' })}
              <span className={styles.inputRequired}>
                【{formatMessage({ id: 'i18n_required' })}】
              </span>
            </div>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'i18n_required_text' }),
                },
                {
                  type: 'text',
                  message: intl.formatMessage({
                    id: 'i18n_email_error_notice',
                  }),
                },
              ]}
              name={'name'}
            >
              <Input
                className={styles.inputField}
                placeholder={formatMessage({ id: 'i18n_full_name' })}
                autoComplete="on"
              />
            </Form.Item>
          </div>
          <div className={styles.inputField}>
            <div className={styles.fieldLabel}>
              {formatMessage({ id: 'i18n_company_name' })}
            </div>
            <Form.Item name={'companyName'}>
              <Input
                className={styles.inputField}
                placeholder={formatMessage({ id: 'i18n_company_name' })}
                autoComplete="on"
              />
            </Form.Item>
          </div>
          <div className={styles.inputField}>
            <div className={styles.fieldLabel}>
              {formatMessage({ id: 'i18n_role' })}
            </div>
            <Form.Item name={'role'}>
              <Input
                className={styles.inputField}
                placeholder={formatMessage({ id: 'i18n_role' })}
                autoComplete="on"
              />
            </Form.Item>
          </div>
          <div className={styles.inputField}>
            <div className={styles.fieldLabel}>
              {formatMessage({ id: 'i18n_appointment_send_to_email' })}
            </div>
            <Form.Item
              rules={[
                {
                  required: false,
                  message: formatMessage({ id: 'i18n_required_text' }),
                },
                {
                  type: 'email',
                  message: intl.formatMessage({
                    id: 'i18n_email_error_notice',
                  }),
                },
              ]}
              name={'email'}
            >
              <Input
                className={styles.inputField}
                placeholder={formatMessage({ id: 'i18n_email' })}
                autoComplete="on"
              />
            </Form.Item>
          </div>
          <div className={styles.btnZone}>
            <Button
              className={`${styles.confirmBtn} ${styles.bgDarkBlue} ${styles.textLightGray} ${styles.rounded} ${styles.shadowPrimary}`}
              loading={loading}
              htmlType="submit"
            >
              返信
            </Button>
            <Button
              className={`${styles.backBtn} ${styles.bgPrimaryBlue} ${styles.textLightGray} ${styles.rounded} ${styles.shadowPrimary}`}
              onClick={() => {
                history.go(-1);
              }}
            >
              日程選択へ戻る
            </Button>
          </div>
        </Form>
        <div
          style={{
            padding: 20,
            border: '1px solid #3a3a3a',
            borderRadius: 8,
          }}
        >
          <div style={{ textAlign: 'center' }}>
            新規会員登録・ログインいただくと、
            <br />
            あなたの予定が入っている箇所が表示され便利です。
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 20,
              marginTop: 20,
            }}
          >
            <div
              style={{
                width: '50%',
                textAlign: 'center',
                padding: 3,
              }}
              onClick={() => {
                history.push('/register');
              }}
              className={`${styles.bgPrimaryBlue} ${styles.textLightGray} ${styles.rounded} ${styles.shadowPrimary}`}
            >
              新規会員登録(無料)
            </div>
            <div
              style={{
                width: '50%',
                textAlign: 'center',
                padding: 3,
              }}
              onClick={() => {
                history.push('/login');
              }}
              className={`${styles.bgDarkBlue} ${styles.textLightGray} ${styles.rounded} ${styles.shadowPrimary}`}
            >
              ログイン
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default connect(({ EVENT, MASTER }) => ({
  eventStore: EVENT,
  masterStore: MASTER,
}))(withRouter(AppointmentSelectionForm));

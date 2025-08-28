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

  const onSubmit = async e => {
    setLoading(true);
    let finalListInvitee = [];
    await form
      .validateFields(['email', 'name'])
      .then(async value => {
        const info = {
          name: form.getFieldValue('name'),
          confirm_email: form.getFieldValue('email'),
          company: form.getFieldValue('companyName'),
          role: form.getFieldValue('role'),
          comment: history.location.state.comment,
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
      })
      .catch(err => {
        console.log('err', err);
      })
      .finally(() => {
        const info = {
          name: form.getFieldValue('name'),
          confirm_email: form.getFieldValue('email'),
          company: form.getFieldValue('companyName'),
          role: form.getFieldValue('role'),
          comment: history.location.state.comment,
          guests: finalListInvitee,
        };
        history.push(
          `/appointment-selection-completed?id=${history.location.query.id}&name=${history.location.query.name}`,
          {
            information: info,
            choices: history.location.state.choices.map(item => ({
              event_datetime_id: item.id,
              option: item.isOk === true ? 1 : 2,
              comment: history.location.state?.comment,
            })),
          },
        );
      });
    setLoading(false);
  };

  return (
    <div className={styles.appointmentSelectionConfirmContainer}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid darkblue',
          padding: 15,
        }}
      >
        <div></div>
        <div className={styles.header}>プロフィール</div>
        <div
          style={{
            width: 30,
            height: 30,
            background: 'dodgerblue',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
          }}
          onClick={() => history.go(-1)}
        >
          <CloseOutlined style={{ color: '#FFF' }} />
        </div>
      </div>
      <div
        style={{
          padding: 10,
        }}
      >
        {' '}
        <div style={{ marginBottom: 20 }}>
          ご自身のお名前、メールアドレスをご登録ください。
        </div>
        <Form form={form}>
          <div className={styles.inputField}>
            <div className={styles.fieldLabel}>
              氏名
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
                placeholder={''}
                autoComplete="on"
              />
            </Form.Item>
          </div>
          <div className={styles.inputField}>
            <div className={styles.fieldLabel}>会社名</div>
            <Form.Item name={'companyName'}>
              <Input
                className={styles.inputField}
                placeholder={'氏名'}
                autoComplete="on"
              />
            </Form.Item>
          </div>
          <div className={styles.inputField}>
            <div className={styles.fieldLabel}>役職</div>
            <Form.Item name={'role'}>
              <Input
                className={styles.inputField}
                placeholder={'会社名'}
                autoComplete="on"
              />
            </Form.Item>
          </div>
          <div className={styles.inputField}>
            <div className={styles.fieldLabel}>
              ご自身のメールにアドレスに日程を送る
            </div>
            <Form.Item
              rules={[
                {
                  required: true,
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
                placeholder={'メールアドレス'}
                autoComplete="on"
              />
            </Form.Item>
          </div>
          <div className={styles.btnZone}>
            <Button
              className={styles.confirmBtn}
              loading={loading}
              htmlType="submit"
              onClick={onSubmit}
            >
              返信
            </Button>
            <Button
              className={styles.backBtn}
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
                background: '#9db9fa',
                textAlign: 'center',
                padding: 8,
                color: 'white',
                borderRadius: 8,
              }}
              onClick={() => {
                history.push('/register');
              }}
            >
              新規会員登録(無料)
            </div>
            <div
              style={{
                width: '50%',
                background: '#004491',
                textAlign: 'center',
                padding: 8,
                color: 'white',
                borderRadius: 8,
              }}
              onClick={() => {
                history.push('/login');
              }}
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

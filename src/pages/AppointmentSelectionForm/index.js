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
      <div>
        <Form onFinish={onSubmit} form={form}>
          <div className={styles.inputField}>
            <div className={styles.fieldLabel}>
              氏名
              <span className={styles.inputRequired}>
                {formatMessage({ id: 'i18n_required' })}
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
                placeholder="例）時間 大浪"
                autoComplete="on"
              />
            </Form.Item>
          </div>
          <div className={styles.inputField}>
            <div className={styles.fieldLabel}>会社名</div>
            <Form.Item name={'companyName'}>
              <Input
                className={styles.inputField}
                placeholder="例）タイムマッチ"
                autoComplete="on"
              />
            </Form.Item>
          </div>
          <div className={styles.inputField}>
            <div className={styles.fieldLabel}>メモ</div>
            <Form.Item name={'role'}>
              <Input
                className={styles.inputField}
                placeholder="例）00時の「あ」MTG終わり次第参席予定"
                autoComplete="on"
              />
            </Form.Item>
          </div>
          {/* <div className={styles.inputField}>
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
          </div> */}
          <div className={styles.btnZone}>
            <Button
              className={`${styles.confirmBtn} `}
              loading={loading}
              htmlType="submit"
            >
              返信
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};
export default connect(({ EVENT, MASTER }) => ({
  eventStore: EVENT,
  masterStore: MASTER,
}))(withRouter(AppointmentSelectionForm));

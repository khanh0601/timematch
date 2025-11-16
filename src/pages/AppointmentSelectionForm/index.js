import React, { useState, useEffect } from 'react';
import { withRouter, history, useIntl } from 'umi';
import { Form, Input, Button } from 'antd';
import { connect } from 'dva';
import styles from './styles.less';
import { createTimeAsync, profileFromStorage, tz } from '@/commons/function.js';
import { notify } from '../../commons/function';
import useIsMobile from '@/hooks/useIsMobile';

const AppointmentSelectionForm = props => {
  const isMobile = useIsMobile();
  const intl = useIntl();
  const { masterStore, dispatch } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // ✅ LẤY DỮ LIỆU TỪ PARENT (KHÔNG DÙNG history.location.state/query NỮA)
  const {
    eventId,
    eventName,
    invitee,
    code,
    selectedChoices = [], // mảng [{ id, isOk, ... }]
    commentDraft = '', // optional
  } = props;

  const { profile } = masterStore;

  // ====== DATA FETCH (show vote info & summary) =================================
  const getData = async () => {
    const profileLocal = profileFromStorage();

    const payloadShow = { id: eventId };
    if (eventName) payloadShow.name = eventName;
    else if (invitee) payloadShow.invitee = invitee;
    else if (code) payloadShow.code = code;

    await dispatch({ type: 'VOTE/getVoteShow', payload: payloadShow });

    const { startTime, endTime } = createTimeAsync();
    await dispatch({
      type: 'VOTE/getVoteGuestSummary',
      payload: {
        vote: eventId,
        user_code: profileLocal ? profileLocal.code : '',
        type: 2, // screen B
        start: startTime,
        end: endTime,
        timeZone: tz(),
      },
    });
  };

  useEffect(() => {
    if (eventId) getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, eventName, invitee, code]);

  // ====== SUBMIT ================================================================
  const onSubmit = async () => {
    setLoading(true);

    // Guard: bắt buộc có ít nhất 1 lựa chọn
    if (!Array.isArray(selectedChoices) || selectedChoices.length === 0) {
      notify?.(
        'error',
        'Vui lòng chọn ít nhất một khung thời gian trước khi gửi.',
      );
      setLoading(false);
      return;
    }

    const info = {
      name: form.getFieldValue('name'),
      confirm_email: form.getFieldValue('email') ?? null,
      company: form.getFieldValue('companyName') ?? null,
      role: form.getFieldValue('role') ?? null,
      guests: [],
    };

    const payload = {
      id: eventId,
      name: eventName || null,
      invitee: invitee || null,
      code: code || null,
      choices: selectedChoices.map(item => ({
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

    if (!res?.result?.result) {
      setLoading(false);
      notify?.('error', 'Gửi phản hồi không thành công. Vui lòng thử lại.');
      return;
    }

    // Điều hướng sau submit (nếu vẫn dùng completed page)
    history.push(
      `/appointment-selection-completed?id=${eventId}&name=${eventName || ''}`,
      {
        information: info,
        choices: selectedChoices.map(item => ({
          event_datetime_id: item.id,
          option: item.isOk === true ? 1 : 2,
        })),
        comment: commentDraft,
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
                {intl.formatMessage({ id: 'i18n_required' })}
              </span>
            </div>
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'i18n_required_text' }),
                },
                // giữ rule type text cho đồng nhất UI (có thể bỏ)
                {
                  type: 'text',
                  message: intl.formatMessage({
                    id: 'i18n_email_error_notice',
                  }),
                },
              ]}
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
            <Form.Item name="companyName">
              <Input
                className={styles.inputField}
                placeholder="例）タイムマッチ"
                autoComplete="on"
              />
            </Form.Item>
          </div>

          <div className={styles.inputField}>
            <div className={styles.fieldLabel}>メモ</div>
            <Form.Item name="role">
              <Input
                className={styles.inputField}
                placeholder="例）00時の「あ」MTG終わり次第参席予定"
                autoComplete="on"
              />
            </Form.Item>
          </div>

          {/* Nếu muốn nhập email để nhận xác nhận:
          <div className={styles.inputField}>
            <div className={styles.fieldLabel}>
              {intl.formatMessage({ id: 'i18n_appointment_send_to_email' })}
            </div>
            <Form.Item
              name="email"
              rules={[
                { required: false, message: intl.formatMessage({ id: 'i18n_required_text' }) },
                { type: 'email', message: intl.formatMessage({ id: 'i18n_email_error_notice' }) },
              ]}
            >
              <Input
                className={styles.inputField}
                placeholder={intl.formatMessage({ id: 'i18n_email' })}
                autoComplete="on"
              />
            </Form.Item>
          </div>
          */}

          <div className={styles.btnZone}>
            <Button
              className={`${styles.confirmBtn}`}
              loading={loading}
              htmlType="submit"
            >
              返信
            </Button>
            {!profile?.id && isMobile ? (
              <Button
                className={`${styles.backBtn}`}
                loading={loading}
                onClick={() => history.goBack()}
              >
                戻る
              </Button>
            ) : null}
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

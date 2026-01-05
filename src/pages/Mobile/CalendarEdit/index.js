import React, { useEffect, useState, useRef } from 'react';
import { Button, Form, Input, Spin } from 'antd';
import { useIntl, useParams, useDispatch } from 'umi';
// components
import HeaderMobile from '@/components/Mobile/Header';
// icons
import iconCalendarClose from '@/assets/images/i-close-white.png';
import styles from './styles.less';
import iconTitle from '@/assets/images/i-title.png';
import iconMemo from '@/assets/images/i-memo.png';
import { connect } from 'dva';
import FooterMobile from '@/components/Mobile/Footer';
import PCHeader from '@/components/PC/Header';
import useIsPc from '@/hooks/useIsPc';
import { history } from 'umi';
function CalendarEdit(props) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const { id } = useParams();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const payload = { eventTypeId: id };
  const { eventStore, availableTime } = props;
  const { isLoading, dataCalendarSuccess } = eventStore;
  const { loading } = availableTime;

  const isPc = useIsPc();

  useEffect(() => {
    if (id) {
      dispatch({ type: 'EVENT/getDetailEventTypeMobile', payload });
    }
  }, [id]);

  // Before is data get detail event, set data to state and show popup
  useEffect(() => {
    if (Object.keys(dataCalendarSuccess).length) {
      form.setFieldsValue({
        calendar_title: dataCalendarSuccess.name,
        memo: dataCalendarSuccess.calendar_create_comment,
      });
    }
  }, [dataCalendarSuccess]);

  const handleCalendarCreation = () => {
    form.validateFields().then(values => {
      const payload = {
        title: values.calendar_title,
        memo: values.memo,
        eventTypeId: id,
      };
      dispatch({ type: 'EVENT/updateEventCalendarMobile', payload });
    });
  };

  return (
    <Spin spinning={loading}>
      <PCHeader />
      <h1 className={styles.pageTitle}>
        {formatMessage({ id: 'i18n_calendar_creation_title' })}
      </h1>

      <div className={styles.calendarEditContainer}>
        <Form form={form}>
          <p className={styles.labelName}>
            <img src={iconTitle} alt={'icon'} className={styles.labelIcon} />
            {formatMessage({ id: 'i18n_label_title' })}
          </p>
          <Form.Item
            name={'calendar_title'}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'i18n_required_text' }),
              },
            ]}
          >
            <Input className={styles.inputField} />
          </Form.Item>
          <p className={styles.labelName} style={{ paddingTop: 10 }}>
            <img src={iconMemo} alt={'icon'} className={styles.labelIcon} />
            {formatMessage({ id: 'i18n_memo' })}
          </p>
          <Form.Item
            name={'memo'}
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input
              className={styles.inputField}
              placeholder={formatMessage({
                id: 'i18n_memo_placeholder',
              })}
            />
          </Form.Item>
          <div className={styles.saveBtnContainer}>
            <Button
              className={styles.backBtn}
              loading={isLoading}
              onClick={() => {
                history.push('/?tab=2');
              }}
            >
              戻る
            </Button>
            <Button
              className={`${styles.saveBtn} ${styles.bgDarkBlue} ${styles.shadowPrimary}`}
              loading={isLoading}
              htmlType="submit"
              onClick={handleCalendarCreation}
            >
              {formatMessage({ id: 'i18n_btn_save' })}
            </Button>
          </div>
        </Form>
      </div>

      <FooterMobile />
    </Spin>
  );
}

const mapStateToProps = ({ EVENT, AVAILABLE_TIME }) => ({
  eventStore: EVENT,
  availableTime: AVAILABLE_TIME,
});

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(CalendarEdit);

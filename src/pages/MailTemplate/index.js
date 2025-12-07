import { LeftOutlined } from '@ant-design/icons';
import React from 'react';
import styles from './styles.less';
import { history } from 'umi';
import { Button, message } from 'antd';
import { useState, useEffect } from 'react';
import { Input } from 'antd';
import { listTime, listTextAskCalendar } from '@/commons/function.js';
import { connect } from 'dva';
import { urlLinkEvent } from '@/commons/function.js';
import HeaderMobile from '@/components/Mobile/Header';
import iconBack from '@/assets/images/i-back-white.png';
import { useIntl } from 'umi';
import { ROUTER } from '@/constant';
import useIsMobile from '../../hooks/useIsMobile';
import PCHeader from '../../components/PC/Header';
import FooterMobile from '../../components/Mobile/Footer';
const { TextArea } = Input;
const MailTemplatePage = props => {
  const intl = useIntl();
  const { formatMessage } = intl;
  const { eventStore, dispatch } = props;
  const [isLoadTextAskCalendar, setReloadTextAsk] = useState(true);
  const [formAskCalendar, setTextAskCalendar] = useState(undefined);
  const { listTextAskCalendar } = eventStore;
  const isMobile = useIsMobile();
  const onGetNotifyAskCalendar = () =>
    dispatch({ type: 'EVENT/getNotifyAskCalendar' });

  useEffect(() => {
    onGetNotifyAskCalendar();
  }, []);

  const onUpdateNotifyAskCalendar = payload => {
    dispatch({
      type: 'EVENT/updateAskNotifyCalendar',
      payload,
      callback: () => {
        message.success('定型文を更新しました');
      },
    });
  };

  const reloadFormAskCalendar = () => {
    const {
      text_ask_calendar_bottom,
      text_ask_calendar_top,
    } = listTextAskCalendar;
    let e = `
--------------------------
■候補日時`;

    e += '\n2024年mm月24日(水) 10:00~11:00';
    e += '\n■ イベント名： タイムマッチ';
    e += `\n■ご予約方法
下記URLからご予約いただくか、ご都合の良い日時をご連絡ください。
${window.location.href}/schedule-adjustment/once?event_code=myJGBYo5&once=true

※最新もしくはその他の日時も上記URLからご確認いただくことができ、ご予約も可能です。
 --------------------------`;

    const listTextAsk =
      text_ask_calendar_top + e + '\n' + text_ask_calendar_bottom;

    setTextAskCalendar(listTextAsk);
  };

  useEffect(() => {
    if (listTextAskCalendar) {
      reloadFormAskCalendar();
    }
  }, [listTextAskCalendar]);

  return (
    <div className={styles.pageTemplateEmail}>
      <PCHeader />
      <div className={`${styles.widthMailTemplate}`}>
        {isMobile ? null : (
          <div className={styles.formTab}>
            <div
              className={styles.formTabButton}
              onClick={() => {
                history.push('/contact-management');
              }}
            >
              メール送信先管理
            </div>
            <div
              className={[styles.formTabButton, styles.active].join(' ')}
              onClick={() => {
                history.push('/mail-template');
              }}
            >
              定例文の作成
            </div>
          </div>
        )}
        <div className={styles.pageTitle}>定型文の作成</div>
        <div className={styles.textAreaTemplate}>
          <TextArea
            className={styles.textAreaTemplateInput}
            value={formAskCalendar}
            rows={20}
            onChange={e => setTextAskCalendar(e.target.value)}
          />
          <p className={styles.textNoteTemplate}>
            ※上記内の「—（点線）と―（点線）の間のテキスト」(つまり、候補日時・ご予約方法・お打ち合わせ内容)は保存できません。
          </p>
        </div>
      </div>
      <div className={styles.buttonTemplate}>
        <Button
          onClick={() => {
            onUpdateNotifyAskCalendar({
              text_ask_calendar_top: formAskCalendar?.split(
                '--------------------------',
              )[0],
              text_ask_calendar_bottom: formAskCalendar?.split(
                '--------------------------',
              )[2],
            });
          }}
          type="primary"
          size="large"
          className={`${styles.bgDarkBlue} ${styles.textLightGray} ${styles.rounded} ${styles.shadowPrimary} ${styles.widthButtonTemplate} btn-pc-primary`}
        >
          保存{' '}
        </Button>
        {isMobile ? (
          <div className={styles.formTab}>
            <div
              className={styles.formTabButton}
              onClick={() => {
                history.push('/contact-management');
              }}
            >
              メール送信先管理
            </div>
            <div
              className={[styles.formTabButton, styles.active].join(' ')}
              onClick={() => {
                history.push('/mail-template');
              }}
            >
              定例文の作成
            </div>
          </div>
        ) : null}
      </div>
      <FooterMobile />
    </div>
  );
};
export default connect(({ EVENT, AVAILABLE_TIME }) => ({
  availableTime: AVAILABLE_TIME,
  eventStore: EVENT,
}))(MailTemplatePage);

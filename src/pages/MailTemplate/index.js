import { LeftOutlined } from '@ant-design/icons';
import React from 'react';
import styles from './styles.less';
import { history } from 'umi';
import { Button } from 'antd';
import { useState, useEffect } from 'react';
import { Input } from 'antd';
import { listTime, listTextAskCalendar } from '@/commons/function.js';
import { connect } from 'dva';
import { urlLinkEvent } from '@/commons/function.js';

const { TextArea } = Input;
const MailTemplatePage = props => {
  const { eventStore, dispatch } = props;
  const [isLoadTextAskCalendar, setReloadTextAsk] = useState(true);
  const [formAskCalendar, setTextAskCalendar] = useState(undefined);
  const { listTextAskCalendar } = eventStore;
  const onGetNotifyAskCalendar = () =>
    dispatch({ type: 'EVENT/getNotifyAskCalendar' });

  useEffect(() => {
    onGetNotifyAskCalendar();
  }, []);

  const onUpdateNotifyAskCalendar = payload =>
    dispatch({ type: 'EVENT/updateAskNotifyCalendar', payload });

  const reloadFormAskCalendar = () => {
    const {
      text_ask_calendar_bottom,
      text_ask_calendar_top,
    } = listTextAskCalendar;
    let e = `
--------------------------
■候補日時`;

    e += '\n2024年mm月24日(水) 10:00~11:00';
    e += `\n■ご予約方法
下記URLからご予約いただくか、ご都合の良い日時をご連絡ください。
https://smoothly.jp/schedule-adjustment/once? event_code=myJGBYo5&once=true
\n
※最新もしくはその他の日時も上記URLからご確認いただくことができ、ご予約も可能です。\n
 ■お打ち合わせ内容
 ミーティング時間：60分
 ミーティング方法：Zoom
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
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid darkblue',
          padding: 15,
        }}
      >
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
          onClick={() => history.goBack()}
        >
          <LeftOutlined style={{ color: '#FFF' }} />
        </div>
        <div style={{ fontWeight: '600', fontSize: 18 }}>定型文の作成</div>
        <div
          style={{
            width: 30,
            height: 30,
          }}
        ></div>
      </div>
      <div style={{ padding: 10 }}>
        <TextArea
          value={formAskCalendar}
          rows={20}
          onChange={e => setTextAskCalendar(e.target.value)}
        />
        <p style={{ marginTop: 10 }}>
          ※上記内の「—（点線）と―（点線）の間のテキスト」(つまり、候補日時・ご予約方法・お打ち合わせ内容)は保存できません。
        </p>
      </div>
      <div style={{ width: '100%', textAlign: 'center' }}>
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
          style={{
            background: 'rgb(31, 60, 83)',
            borderColor: 'rgb(31, 60, 83)',
            width: '50%',
            borderRadius: '5px',
          }}
        >
          登録
        </Button>
      </div>
    </div>
  );
};
export default connect(({ EVENT, AVAILABLE_TIME }) => ({
  availableTime: AVAILABLE_TIME,
  eventStore: EVENT,
}))(MailTemplatePage);

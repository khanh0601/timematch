import React, { useState, useEffect } from 'react';
import styles from './styles.less';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { connect } from 'dva';
import { history, useIntl } from 'umi';
import iconBack from '@/assets/images/i-back-white.png';

function ShareCalendarMicrosoft(props) {
  const { dispatch } = props;
  const intl = useIntl();
  const { formatMessage } = intl;
  const [mes, setMsg] = useState('');
  const code = history.location.query.code;
  const user_id = history.location.query.state;

  useEffect(() => {
    sync();
  }, [code]);

  const sync = async () => {
    const result = await dispatch({
      type: 'MASTER/shareMicrosoftCalendar',
      payload: { code, user_id },
    });
    setMsg(result);
  };

  return (
    <div className={styles.shareCalendarMicrosoft}>
      {mes ? (
        <div className={styles.shareCalendarMicrosoftText}>
          <p>
            Microsoftカレンダーと共有
            <br />
            完了しました
          </p>
        </div>
      ) : (
        <div className={styles.shareCalendarMicrosoftText}>
          <p>
            Microsoftカレンダーと共
            <br />
            有失敗しました
          </p>
        </div>
      )}
      <a href="/" className={styles.backToHome}>
        <img src={iconBack} alt={'back'} />
        {formatMessage({ id: 'i18n_back' })}
      </a>
    </div>
  );
}

export default connect(({ MASTER }) => ({
  masterStore: MASTER,
}))(ShareCalendarMicrosoft);

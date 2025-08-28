import React, { useState, useEffect } from 'react';
import styles from './styles.less';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { connect } from 'dva';
import { history } from 'umi';

function ShareCalendarMicrosoft(props) {
  const { dispatch } = props;
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
    <div>
      <Header />
      {mes ? (
        <div className={styles.style}>
          <p>Microsoftカレンダーと共有完了しました</p>
        </div>
      ) : (
        <div className={styles.style}>
          <p>Microsoftカレンダーと共有失敗しました</p>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default connect(({ MASTER }) => ({
  masterStore: MASTER,
}))(ShareCalendarMicrosoft);

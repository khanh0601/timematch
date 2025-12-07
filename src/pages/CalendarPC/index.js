import FooterMobile from '@/components/Mobile/Footer';
import PCHeader from '@/components/PC/Header';
import { useState } from 'react';
import styles from './styles.less';
import CalendarPreview from '@/components/PC/Calendar/CalendarPreview';
import { PlusOutlined } from '@ant-design/icons';
import { useIntl, history } from 'umi';

function CalendarPC() {
  const [listNewEvents, setListNewEvents] = useState({});

  const intl = useIntl();
  const { formatMessage } = intl;

  return (
    <div>
      <PCHeader />

      <div className={styles.mainContainer}>
        {/* Left panel */}
        <div className={styles.pageTitle}>カレンダー</div>
        <div className={styles.btnGroup}>
          <div
            className={`${styles.btnGroupItem} `}
            onClick={() => history.push('/')}
          >
            調整中
          </div>
          <div
            className={`${styles.btnGroupItem} `}
            onClick={() => history.push('/?tab=2')}
          >
            <span>調整済み</span>
          </div>
          <div
            className={styles.btnEvent}
            onClick={() => history.push('/pc/create-calendar')}
          >
            <PlusOutlined className={styles.btnEventIcon} />
            <span className={styles.btnEventText}>
              {formatMessage({ id: 'i18n_top_pc_create_event' })}
            </span>
          </div>
        </div>

        {/* right panel */}
        <div className={styles.rightPanel}>
          <CalendarPreview
            listNewEvents={listNewEvents}
            setListNewEvents={setListNewEvents}
            fromCalendar
          />
        </div>
      </div>
      <div
        className={styles.CalendarPCBtn}
        onClick={() => {
          history.push('/');
        }}
      >
        <span>調整一覧に戻る</span>
      </div>

      <FooterMobile />
    </div>
  );
}
export default CalendarPC;

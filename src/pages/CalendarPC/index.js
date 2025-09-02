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
        <div className={styles.leftPanel}>
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

      <FooterMobile />
    </div>
  );
}
export default CalendarPC;

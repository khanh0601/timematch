import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useIntl } from 'umi';
import CalendarCreation from '../../Mobile/CalendarCreation';
import styles from '../styles/formCreate.less';
import '../styles/formCreatePc.less';
import { onNewBlock } from '@/util/eventBus';

function CreateCalendar(props) {
  const [showCreateEvent, setShowCreateEvent] = useState(true);
  const intl = useIntl();

  const { formatMessage } = intl;

  const toggleCreateEvent = () => {
    setShowCreateEvent(!showCreateEvent);
    // if (!showCreateEvent) {
    //   setTimeout(() => {
    //     console.log('bem');
    //     onNewBlock();
    //   }, 10);
    // }
  };

  return (
    <div className={`${styles.leftPanel} create-calendar-pc`}>
      <div
        className={styles.titleEvent}
        onClick={showCreateEvent ? undefined : toggleCreateEvent}
      >
        {!showCreateEvent && <PlusOutlined className={styles.btnEventIcon} />}
        <span>{formatMessage({ id: 'i18n_top_pc_create_event' })}</span>
      </div>
      {showCreateEvent && (
        <CalendarCreation
          fromPc
          {...props}
          toggleCreateEvent={toggleCreateEvent}
        />
      )}
    </div>
  );
}
export default CreateCalendar;

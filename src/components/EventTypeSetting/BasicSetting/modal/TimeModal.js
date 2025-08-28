import React, { useEffect, useState } from 'react';
import styles from './styles.less';
import { Button, InputNumber, Modal, Form } from 'antd';
import { useIntl } from 'umi';
import btnDownImage from '@/assets/images/btnDown.png';
import btnUpImage from '@/assets/images/btnUp.png';

export default function TimeModal({ value, visible, onChange, onClose }) {
  const { formatMessage } = useIntl();
  const [hour, setHour] = useState(Math.floor(value / 60));
  const [minute, setMinute] = useState(value % 60);

  const resetValue = () => {
    setHour(Math.floor(value / 60));
    setMinute(value % 60);
  };

  useEffect(() => {
    if (visible) {
      resetValue(value);
    }
  }, [visible]);

  const onSave = () => {
    const minuteFormat = hour * 60 + minute;
    if (minuteFormat) {
      onChange(hour * 60 + minute);
    }
  };

  return (
    <div className={styles.customModal}>
      <Modal visible={visible} closable={false} footer={null} width={1000}>
        <div className={styles.changeTime}>
          <div className={styles.center}>
            <div className={styles.title}>
              {formatMessage({ id: 'i18n_custom_setting' })}
            </div>
            <div className={styles.description}>
              <img src={btnDownImage} />
              <span>・</span>
              <img src={btnUpImage} />
              <div>{formatMessage({ id: 'i18n_schedule_custom_value' })}</div>
            </div>
            <div className={styles.description2}>
              {formatMessage({ id: 'i18n_schedule_custom_value_2' })}
            </div>
            <Form className={styles.form}>
              <Form.Item>
                <InputNumber min={0} max={24} value={hour} onChange={setHour} />
                <span className={styles.text}>時間</span>
                <InputNumber
                  min={0}
                  max={60}
                  value={minute}
                  onChange={setMinute}
                />
                <span className={styles.text}>分</span>
              </Form.Item>
            </Form>
          </div>
        </div>
        <div className={styles.btnZoneModal}>
          <Button
            className={`${styles.cancelScheduleBtn} ${styles.btnScheduleTime}`}
            onClick={onClose}
          >
            {formatMessage({ id: 'i18n_cancel_text' })}
          </Button>
          <Button
            className={`${styles.updateScheduleBtn} ${styles.btnScheduleTime}`}
            onClick={onSave}
          >
            {formatMessage({ id: 'i18n_update' })}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

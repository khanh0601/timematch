import React, { useState } from 'react';
import { useIntl } from 'umi';
import { Input, Button, Modal } from 'antd';
import { phoneNumberRegex } from '@/constant';

import styles from './styles.less';

export default function LocationModal({
  placeholder,
  value,
  visible,
  onChange,
  onClose,
}) {
  const { formatMessage } = useIntl();
  const [number, setNumber] = useState(value);
  const [error, setError] = useState(false);

  const onCancel = () => {
    onChange(null);
    setError(false);
    setNumber(null);
    onClose();
  };

  const onSave = () => {
    if (!phoneNumberRegex.test(number)) {
      setError(true);
    } else {
      onChange(number);
    }
  };

  return (
    <div className={styles.customModal}>
      <Modal
        title={formatMessage({ id: 'i18n_custom_period' })}
        visible={visible}
        wrapClassName="modalPeriod"
        closable={false}
        footer={null}
      >
        <div className="inputCustomValue">
          <div className="customTitleDescript">
            {formatMessage({ id: 'i18n_custom_descript_title' })}
          </div>
          <Input
            value={number}
            onChange={event => setNumber(event.target.value)}
          />
          <div className="inputCustomValueText">{placeholder}</div>
          {error && (
            <span className={styles.errorNotice}>
              {formatMessage({ id: 'i18n_message_invalid_syntax_number' })}
            </span>
          )}
        </div>
        <div className={styles.btnZoneModal}>
          <Button
            className={`${styles.cancelScheduleBtn} ${styles.btnScheduleTime}`}
            onClick={onCancel}
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

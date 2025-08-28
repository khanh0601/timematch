import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import { Input, Button, Modal } from 'antd';
import { phoneNumberRegex } from '@/constant';

import styles from './styles.less';

export default function LocationModal({
  type,
  value,
  visible,
  onChange,
  onClose,
}) {
  const { formatMessage } = useIntl();
  const [location, setLocation] = useState('');
  const [error, setError] = useState(false);
  const validator =
    type !== 3 ? () => true : value => phoneNumberRegex.test(value);

  let title = '';
  switch (type) {
    case 3:
      title = formatMessage({ id: 'i18n_custom_phone' });
      break;
    case 4:
      title = formatMessage({ id: 'i18n_custom_location_create_event_type' });
      break;
    case 5:
      title = formatMessage({ id: 'i18n_custom_other' });
      break;
  }
  const onCancel = () => {
    onChange(null);
    onClose();
  };

  const onSave = () => {
    if (validator(location) && (type === 3 || type === 4 || type === 5)) {
      onChange(location);
      setError(false);
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    if (visible) {
      setLocation(value);
    }
  }, [visible]);

  return (
    <div className={styles.customModal}>
      <Modal title={title} visible={visible} closable={false} footer={null}>
        <Input
          value={location}
          onChange={event => setLocation(event.target.value)}
        />
        {error && (
          <span className={styles.errorNotice}>
            {formatMessage({ id: 'i18n_wrong_phone_number' })}
          </span>
        )}
        <div className={styles.btnZoneModal}>
          <Button className={styles.updateBtn} onClick={onSave}>
            {formatMessage({ id: 'i18n_update' })}
          </Button>
          <Button className={styles.cancelBtn} onClick={onCancel}>
            {formatMessage({ id: 'i18n_cancel' })}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

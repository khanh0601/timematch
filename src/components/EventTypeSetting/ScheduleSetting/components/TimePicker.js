import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import { TimePicker as BaseTimePicker } from 'antd';
import moment from 'moment';

import styles from '../../advanced_styles.less';

export default function TimePicker({ placeholder, onChange, value }) {
  value = moment(value, 'HH:mm').isValid() ? moment(value, 'HH:mm') : undefined;

  return (
    <BaseTimePicker
      placeholder={placeholder}
      format={'HH:mm'}
      minuteStep={15}
      suffixIcon={<DownOutlined />}
      allowClear={true}
      showNow={false}
      inputReadOnly={true}
      value={value}
      onChange={onChange}
      onSelect={onChange}
      popupClassName={styles.timePicker}
    />
  );
}

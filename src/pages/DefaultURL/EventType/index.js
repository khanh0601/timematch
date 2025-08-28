import React, { useEffect, useState } from 'react';
import styles from './styles.less';
import { useIntl, history } from 'umi';
import { connect } from 'dva';
import { Button, Tooltip } from 'antd';
import { meetingMethod } from '@/commons/function.js';
import config from '@/config';

function EventType(props) {
  const { dispatch, eventStore, data, userCode } = props;
  const intl = useIntl();
  const { formatMessage } = intl;
  const onSelect = () => {
    window.open(
      `${config.WEB_DOMAIN}/schedule-adjustment/many?event_code=${data.event_code}&user_code=${userCode}`,
    );
  };
  return (
    <div className={styles.eventTypeBadge}>
      <div className={styles.headTitle}>
        <div className={styles.bolderIcon}></div>
        <div className={styles.titleIcon}></div>
        <Tooltip title={data.name}>
          <span className={styles.eventName}>{data.name}</span>
        </Tooltip>
      </div>
      <p>
        {formatMessage({ id: 'i18n_meeting_format' })}：{data.real_category}
      </p>

      <span className={styles.locationNameTitle}>
        {formatMessage({ id: 'i18n_meeting_place' })}：
      </span>
      <Tooltip title={data.location_name}>
        <span className={styles.locationName}>
          {data.m_location_id === 5 ? data.location_name : meetingMethod(data)}
        </span>
      </Tooltip>
      <p>
        {formatMessage({ id: 'i18n_required_time' })}：{data.block_name}
      </p>
      <div className={styles.btnZone}>
        <Button onClick={onSelect}>
          {formatMessage({ id: 'i18n_select' })}
        </Button>
      </div>
    </div>
  );
}

export default connect(({ EVENT }) => ({
  eventStore: EVENT,
}))(EventType);

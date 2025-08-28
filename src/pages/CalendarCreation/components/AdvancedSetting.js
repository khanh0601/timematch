import React from 'react';
import { Button, Collapse, Tooltip } from 'antd';
import { useIntl } from 'umi';

import ScheduleSetting from '@/components/EventTypeSetting/ScheduleSetting';
import TimeSetting from '@/components/EventTypeSetting/TimeSetting';
import MessageSetting from '@/components/EventTypeSetting/MessageSetting';

import helperImage from '@/assets/images/imgQuestion.png';
import clockImage from '@/assets/images/i-clock.svg';
import pinionImage from '@/assets/images/i-pinion.svg';
import messageImage from '@/assets/images/message-setting.png';

import styles from '../styles.less';

export default function AdvancedSetting({ onClose, relationshipType }) {
  const { formatMessage } = useIntl();

  return (
    <div className={styles.advancedSettingContainer}>
      <Collapse expandIconPosition="right" defaultActiveKey={['1', '2', '3']}>
        <Collapse.Panel
          header={
            <div className={styles.timeSetting}>
              <div className={styles.dropdownHeader}>
                <img src={pinionImage} />
                <div className={styles.dropdownHeaderTitle}>
                  {formatMessage({ id: 'i18n_set_schedule' })}
                </div>
              </div>
            </div>
          }
          key="1"
          className={styles.collapseSettingContainer}
        >
          <ScheduleSetting
            relationshipType={relationshipType}
            onClose={onClose}
          />
        </Collapse.Panel>

        <Collapse.Panel
          header={
            <div className={styles.timeSetting}>
              <div className={styles.dropdownHeader}>
                <img src={clockImage} />
                <div className={styles.dropdownHeaderTitle}>
                  {formatMessage({ id: 'i18n_time_setting' })}
                </div>
                <Tooltip
                  title={formatMessage({ id: 'i18n_time_setting_tooltip' })}
                  overlayClassName={styles.tooltipAdvanced}
                >
                  <div className={styles.helperDropdown}>
                    <img src={helperImage} className="helper" />
                  </div>
                </Tooltip>
              </div>
            </div>
          }
          key="2"
          className={styles.collapseSettingContainer}
        >
          <TimeSetting onClose={onClose} />
        </Collapse.Panel>

        <Collapse.Panel
          header={
            <div className={styles.timeSetting}>
              <div className={styles.dropdownHeader}>
                <img src={messageImage} />
                <div className={styles.dropdownHeaderTitle}>
                  {formatMessage({ id: 'i18n_message_setting' })}
                </div>
              </div>
            </div>
          }
          key="3"
          className={`${styles.messageSettingContainer} ${styles.collapseSettingContainer}`}
        >
          <MessageSetting onClose={onClose} />
        </Collapse.Panel>
      </Collapse>

      <div className={styles.buttonZoneContainer}>
        <Button className={styles.backBtn} onClick={onClose}>
          {formatMessage({ id: 'i18n_back' })}
        </Button>
      </div>
    </div>
  );
}

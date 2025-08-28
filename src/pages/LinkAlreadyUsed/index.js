import React from 'react';
import styles from './styles.less';
import { Tabs, Tooltip } from 'antd';
import { useIntl } from 'umi';

function LinkAlreadyUsed() {
  const { TabPane } = Tabs;
  const intl = useIntl();
  const { formatMessage } = intl;

  return (
    <div className={styles.linkAlreadyUsed}>
      <h2>{formatMessage({ id: 'i18n_used_link_notice' })}</h2>
      <p>{formatMessage({ id: 'i18n_pls_contact_URL_owner' })}</p>
    </div>
  );
}

export default LinkAlreadyUsed;

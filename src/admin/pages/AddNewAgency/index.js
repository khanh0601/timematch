import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { useIntl } from 'umi';
import styles from './styles.less';
import { connect } from 'dva';
import AgencyForm from '../../components/AgencyForm';

const AddNewAgency = props => {
  const { dispatch } = props;
  const intl = useIntl();
  const { formatMessage } = intl;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch({ type: 'ADMIN/getListAgency', payload: { setLoading } });
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        {formatMessage({ id: 'i18n_add_new' })}
      </div>
      <Spin spinning={loading} size="large">
        <AgencyForm formLayout="horizontal" />
      </Spin>
    </div>
  );
};

export default connect(({ ADMIN }) => ({ adminStore: ADMIN }))(AddNewAgency);

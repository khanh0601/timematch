import React, { useEffect } from 'react';
import { history } from 'umi';
import { Spin } from 'antd';
import { connect } from 'dva';

function UserConnections(props) {
  const { dispatch, userConnectionsStore } = props;
  const { loading } = userConnectionsStore;

  useEffect(() => {
    if (
      history.location.query.user_connection_id &&
      history.location.query.hash
    ) {
      const payload = {
        user_connection_id: Number(history.location.query.user_connection_id),
        hash: history.location.query.hash,
      };
      if (history.location.query.type === 'trial') {
        payload.type = history.location.query.type;
        payload.owner_id = Number(history.location.query.owner_id);
        payload.role_type = Number(history.location.query.role_type);
      }
      dispatch({ type: 'USERCONNECTIONS/verifiedLinkAccount', payload });
    } else history.push('/');
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: '100vh' }}>
      <Spin spinning={loading} style={{ margin: 'auto' }}></Spin>
    </div>
  );
}

export default connect(({ USERCONNECTIONS }) => ({
  userConnectionsStore: USERCONNECTIONS,
}))(UserConnections);

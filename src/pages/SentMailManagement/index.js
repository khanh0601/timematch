import { LeftOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { history } from 'umi';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { Spin } from 'antd';
const SentEmailManagement = props => {
  const { masterStore, dispatch } = props;
  const { historyInvitation, loginLoading } = masterStore;

  useEffect(() => {
    dispatch({
      type: 'MASTER/getHistoryInvitation',
      payload: {
        pageSize: 20,
        page: 1,
      },
    });
  }, []);

  return (
    <Spin spinning={loginLoading}>
      <div style={{ paddingBottom: 30 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid darkblue',
            padding: 15,
            position: 'sticky',
            top: 0,
            background: '#FFF',
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              background: 'dodgerblue',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5,
            }}
            onClick={() => history.goBack()}
          >
            <LeftOutlined style={{ color: '#FFF' }} />
          </div>
          <div style={{ fontWeight: '600', fontSize: 18 }}>
            メール送付先管理
          </div>
          <div
            style={{
              width: 30,
              height: 30,
            }}
          ></div>
        </div>
        <div
          style={{
            padding: '30px 10px',
          }}
        >
          <div style={{ gap: 10, display: 'flex', flexDirection: 'column' }}>
            {historyInvitation?.data?.map((item, index) => (
              <div
                key={item.id}
                style={{ display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #d4d4d4',
                    padding: 10,
                    flex: 1,
                  }}
                >
                  {item.email}
                </div>
                <div
                  style={{
                    padding: 10,
                    border: '1px solid #ff3434',
                    width: 44,
                    height: 44,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#ff3434',
                    color: 'white',
                    borderRadius: 5,
                  }}
                  onClick={() => {
                    dispatch({
                      type: 'MASTER/deleteHistoryInvitation',
                      payload: {
                        id: item.id,
                      },
                    });
                  }}
                >
                  <DeleteOutlined />
                </div>
              </div>
            ))}
          </div>
        </div>{' '}
        <div style={{ width: '100%', textAlign: 'center' }}>
          <Button
            style={{
              background: 'rgb(31, 60, 83)',
              borderColor: 'rgb(31, 60, 83)',
              width: '50%',
              borderRadius: '5px',
            }}
            onClick={() => {
              history.goBack();
            }}
            size="large"
            type="primary"
          >
            保存
          </Button>
        </div>
      </div>
    </Spin>
  );
};

export default connect(({ MASTER }) => ({ masterStore: MASTER }))(
  SentEmailManagement,
);

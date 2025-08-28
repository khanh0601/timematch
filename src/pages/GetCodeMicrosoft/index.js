import React, { useEffect } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';

function GetCodeMicrosoft(props) {
  const { masterStore } = props;
  const { loginLoading } = masterStore;
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code != null) {
      localStorage.setItem('code', code);
      window.close();
    }
    window.scrollTo(0, 0);
  }, []);

  return <Spin spinning={loginLoading}></Spin>;
}

export default connect(({ MASTER }) => ({
  masterStore: MASTER,
}))(GetCodeMicrosoft);

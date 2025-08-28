import React, { useEffect, useState } from 'react';
import styles from './styles.less';
import { useIntl, history } from 'umi';
import { connect } from 'dva';
import { Tabs, Button, Table, Dropdown, Menu } from 'antd';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getCookie } from '@/commons/function.js';

function SmoothLogin(props) {
  const { dispatch, masterStore } = props;
  const intl = useIntl();
  const { formatMessage } = intl;
  const { TabPane } = Tabs;
  const isLogin = getCookie('token');
  const [activeTab, setActiveTab] = useState(() => {
    if (history.location.query.login) {
      return '2';
    }
    return '1';
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (history.location.query.login) {
      setActiveTab('2');
    }
  }, [history.location.query.login]);

  useEffect(() => {
    if (isLogin) {
      history.push('/');
    }
  }, [isLogin]);

  return !isLogin ? (
    <div className={styles.smoothLogin}>
      <Header headerLogin={true} />

      <>
        <Tabs
          activeKey={activeTab}
          className={styles.eventManageTabs}
          onTabClick={tab => setActiveTab(tab)}
        >
          {!history.location.query.admin && (
            <TabPane
              tab={formatMessage({ id: 'i18n_register_new_free_acc' })}
              key={'1'}
            >
              <SignUp />
            </TabPane>
          )}
          <TabPane tab={formatMessage({ id: 'i18n_btn_login' })} key={'2'}>
            <SignIn />
          </TabPane>
        </Tabs>
      </>
      <Footer />
    </div>
  ) : (
    <></>
  );
}

export default connect(({ MASTER }) => ({
  masterStore: MASTER,
}))(SmoothLogin);

import React from 'react';
import styles from './styles.less';
import { useIntl, history } from 'umi';
import logo from '@/assets/images/logo.png';
import { Row, Col } from 'antd';

function HomeHeader() {
  const intl = useIntl();
  const { formatMessage } = intl;
  return (
    <div className={styles.headerContainer}>
      <Row>
        <Col xs={{ span: 24, offset: 0 }} sm={{ span: 18, offset: 3 }}>
          <div className={styles.homeHeader}>
            <div className={styles.logo} onClick={() => history.push('/home')}>
              <img src={logo} />
            </div>
            <div className={styles.menu}>
              <span onClick={() => history.push('/term-of-user')}>
                {formatMessage({ id: 'i18n_term_of_user' })}
              </span>
              <span onClick={() => history.push('/privacy-policy')}>
                {formatMessage({ id: 'i18n_privacy_policy' })}
              </span>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default HomeHeader;

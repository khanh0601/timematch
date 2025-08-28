import React from 'react';
import styles from './styles.less';
import { useIntl, history, withRouter } from 'umi';
import logo from '@/assets/images/logo.png';
import google_meet_logo from '@/assets/images/i-meet.png';
import google_calendar_logo from '@/assets/images/i-calendar.png';
import zoom_logo from '@/assets/images/i-zoom.png';
import home_bg_2 from '@/assets/images/home_bg_2.png';
import { Row, Col } from 'antd';
import HomeHeader from '@/components/HomeHeader';
import { connect } from 'dva';

function Home(props) {
  const { dispatch, footerStore } = props;
  const { isScroll } = footerStore;
  const scrollIntoStartView = ref => {
    if (ref && isScroll === true) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
      dispatch({ type: 'FOOTER/setIsScroll', payload: false });
    }
  };
  const intl = useIntl();
  const { formatMessage } = intl;
  return (
    <div className={styles.home} ref={scrollIntoStartView}>
      <HomeHeader />
      <Row>
        <Col
          lg={{ span: 10, offset: 3 }}
          md={{ span: 20, offset: 2 }}
          sm={{ span: 20, offset: 2 }}
          xs={{ span: 24, offset: 0 }}
        >
          <div className={styles.homeContent}>
            <h1 className={styles.title}>Smoothly</h1>
            <p>
              あなたとあなたが出会うすべての人にとって最高の自動スケジューリングソフトウェア
            </p>
            <p>
              SmoothはGoogleフォームなどの参加登録データから自動で管理簿を生成できます。イベントの出欠管理や集計を簡単に行うことができます
              二つのカレンダーに接続して、利用性を自動的に確認し、最高の連絡先、見込み客、およびクライアントとの接続を支援します
            </p>
            <div className={styles.divide}>
              <span>{formatMessage({ id: 'i18n_sync' })}</span>
              <div></div>
            </div>
            <div className={styles.linkedList}>
              <div className={styles.badge}>
                <img src={zoom_logo} />
                Zoom
              </div>
              <div className={styles.badge}>
                <img src={google_meet_logo} />
                Meet
              </div>
              <div className={styles.badge}>
                <img src={google_calendar_logo} />
                Google Calendar
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <div className={styles.leftBottomBackground}>
        <img src={home_bg_2} />
      </div>
    </div>
  );
}

export default connect(({ FOOTER }) => ({
  footerStore: FOOTER,
}))(withRouter(Home));

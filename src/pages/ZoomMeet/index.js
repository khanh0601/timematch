import React, { useState, useEffect } from 'react';
import { Tabs, Row, Col, Button } from 'antd';
import styles from './styles.less';
import { useIntl } from 'umi';
import googleMeet from '@/assets/images/google-meet.png';
import smoothly from '@/assets/images/smoothly.png';
import zoom from '@/assets/images/zoom.png';
import microsoftTeams from '@/assets/images/microsoft-teams.png';
import Footer from '@/components/Footer';
import { connect } from 'dva';
import config from '@/config';

const { TabPane } = Tabs;
function ZoomMeet(props) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const { dispatch } = props;
  const [urlZoom, setUrlZoom] = useState();
  const [urlMeet, setUrlMeet] = useState();

  useEffect(() => {
    const payload = {
      setUrlZoom: setUrlZoom,
    };
    dispatch({ type: 'EVENT/getZoomURL', payload });
  }, []);
  useEffect(() => {
    const payload = {
      setUrlMeet: setUrlMeet,
    };
    dispatch({ type: 'EVENT/getGoogleMeetURL', payload });
  }, []);

  const redirectUri =
    window.location.protocol +
    '//' +
    window.location.host +
    '/msteam-login-success';
  const urlMSTeams = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${config.MICROSOFT_CLIENT_KEY}&scope=User.Read Calendars.Read Calendars.ReadWrite offline_access&response_type=code&redirect_uri=${redirectUri}&state=ClientStateGoesHere&prompt=login`;

  return (
    <div>
      <div className={styles.container}>
        <Tabs defaultActiveKey="1" className={styles.eventManageTabs}>
          <TabPane tab={formatMessage({ id: 'i18n_zoom' })} key="1">
            <Row className={styles.mainRowItem}>
              <Col xs={24} sm={24} md={24} lg={14}>
                <div className={styles.title}>
                  <div className={styles.titleBorder}></div>
                  <div className={styles.titleName}>
                    {formatMessage({ id: 'i18n_zoom_integration_title' })}
                  </div>
                </div>
                <div className={styles.explainContent}>
                  Zoom はオンラインミーティングツールです。
                  <br />
                  SmoothlyとZoomを連携いただくことで、Zoom のミーティング URL
                  が自動発行され、調整相手へも自動連絡されるので、別途ミーティングURLを送る必要もなくなり大変便利です。
                  <br />
                  連携には、「Zoom アカウント」が必要になります。
                </div>
                <div className={styles.title}>
                  <div className={styles.titleBorder}></div>
                  <div className={styles.titleName}>
                    {formatMessage({ id: 'i18n_detail_explaination' })}
                  </div>
                </div>
                <div className={styles.explainContent}>
                  サポートページを確認ください。
                </div>
              </Col>
              <Col xs={24} sm={24} md={24} lg={10}>
                <div className={styles.groupImage}>
                  <div>
                    <img src={zoom} alt="zoom" />
                  </div>
                  <div className={styles.between}>&</div>
                  <div>
                    <img src={smoothly} alt="smoothly" />
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <a
                href={urlZoom}
                target="_blank"
                className="btn btnGreen m-auto btn-small href"
              >
                {formatMessage({ id: 'i18n_work_together' })}
              </a>
            </Row>
          </TabPane>
          <TabPane tab={formatMessage({ id: 'i18n_google_meet' })} key="2">
            <Row className={styles.mainRowItem}>
              <Col xs={24} sm={24} md={24} lg={14}>
                <div className={styles.title}>
                  <div className={styles.titleBorder}></div>
                  <div className={styles.titleName}>
                    {formatMessage({
                      id: 'i18n_google_meet_integration_title',
                    })}
                  </div>
                </div>
                <div className={styles.explainContent}>
                  Google Meet はオンラインミーティングツールです。
                  <br />
                  タイムマッチ と GoogleMeet を連携いただくことで、 GoogleMeet
                  のミーティングURLが自動発行され、調整相手へも自動連絡されるので、別途ミーティング
                  URL を送る必要もなくなり大変便利です。
                  <br />
                  連携には、「Google アカウント」が必要になります。
                </div>
                <div className={styles.title}>
                  <div className={styles.titleBorder}></div>
                  <div className={styles.titleName}>
                    {formatMessage({ id: 'i18n_detail_explaination' })}
                  </div>
                </div>
                <div className={styles.explainContent}>
                  サポートページを確認ください。
                </div>
              </Col>
              <Col xs={24} sm={24} md={24} lg={10}>
                <div className={styles.groupImage}>
                  <div>
                    <img src={googleMeet} alt="google-meet" />
                  </div>
                  <div className={styles.between}>&</div>
                  <div>
                    <img src={smoothly} alt="smoothly" />
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              {/* <Button
                onClick={handleIntegrateGoogle}
                className="btn btnGreen m-auto btn-small"
              >
                {formatMessage({ id: 'i18n_work_together' })}
              </Button> */}
              <a
                href={urlMeet}
                target="_blank"
                className="btn btnGreen m-auto btn-small href"
              >
                {formatMessage({ id: 'i18n_work_together' })}
              </a>
            </Row>
          </TabPane>
          <TabPane tab={formatMessage({ id: 'i18n_microsoft_teams' })} key="3">
            <Row className={styles.mainRowItem}>
              <Col xs={24} sm={24} md={24} lg={14}>
                <div className={styles.title}>
                  <div className={styles.titleBorder}></div>
                  <div className={styles.titleName}>
                    {formatMessage({
                      id: 'i18n_microsoft_teams_integration_title',
                    })}
                  </div>
                </div>
                <div className={styles.explainContent}>
                  Microsoft Teams はオンラインミーティングツールです。
                  <br />
                  Smoothlyと Microsoft Teams を連携いただくことで、 Microsoft
                  Teams
                  のミーティングURLが自動発行され、調整相手へも自動連絡されるので、別途ミーティングURLを送る必要もなくなり大変便利です。
                  <br />
                  連携には、「Microsoft アカウント」が必要になります。
                  <div className={styles.describeAccountPersonalCanNotUse}>
                    ※上記は法人契約でMicrosoftをご利用されている場合にのみ有効な機能です。
                    <br />
                    Microsoftの仕様上、個人向けのMicrosoft Teamsアカウントでは、
                    <br />
                    オンライン会議用URLは発行されないためです。
                  </div>
                </div>

                <div className={styles.title}>
                  <div className={styles.titleBorder}></div>
                  <div className={styles.titleName}>
                    {formatMessage({ id: 'i18n_detail_explaination' })}
                  </div>
                </div>
                <div className={styles.explainContent}>
                  サポートページを確認ください。
                </div>
              </Col>
              <Col xs={24} sm={24} md={24} lg={10}>
                <div className={styles.groupImage}>
                  <div>
                    <img src={microsoftTeams} alt="microsoft-teams" />
                  </div>
                  <div className={styles.between}>&</div>
                  <div>
                    <img src={smoothly} alt="smoothly" />
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <a
                href={urlMSTeams}
                target="_blank"
                className="btn btnGreen m-auto btn-small href"
              >
                {formatMessage({ id: 'i18n_work_together' })}
              </a>
            </Row>
          </TabPane>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}

export default connect(({ MASTER, EVENT }) => ({
  masterStore: MASTER,
  eventStore: EVENT,
}))(ZoomMeet);

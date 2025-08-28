import React, { useEffect, useState } from 'react';
import ListEvent from './listEvent';
import styles from './styles.less';
import { Tabs, Tooltip } from 'antd';
import { useIntl, withRouter, history } from 'umi';
import PartyMeeting from './partyMeeting';
import helper from '@/assets/images/imgQuestion.png';
import MenuSPBottom from '@/components/MenuSPBottom';
import { connect } from 'dva';
import ListTab from './listTab';
import ListAccount from './listAccount';
import { getLocation } from './../../commons/function';

import useWindowDimensions from '@/commons/useWindowDimensions';
import TooltipFormat from '../../components/TooltipFormat';

const listDataTooltipEvent = [
  '1：1での日程調整が可能です。',
  '連携いただいているカレンダーをもとにご都合の良い日時を自動抽出・手動抽出でき日程調整を効率化できます。',
  'URLを調整相手に送るだけで日程調整できます。',
  '具体例：①取引先との1：1のミーティング、ランチミーティング、会食（A社・B社の2社で日程調整する）',
  '②チーム単位での取引先とのミーティング、ランチミーティング、会食',
  '③採用候補者との面接',
  '④社内チームでの1on1ミーティング',
  '',
  'また、チーム単位での複数社と日程調整することも可能です。',
  '例：A社の社員Bさん・Cさん・DさんをチームEとします。チームEがクライアントである法人F社・法人G社の3社間で日程調整する。',
  '※Bさん・Cさん・Dさん・法人F社・法人G社での日程調整が可能です。',
  '※チーム単位での日程調整は個人プランの場合、「プレミアムプラン」の限定機能が必要になります。（２週間は無料でご利用いただけます。）',
];
const listDataTooltipVote = [
  '3社間以上の日程調整を行う際に投票形式で日程調整できます。',
  'オンラインミーティング用URLを自動発行することが可能です。',
  '例：A社・B社・C社の3社で日程調整する（ミーティング・ランチミーティング・会食する）',
  '',
  'また、チーム単位での日程調整することも可能です。',
  '例：A社の社員Bさん・Cさん・DさんをチームEとする。チームEがクライアントである法人F社・法人G社の3社間で日程調整する。',
  '※Bさん・Cさん・Dさん・法人F社・法人G社での日程調整が可能です。',
];

const listDataTooltipEventTab3 = [
  'Smoothlyを利用いただいて日程調整が完了した予定に関して、',
  '「今後の予定」と「過去の予定」で確認いただけます。',
  'それぞれの予定詳細や、日程調整相手の情報も確認できます。',
  '',
  'また、オンラインミーティングのURLも自動発行され、',
  '各予定に表示されている当該ボタンをクリックいただくだけで',
  'ミーティングにスムーズに参加いただけます。',
  '',
  'さらに、予定をキャンセルすることも可能です。',
];

function EventManage(props) {
  const { location, eventStore, dispatch } = props;
  const { TabPane } = Tabs;
  const intl = useIntl();
  const { formatMessage } = intl;
  const [currentTab, setCurrentTab] = useState('1');
  const { width } = useWindowDimensions();

  useEffect(() => {
    const { query } = location;
    if (query.tab) {
      setCurrentTab(query.tab);
    }
  }, [location.query.tab]);

  useEffect(() => {
    dispatch({ type: 'EVENT/clearDetailEventType', payload: {} });
  }, []);

  return (
    <div className={styles.eventManage}>
      <Tabs activeKey={currentTab} onChange={setCurrentTab}>
        <TabPane
          tab={
            <div
              className={styles.tabName}
              onClick={() => history.push(getLocation(1))}
            >
              <span>{formatMessage({ id: 'i18n_created_by_app' })}</span>
              <Tooltip
                placement="top"
                title={<TooltipFormat dataFormat={listDataTooltipEvent} />}
              >
                <img
                  src={helper}
                  className="helper"
                  style={{
                    width: width > 767 ? '20px' : '14px',
                    height: width > 767 ? '20px' : '14px',
                  }}
                />
              </Tooltip>
            </div>
          }
          key="1"
        >
          <ListAccount />
        </TabPane>
        <TabPane
          tab={
            <div
              className={styles.tabName}
              onClick={() => history.push(getLocation(2))}
            >
              <span>{formatMessage({ id: 'i18n_tab_vote' })}</span>
              <Tooltip
                placement="top"
                title={<TooltipFormat dataFormat={listDataTooltipVote} />}
              >
                <img
                  src={helper}
                  className="helper"
                  style={{
                    width: width > 767 ? '20px' : '14px',
                    height: width > 767 ? '20px' : '14px',
                    // marginLeft: '8px',
                    // marginTop: width > 767 ? '-5px' : '-3px',
                  }}
                />
              </Tooltip>
            </div>
          }
          key="2"
        >
          <ListTab />
        </TabPane>
        <TabPane
          tab={
            <div
              className={styles.tabName}
              onClick={() => history.push(getLocation(3))}
            >
              <span>{formatMessage({ id: 'i18n_list_event' })}</span>
              {width > 767 && (
                <Tooltip
                  placement="top"
                  title={
                    <TooltipFormat dataFormat={listDataTooltipEventTab3} />
                  }
                >
                  <img
                    src={helper}
                    className="helper"
                    // style={{
                    //   marginLeft: '8px',
                    //   marginTop: '-5px',
                    // }}
                  />
                </Tooltip>
              )}
            </div>
          }
          key="3"
        >
          <ListEvent />
        </TabPane>
      </Tabs>
      <MenuSPBottom currentTab={currentTab} setCurrentTab={setCurrentTab} />
    </div>
  );
}

export default connect(({ EVENT }) => ({ eventStore: EVENT }))(
  withRouter(EventManage),
);

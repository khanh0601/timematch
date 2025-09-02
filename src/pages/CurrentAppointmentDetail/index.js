import 'react-swipeable-list/dist/styles.css';
import PlusIcon from '../Top/icon/PlusIcon';
import { SwipeableList } from 'react-swipeable-list';
import './styles.less';
import { history } from 'umi';
const CurrentAppointmentDetail = () => {
  return (
    <div className="container">
      <div className="header">
        <div className=""></div>
        <div className="header-title">詳細</div>3251235
        <div
          onClick={() => {
            history.go(-1);
          }}
          className="close-btn"
        >
          <div
            style={{
              rotate: '45deg',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <PlusIcon />
          </div>
        </div>
      </div>
      <div>
        <SwipeableList className="swipeableList">
          <div className="swipableItem">
            <div className="swipableItemInner">
              <div className="swipableItemInnerDiv"></div>
              <div>
                {/* format date time by japanese */}
                2021年7月12日 10:00 〜 11:00
              </div>
            </div>
            <div className="flexSpaceBetween">
              <div className="flex2">調整状況</div>{' '}
              <div className="flex1">: 私から</div>
            </div>
            <div className="flexSpaceBetween">
              <div className="flex2">会議形式</div>
              <div className="flex1">: オンライン</div>
            </div>
            <div className="flexSpaceBetween">
              <div className="flex2">イベント名</div>
              <div className="flex1">: AさんMTG</div>
            </div>
            <div className="flexSpaceBetween">
              <div className="flex2">ミーティング形式</div>
              <div className="flex1"> : オンライン</div>
            </div>
            <div className="flexSpaceBetween">
              <div className="flex2">ミーティング相手</div>
              <div className="flex1">: Aさん</div>
            </div>
          </div>
        </SwipeableList>
      </div>
    </div>
  );
};
export default CurrentAppointmentDetail;

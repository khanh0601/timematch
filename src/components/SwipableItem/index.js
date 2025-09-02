import {
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
  Type,
} from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';
import styles from './styles.less';
import { connect } from 'dva';
import { Modal } from 'antd';
import { useIntl } from 'umi';
import { profileFromStorage } from '@/commons/function';

const Swipeable = ({ children, ...props }) => {
  const { calendar, eventStore, dispatch, item, index, onDelete } = props;
  const intl = useIntl();
  const { formatMessage } = intl;
  const profile = profileFromStorage();
  const confirm = Modal.confirm;

  const handleShowDeleteConfirm = () => {
    const payload = {
      eventTypeId: item.id,
    };

    confirm({
      title: formatMessage({ id: 'i18_delete_event_title' }),
      okText: formatMessage({ id: 'i18n_confirm_delete' }),
      okType: 'danger',
      cancelText: formatMessage({ id: 'i18n_cancel_delete' }),
      onOk() {
        dispatch({
          type: 'EVENT/deleteEventType',
          payload,
          callback: () => {
            onDelete(item.id);
          },
        });
        if (window.location.pathname !== '/') {
          history.go(-1);
        }
      },
      onCancel() {},
    });
  };

  const trailingActions = () => (
    <TrailingActions>
      <SwipeAction onClick={() => handleShowDeleteConfirm()}>
        <div className={styles.swipeActionDiv}>削除</div>
      </SwipeAction>
    </TrailingActions>
  );

  return (
    <>
      {item.user_id === profile?.id && (
        <SwipeableListItem
          className="swipeable-item"
          listType={Type.IOS}
          id={index === 0 ? 'first-item' : ''}
          trailingActions={trailingActions()}
          blockSwipe={props.blockSwipe}
        >
          {children}
        </SwipeableListItem>
      )}
      {item.user_id !== profile?.id && (
        <div className="swipeable-item">{children}</div>
      )}
    </>
  );
};
export default connect(({ CALENDAR, EVENT }) => ({
  calendarStore: CALENDAR,
  eventStore: EVENT,
}))(Swipeable);

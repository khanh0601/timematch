import {
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
  Type,
} from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';
import styles from './styles.less';
import { connect } from 'dva';

const Swipeable = ({ children, ...props }) => {
  const { calendar, dispatch, item, index } = props;
  console.log('Swipeable props', props);
  const trailingActions = () => (
    <TrailingActions>
      <SwipeAction
        destructive={true}
        onClick={() => {
          const payload = {
            eventTypeId: item.id,
          };
          dispatch({ type: 'EVENT/deleteEventType', payload });
        }}
      >
        <div className={styles.swipeActionDiv}>削除</div>
      </SwipeAction>
    </TrailingActions>
  );

  return (
    <SwipeableListItem
      className="swipeable-item"
      listType={Type.IOS}
      id={index === 0 ? 'first-item' : ''}
      trailingActions={trailingActions()}
    >
      {children}
    </SwipeableListItem>
  );
};
export default connect(({ CALENDAR }) => ({
  calendarStore: CALENDAR,
}))(Swipeable);

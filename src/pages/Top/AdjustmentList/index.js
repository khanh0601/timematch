import { SwipeableList } from 'react-swipeable-list';
import { history } from 'umi';
import SwipableItem from '../../../components/SwipableItem';
import 'react-swipeable-list/dist/styles.css';
import './styles.css';
const AdjustmentList = props => {
  const { height } = props;
  return (
    <SwipeableList
      className="swipeableList"
      style={{ height: `${height}px` }}
      fullSwipe={true}
    >
      {props.data?.map((item, index) => {
        return (
          <React.Fragment key={index}>
            {props?.renderItem(item, index)}
          </React.Fragment>
        );
      })}
    </SwipeableList>
  );
};

export default AdjustmentList;

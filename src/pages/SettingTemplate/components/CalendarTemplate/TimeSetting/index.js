import React from 'react';
import styles from './index.less';
import { useSelector } from 'umi';

const TimeSetting = () => {
  // store setting template
  const { dataCalendarTemplate } = useSelector(store => store.SETTING_TEMPLATE);
  const { calendar } = dataCalendarTemplate;
  return (
    <div className={styles.timeSetting}>
      <p>
        <div />
        内容
      </p>
      <p>所要時間：{calendar?.block_name ? calendar?.block_name : '30分'}</p>
      <p>
        使用ツール：
        {calendar?.location_name ? calendar?.location_name : 'Zoom'}
      </p>
    </div>
  );
};
export default React.memo(TimeSetting);

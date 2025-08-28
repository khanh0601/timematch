import React, { memo } from 'react';
import styles from './index.less';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useDispatch, useHistory, useSelector } from 'umi';
import {
  SETTING_TEMPLATE,
  STEP_PRE_SETTING_TEMPLATE,
} from '../../../../constant';

const BtnGroupNextPre = memo(({ eventStepNext, eventStepPre }) => {
  const dispatch = useDispatch();
  let { location } = useHistory();

  const { templateActive } = useSelector(store => store.SETTING_TEMPLATE);

  const onPre = () => {
    const { query } = location;
    if (
      query?.type === '3' &&
      templateActive === SETTING_TEMPLATE.calendarTemplate
    ) {
      return;
    }

    dispatch({
      type: 'SETTING_TEMPLATE/onActiveTemplate',
      payload: STEP_PRE_SETTING_TEMPLATE[templateActive],
    });
  };

  return (
    <div className={styles.btnGroupNextPre}>
      <button onClick={onPre}>
        <LeftOutlined className={styles.iconNextLef} />
        <span>戻る</span>
      </button>
      <button onClick={eventStepNext}>
        <span>次へ</span>
        <RightOutlined
          style={{
            fontWeight: 'bold',
          }}
          className={styles.iconNextRight}
        />
      </button>
    </div>
  );
});

export default BtnGroupNextPre;

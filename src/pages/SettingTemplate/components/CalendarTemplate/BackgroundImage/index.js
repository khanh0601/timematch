import React from 'react';
import styles from './index.less';
import { useDispatch, useSelector } from 'umi';

const BackgroundImage = ({ isChooseFile, code, listCss }) => {
  const { dataCalendarTemplate } = useSelector(store => store.SETTING_TEMPLATE);
  const { backgroundImage } = dataCalendarTemplate;
  const dispatch = useDispatch();

  const onChangeOptionSelect = () => {
    if (!isChooseFile) {
      return;
    }
    dispatch({
      type: 'SETTING_TEMPLATE/setOptionSelected',
      payload: code,
    });
  };

  return (
    <div
      className={`${styles.addImage} ${listCss ? listCss : ''}`}
      onClick={onChangeOptionSelect}
      style={{
        backgroundImage: `url(${backgroundImage?.urlImage})`,
        backgroundColor: `${
          backgroundImage?.urlImage ? 'transparent' : '#ececec'
        }`,
      }}
    >
      {!backgroundImage?.urlImage && (
        <>
          <div className={styles.plus}>+</div>
          <p>イメージバナーを貼り付けられます</p>
          <p>対応サイズ：５５０×５５０</p>
        </>
      )}
    </div>
  );
};

export default React.memo(BackgroundImage);

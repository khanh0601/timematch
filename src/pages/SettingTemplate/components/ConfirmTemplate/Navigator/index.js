import React from 'react';
import styles from '../index.less';
import Pen from '../../../../../components/Icon/Pen';
import CheckedWithBox from '../../../../../components/Icon/CheckedWithBox';
import Checked from '../../../../../components/Icon/Checked';
import { connect } from 'dva';
import { INPUT_TYPE } from '../../../../../constant';

const Navigator = props => {
  const { dispatch } = props;

  const handleAddInput = type => {
    dispatch({
      type: 'SETTING_TEMPLATE/addQuestion',
      payload: {
        type,
      },
    });
  };

  return (
    <>
      <div className={styles.title}>
        <p>下記項目を追加・編集できます</p>
      </div>
      <div className={styles.stepItem}>
        <div className={styles.stepHeader}>
          <div className={styles.lineItem}>
            <div className={styles.lineBig} />
            <div className={styles.lineChild} />
          </div>
          <div className={styles.stepName}>
            <p>下記ボタンをクリックして追加ください</p>
          </div>
        </div>
        <div className={styles.stepContent}>
          <div className={styles.groupBtnAdd}>
            <button
              onClick={e => {
                e.stopPropagation();
                handleAddInput(INPUT_TYPE.text);
              }}
            >
              <Pen /> 自由入力
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                handleAddInput(INPUT_TYPE.checkbox);
              }}
            >
              <CheckedWithBox />
              チェックボックス
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                handleAddInput(INPUT_TYPE.policy);
              }}
            >
              <Checked />
              利用規約に同意する
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default connect(({ SETTING_TEMPLATE }) => ({}))(Navigator);

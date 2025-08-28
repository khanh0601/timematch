import React from 'react';
import { Button } from 'antd';
import styles from './index.less';
import ListInput from '../Input/ListInput';

const FormEmbed = () => {
  return (
    <>
      <div className={styles.confirmBooking}>
        <div className={styles.title}>
          <div>
            <div />
          </div>
          <span>下記をご入力ください</span>
        </div>
        <div>
          <ListInput />
        </div>
        <div className={styles.action}>
          <Button type="primary" className={styles.primaryBtn}>
            送信
          </Button>
          <Button className={styles.secondaryBtn}>日時を選び直す</Button>
        </div>
      </div>
    </>
  );
};
export default FormEmbed;

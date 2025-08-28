import React, { useEffect, useState } from 'react';
import styles from './styles.less';
import { useIntl, history } from 'umi';
import { connect } from 'dva';

function Support(props) {
  const { dispatch, masterStore } = props;
  const intl = useIntl();
  const { formatMessage } = intl;

  return (
    <div className={styles.support}>
      <h1>Support</h1>
      <p>お問い合わせの受付時間：08:00~17:00</p>
      <p>問い合わせ電話番号：(+81) 984384387</p>
      <p>休業日：土曜、日曜、祝日、年末年始（12/29-1/3）</p>
      <p>対応するまで予想の待ち時間：1時間</p>
      <p>サポートケース作成のURL：https://smoothly.jp/support</p>
      <p>サポートメール：smoooth.jun@gmail.com</p>
      <p>KB/ForumsのURL：ありません</p>
    </div>
  );
}

export default connect(({ MASTER }) => ({
  masterStore: MASTER,
}))(Support);

import React, { useEffect, useState } from 'react';
import styles from './styles.less';
import { useIntl, history } from 'umi';
import { connect } from 'dva';
import { Button } from 'antd';
import { meetingMethod, getJPFullDate, getStep } from '@/commons/function.js';
import { HOUR_FORMAT } from '@/constant';
import moment from 'moment';

function CloseVote(props) {
  const { choices, eventInfo, userInfo } = props;
  const intl = useIntl();
  const { formatMessage } = intl;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <div className={styles.confirmBooking}>
        <div className={styles.mainContent}>
          <div className={styles.numberAccountContent}>
            <div className={styles.numberAccountBorder}>
              <div className={styles.numberAccountLeft} />
              <div className={styles.numberAccountRight} />
            </div>
            <div className={styles.numberAccountTitle}>完了しました</div>
          </div>
          <div className={styles.contentText}>
            <p>日時を確定いただきありがとうございました。</p>
            <p>
              ミーティング内容の詳細は、ご登録いただいた
              <br />
              メールアドレス宛にご送付しております。
            </p>

            <p className={styles.textFirst}>
              また、ミーティング参加予定の方々にも
              <br />
              ミーティング内容の詳細を
              <span className={styles.textSm}>メールにて</span>
            </p>
            <p>
              <span className={styles.textPC}>メールにて</span>{' '}
              それぞれ通知しております。
            </p>

            <p className={styles.textFirst}>
              ※オンラインミーティングの場合は、
            </p>
            <p>
              ミーティングURLも自動発行及び参加者にも
              <br />
              メールにて自動連絡済みです。
            </p>

            <p className={styles.textFirst}>
              今後とも、Smoothlyをご愛顧いただきますよう
              <br />
              よろしくお願いいたします。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default connect(({}) => ({}))(CloseVote);

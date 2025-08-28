import React from 'react';
import styles from './styles.less';
import { useIntl, history } from 'umi';
import { Button } from 'antd';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import moment from 'moment';
import { getJPFullDate } from '@/commons/function.js';
import { HOUR_FORMAT } from '@/constant';

function CancelBookingComplete(props) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const { detailCalendar } = props;
  return detailCalendar && detailCalendar.event ? (
    <div className={styles.cancelBookingLayout}>
      <Header />
      <div className={styles.cancelBookingComplete}>
        <div className={styles.progressBar}>
          <div className={styles.firstStep}>
            <span>1</span>
            <p>{formatMessage({ id: 'i18n_confirm_content' })}</p>
          </div>
          <div className={styles.dottedBar}></div>
          <div className={`${styles.secondStep} ${styles.activeStep}`}>
            <span>2</span>
            <p>{formatMessage({ id: 'i18n_cancel_done' })}</p>
          </div>
        </div>
        <div className={styles.pageTitle}>
          <div className={styles.titleIcon}></div>
          <span>
            {formatMessage({
              id: 'i18n_payment_cancel_booking_complete_title',
            })}
          </span>
        </div>
        <div className={styles.content}>
          <div className={styles.divTitle}>
            <div className={styles.blackIcon}></div>
            <span>{formatMessage({ id: 'i18n_content_label' })}</span>
          </div>
          <div className={styles.detail}>
            <p>
              <strong>
                {getJPFullDate(detailCalendar.start_time)}
                {moment(detailCalendar.start_time).format('(dd)')} &nbsp;
                {moment(detailCalendar.start_time).format(HOUR_FORMAT)}～
                {moment(detailCalendar.start_time)
                  .add(detailCalendar.block_number, 'minutes')
                  .format('HH:mm')}
              </strong>
            </p>
            <p>
              (内容：イベント時間{detailCalendar.block_number}分
              {detailCalendar.move_number
                ? `往復移動時間${detailCalendar.move_number * 2}分`
                : '往復移動時間なし'}
              )
            </p>
            <div className={styles.ownerInformation}>
              <p>{detailCalendar.owner_company}</p>
              <p>{detailCalendar.owner_name}</p>
            </div>
            <p>
              {formatMessage({ id: 'i18n_meeting_format' })}：
              {detailCalendar.category_name}
            </p>
            <p>
              {formatMessage({ id: 'i18n_meeting_place' })}：
              {detailCalendar.location_name}
            </p>
          </div>
        </div>
        <div className={styles.btnZone}>
          <Button
            className={styles.confirmCancelBtn}
            onClick={() => history.push('/')}
          >
            {formatMessage({ id: 'i18n_return_home' })}
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  ) : (
    formatMessage({ id: 'i18n_404_not_found' })
  );
}

export default CancelBookingComplete;

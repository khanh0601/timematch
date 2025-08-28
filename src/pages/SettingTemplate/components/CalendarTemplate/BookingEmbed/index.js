import React, { useState } from 'react';

import styles from './index.less';
import { useDispatch, useSelector } from 'umi';
import moment from 'moment';
import iNextPre from '@/assets/images/next-pre.svg';
import iNextTop from '@/assets/images/next-top.svg';
import { YYYYMMDD, YYYYMMDDTHHmm } from '../../../../../constant';
import { Spin } from 'antd';

const BookingEmbed = ({
  onNextWeek,
  onPreWeek,
  onBooking,
  listDateBooking,
  isPreview,
  dataUndefined,
  code,
}) => {
  // store setting template
  const { dataCalendarTemplate } = useSelector(store => store.SETTING_TEMPLATE);

  // store event
  const { isLoading } = useSelector(store => store.EVENT);
  // store account team
  const { tabLoading } = useSelector(store => store.ACCOUNT_TEAM);

  const { hideTitleCalendar } = dataCalendarTemplate;
  const [currentIndexWeek, setCurrentIndexWeek] = useState(0);
  const [currentDate, setCurrentDate] = useState(moment().format(YYYYMMDD));
  const [delta, setDeltaWeek] = useState(7);
  const dispatch = useDispatch();

  const onChangeOptionSelect = () => {
    if (!isPreview) {
      return;
    }
    dispatch({
      type: 'SETTING_TEMPLATE/setOptionSelected',
      payload: code,
    });
  };

  // render components toolbox with template select
  const renderListBooking = () => {
    if (dataUndefined) {
      return (
        <div className={styles.dataUndefined}>
          <span>この週は候補日時がありません。</span>
        </div>
      );
    }
    return listDateBooking.map((item, indexEvent) => {
      const { date, listBlockTime } = item;
      let indexDivHide = false;
      if (listBlockTime && listBlockTime.length) {
        const remainder = listBlockTime.length % 3;
        indexDivHide = remainder === 2;
      }

      return (
        <div key={indexEvent} className={styles.calenderItem}>
          <h3 className={styles.title}>{date}</h3>

          {listBlockTime && listBlockTime.length > 0 && (
            <div className={styles.listBooking}>
              {listBlockTime.map((itemBlock, indexTime) => (
                <div key={indexTime} onClick={() => onBookingEmbed(itemBlock)}>
                  {moment(itemBlock.start_time, YYYYMMDDTHHmm).format('HH:mm') +
                    '-' +
                    moment(itemBlock.end_time, YYYYMMDDTHHmm).format('HH:mm')}
                </div>
              ))}

              {indexDivHide && <div className={styles.divHide} />}
            </div>
          )}

          {!listBlockTime.length && <span>※この日は候補日時がありません</span>}
        </div>
      );
    });
  };

  const onNextWeekEmbed = () => {
    if (isPreview) {
      return;
    }
    const indexWeek = currentIndexWeek + 1;
    const startDateOfWeek = moment(currentDate)
      .add(indexWeek * delta, 'days')
      .format(YYYYMMDD);

    setCurrentIndexWeek(indexWeek);
    onNextWeek(startDateOfWeek, indexWeek);
  };

  const onPreWeekEmbed = () => {
    if (isPreview || !currentIndexWeek) {
      return;
    }
    const indexWeek = currentIndexWeek - 1;
    const startDateOfWeek = moment(currentDate)
      .add(indexWeek * delta, 'days')
      .format(YYYYMMDD);
    setCurrentIndexWeek(indexWeek);
    onPreWeek(startDateOfWeek, indexWeek);
  };

  const onBookingEmbed = itemDate => {
    if (isPreview) {
      return;
    }
    onBooking(itemDate);
  };

  return (
    <Spin spinning={tabLoading || isLoading}>
      <div
        className={styles.calendarBookingTemplate}
        onClick={onChangeOptionSelect}
      >
        {!hideTitleCalendar && (
          <div className={styles.commonTitle}>
            <div />
            <div>
              <h3 style={{ fontWeight: 'bold' }}>
                下記よりご都合の良い日時を選択ください。
              </h3>
              <span>※右側にスライドでき、他の日時を選択できます。</span>
            </div>
          </div>
        )}

        <div className={styles.nextWeek}>
          <button
            className={`${currentIndexWeek ? styles.active : ''}`}
            onClick={onPreWeekEmbed}
          >
            <img src={iNextPre} alt="smoothly" />
            <span>前週</span>
          </button>

          <button onClick={onNextWeekEmbed}>
            <span>翌週</span>
            <img src={iNextTop} alt="smoothly" />
          </button>
        </div>
        <div className={styles.calendarForm}>{renderListBooking()}</div>
      </div>
    </Spin>
  );
};

export default React.memo(BookingEmbed);

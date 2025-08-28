import React, { useEffect, useState } from 'react';
import styles from './styles.less';
import { Row, Col, Spin, Layout, Button } from 'antd';
import pinned from '@/assets/images/i-pinned.svg';
import user from '@/assets/images/i-user.png';
import comment from '@/assets/images/i-comment.svg';
import moment from 'moment';
import {
  HOUR_FORMAT,
  YYYYMMDD,
  FULL_DATE_HOUR,
  DATE_TIME_TYPE,
  YYYYMMDDTHHmm,
} from '@/constant';
import { useIntl, history } from 'umi';
import { connect } from 'dva';
import {
  meetingMethod,
  convertMinToHour,
  getStep,
  genPriorityBlock,
} from '@/commons/function.js';
import BookingCalendar from '@/components/BookingCalendar';
import logoImage from '@/assets/images/logo-black.svg';
import HeaderPreview from '@/components/HeaderPreview';
import Footer from '@/components/Footer';
import MenuSPBottom from '@/components/MenuSPBottom';
import { getWeekDuration } from '@/commons/function';

function Preview(props) {
  const {
    eventStore,
    masterStore,
    previewData,
    onBack,
    defaultFreeTime,
    currentPeriod,
  } = props;
  const { listBookedSchedule, firstSetupFreeTime } = eventStore;
  const { profile } = masterStore;
  const intl = useIntl();
  const { formatMessage } = intl;
  const [currentStep, setCurrentStep] = useState(1);
  const [linkIsUsed, setLinkIsUsed] = useState(false);
  const [listTimeFrame, setListTimeFrame] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [listPreviewBlock, setListPreviewBlock] = useState([]);
  const [listBookedTime, setListBookedTime] = useState([]);
  const currentWeekDay = moment().weekday();
  let defaultCalendarTime = [];

  for (let i = 0; i < 7; i++) {
    if (
      previewData &&
      (moment()
        .weekday(currentWeekDay + i)
        .weekday() === 6 ||
        moment()
          .weekday(currentWeekDay + i)
          .weekday() === 0) &&
      (!previewData.default_start_time || !previewData.default_end_time)
    ) {
      defaultCalendarTime.push({
        day_of_week: currentWeekDay + i,
        thisDay: moment()
          .weekday(currentWeekDay + i)
          .format(YYYYMMDD),
        status: 0,
        srcId: i,
      });
    } else {
      defaultCalendarTime.push({
        day_of_week: currentWeekDay + i,
        start: moment()
          .weekday(currentWeekDay + i)
          .hour(9)
          .minute(0)
          .second(0)
          .format(YYYYMMDDTHHmm),
        end: moment()
          .weekday(currentWeekDay + i)
          .hour(18)
          .minute(0)
          .second(0)
          .format(YYYYMMDDTHHmm),
        start_time: moment()
          .weekday(currentWeekDay + i)
          .hour(9)
          .minute(0)
          .second(0)
          .format(YYYYMMDDTHHmm),
        end_time: moment()
          .weekday(currentWeekDay + i)
          .hour(18)
          .minute(0)
          .second(0)
          .format(YYYYMMDDTHHmm),
        thisDay: moment()
          .weekday(currentWeekDay + i)
          .format(YYYYMMDD),
        status: 1,
        srcId: i,
      });
    }
  }

  useEffect(() => {
    if (listBookedSchedule.length > 0) {
      const booked = listBookedSchedule.map(item => {
        const stepLength = getStep(item);
        item.start = moment(item.start_time).format(YYYYMMDDTHHmm);
        item.end = moment(item.start_time)
          .add(stepLength, 'm')
          .format(YYYYMMDDTHHmm);
        item.end_time = moment(item.start_time)
          .add(stepLength, 'm')
          .format(YYYYMMDDTHHmm);
        item.isBooked = true;
        item.editable = false;
        item.overlap = true;
        item.status = 1;
        return item;
      });
      setListBookedTime(booked);
    }
  }, [listBookedSchedule]);

  useEffect(() => {
    if (previewData && previewData.event_datetimes) {
      setStartDate(moment().format(YYYYMMDD));
      setListPreviewBlock(previewData.event_datetimes);
    }
  }, [previewData]);

  const findMin = arr => {
    let result = arr[0].start_time;
    arr.map(item => {
      if (moment(item.start_time).isBefore(moment(result)) || !result) {
        result = item.start_time;
      }
    });
    return result;
  };

  const findMaxSrcId = arr => {
    let result = arr[0].srcId;
    arr.map(item => {
      if (item.srcId > result || !result) {
        result = item.srcId;
      }
    });
    return result;
  };

  useEffect(() => {
    if (listPreviewBlock.length) {
      let result = [];
      const listPreviewBlockClone = JSON.parse(
        JSON.stringify(listPreviewBlock),
      );
      listPreviewBlockClone.map(item => {
        item.start_time = moment(item.start_time).format(YYYYMMDDTHHmm);
        item.end_time = moment(item.end_time).format(YYYYMMDDTHHmm);
        item.start = moment(item.start).format(YYYYMMDDTHHmm);
        item.end = moment(item.end).format(YYYYMMDDTHHmm);
        item.thisDay = moment(item.start_time).format(YYYYMMDD);
        if (!!item.status) {
          const splitedArr = splitListFreeTime(
            getStep(previewData),
            moment(item.start_time).format(YYYYMMDD),
            item,
            result,
          );
          if (splitedArr && splitedArr.length) {
            result = [...splitedArr, ...result];
          }
        }
      });
      if (result.length) {
        let finalResult = [];
        if (previewData.reservation_number && result.length) {
          let current = moment(result[0].start_time).format(YYYYMMDD);
          let count = 0;
          result.map(item => {
            if (!item.custom_type) {
              if (
                current === moment(item.start_time).format(YYYYMMDD) &&
                count < Number(previewData.reservation_number)
              ) {
                finalResult.push(item);
                count++;
              }
              if (current !== moment(item.start_time).format(YYYYMMDD)) {
                finalResult.push(item);
                current = moment(item.start_time).format(YYYYMMDD);
                count = 1;
              }
            } else {
              finalResult.push(item);
            }
          });
        } else {
          finalResult = [...result];
        }
        setListTimeFrame(finalResult);
      }
    }
  }, [previewData, listPreviewBlock, listBookedSchedule]);

  const splitListFreeTime = (
    block_time,
    chosenDate,
    item,
    currentResult,
    nextValue = 0,
    isChangeWeek = false,
  ) => {
    const listPriority = genPriorityBlock(
      nextValue,
      previewData,
      firstSetupFreeTime,
    );
    let result = [];
    if (moment(item.start_time).format(YYYYMMDD) === chosenDate) {
      let index = 1;
      if (item) {
        let chosenEndTime = item.end_time;
        let chosenStartTime = item.start_time;
        while (moment(chosenStartTime).isBefore(moment(chosenEndTime))) {
          let blockEndTime = moment(chosenStartTime).add(block_time, 'm');
          const listBookedScheduleClone = JSON.parse(
            JSON.stringify(listBookedSchedule),
          );
          const checkDuplicate = listBookedScheduleClone.find(dup => {
            const stepLength = dup.block_number;
            dup.start_time = moment(dup.start_time).format(YYYYMMDDTHHmm);
            dup.end_time = moment(dup.start_time)
              .add(stepLength / 60, 'h')
              .format(YYYYMMDDTHHmm);

            const compareStart = moment(chosenStartTime).format(YYYYMMDDTHHmm);
            const compareEnd = moment(blockEndTime).format(YYYYMMDDTHHmm);
            const compareStartDup = moment(dup.start_time).format(
              YYYYMMDDTHHmm,
            );
            const compareEndDup = moment(dup.end_time).format(YYYYMMDDTHHmm);

            return (
              (moment(compareStart).isBetween(
                moment(compareStartDup),
                moment(compareEndDup),
                undefined,
                '[)',
              ) ||
                moment(compareEnd).isBetween(
                  moment(compareStartDup),
                  moment(compareEndDup),
                  undefined,
                  '(]',
                )) &&
              moment(chosenDate).weekday() === moment(dup.start_time).weekday()
            );
          });
          if (
            !checkDuplicate ||
            item.custom_type === DATE_TIME_TYPE.customize
          ) {
            let startTime = moment(chosenStartTime);
            let endTime = moment(chosenEndTime);
            let newEndTime = moment(
              moment(chosenStartTime).add(block_time, 'm'),
            );

            //Check user book before 'reception_start_time' hours
            let reception_start_time = previewData.reception_start_time
              ? previewData.reception_start_time
              : 0;
            const startTimeClone = JSON.parse(JSON.stringify(startTime));
            let nearest_time = moment(startTimeClone).subtract(
              reception_start_time,
              'minutes',
            );
            //Check lastest time to book
            let reception_end_time = previewData.reception_end_time
              ? previewData.reception_end_time
              : 0;
            const endTimeClone = JSON.parse(JSON.stringify(endTime));
            let stop_booking_time = moment(endTimeClone).subtract(
              reception_end_time,
              'minutes',
            );

            //Check time frame in snap time
            let isInSnapTime =
              (moment(chosenStartTime).isSameOrAfter(
                moment(`${item.thisDay}T${previewData.lunch_break_start_time}`),
              ) &&
                moment(chosenStartTime).isBefore(
                  moment(`${item.thisDay}T${previewData.lunch_break_end_time}`),
                )) ||
              (moment(newEndTime).isAfter(
                moment(`${item.thisDay}T${previewData.lunch_break_start_time}`),
              ) &&
                moment(newEndTime).isSameOrBefore(
                  moment(`${item.thisDay}T${previewData.lunch_break_end_time}`),
                ));

            //Check priority time
            const checkPriority = isChangeWeek
              ? !listPriority.some(pri => {
                  pri.start = pri.start_time;
                  pri.end = moment(pri.start_time)
                    .add(getStep(previewData), 'm')
                    .format(YYYYMMDDTHHmm);
                  pri.end_time = moment(pri.start_time)
                    .add(getStep(pri), 'm')
                    .format(YYYYMMDDTHHmm);
                  return (
                    (moment(chosenStartTime).isBetween(
                      moment(pri.start),
                      moment(pri.end),
                    ) ||
                      moment(newEndTime).isBetween(
                        moment(pri.start),
                        moment(pri.end),
                      ) ||
                      (moment(pri.start).isSameOrAfter(
                        moment(chosenStartTime),
                      ) &&
                        moment(pri.end).isSameOrBefore(moment(newEndTime)))) &&
                    moment(pri.start).format(YYYYMMDD) ===
                      moment(chosenStartTime).format(YYYYMMDD)
                  );
                })
              : true;
            if (
              moment(chosenStartTime).isAfter(
                moment(moment().format(YYYYMMDDTHHmm)),
              ) &&
              moment().isBefore(moment(nearest_time)) &&
              !isInSnapTime &&
              moment(moment(newEndTime).format(YYYYMMDDTHHmm)).isSameOrBefore(
                moment(chosenEndTime),
              ) &&
              checkPriority &&
              !!item.status
            ) {
              result.push({
                id: `${item.day_of_week}-${index}`,
                start: moment(chosenStartTime).format(YYYYMMDDTHHmm),
                end: moment(newEndTime).isAfter(moment(chosenEndTime))
                  ? endTime.format(YYYYMMDDTHHmm)
                  : newEndTime.format(YYYYMMDDTHHmm),
                start_time: moment(chosenStartTime).format(YYYYMMDDTHHmm),
                end_time: newEndTime.format(YYYYMMDDTHHmm),
                day_of_week:
                  moment(chosenStartTime).weekday() === 0
                    ? 7
                    : moment(chosenStartTime).weekday(),
                thisDay: moment(chosenStartTime).format(YYYYMMDD),
                status: 1,
                srcId:
                  moment(chosenStartTime).weekday() === 0
                    ? 7
                    : moment(chosenStartTime).weekday(),
                custom_type: item.custom_type,
              });
            }
          }

          chosenStartTime = moment(chosenStartTime).add(
            block_time + previewData.relax_time,
            'm',
          );
          index++;
        }
      }
    }
    return result;
  };
  const genDefaultWeek = nextValue => {
    let defaultFreeTimeClone = [];
    if (previewData.default_start_time && previewData.default_end_time) {
      for (let i = 0; i < 7; i++) {
        const curDate = moment()
          .add(nextValue * 7, 'd')
          .format(YYYYMMDD);
        const startTime = `${curDate}T${previewData.default_start_time}`;
        const endTime = `${curDate}T${previewData.default_end_time}`;
        defaultFreeTimeClone.push({
          day_of_week: currentWeekDay + nextValue + i,
          start: moment(startTime)
            .add(i, 'd')
            .format(YYYYMMDDTHHmm),
          start_time: moment(startTime)
            .add(i, 'd')
            .format(YYYYMMDDTHHmm),
          end: moment(endTime)
            .add(i, 'd')
            .format(YYYYMMDDTHHmm),
          end_time: moment(endTime)
            .add(i, 'd')
            .format(YYYYMMDDTHHmm),
          thisDay: moment(startTime)
            .add(i, 'd')
            .format(YYYYMMDD),
          status: 1,
          srcId: i,
          custom_type: 1,
        });
      }
    }

    if (!previewData.default_start_time || !previewData.default_end_time) {
      defaultFreeTimeClone = JSON.parse(JSON.stringify(defaultFreeTime));
      defaultFreeTimeClone.map(def => {
        (def.day_of_week = def.day_of_week + nextValue * 7),
          (def.end = moment(def.end)
            .add(nextValue * 7, 'd')
            .format(YYYYMMDDTHHmm)),
          (def.end_time = moment(def.end_time)
            .add(nextValue * 7, 'd')
            .format(YYYYMMDDTHHmm)),
          (def.srcId = findMaxSrcId(listPreviewBlock) + 1),
          (def.start = moment(def.start)
            .add(nextValue * 7, 'd')
            .format(YYYYMMDDTHHmm)),
          (def.start_time = moment(def.start_time)
            .add(nextValue * 7, 'd')
            .format(YYYYMMDDTHHmm)),
          (def.status = def.status),
          (def.thisDay = moment(def.thisDay)
            .add(nextValue * 7, 'd')
            .format(YYYYMMDD)),
          (def.custom_type = 1);
      });
    }
    let result = [];
    const stepLength = getStep(previewData);
    defaultFreeTimeClone.map((item, index) => {
      const splitedArr = splitListFreeTime(
        stepLength,
        moment(item.start_time).format(YYYYMMDD),
        item,
        result,
        nextValue,
        true,
      );
      if (splitedArr && splitedArr.length) {
        result = [...splitedArr, ...result];
      }
    });

    let finalResult = [];
    let startDateInWeek = moment()
      .add(nextValue * 7, 'd')
      .format(YYYYMMDD);
    let endDateInWeek = moment()
      .add((nextValue + 1) * 7, 'd')
      .format(YYYYMMDD);
    if (previewData.reservation_number && result.length) {
      let current = moment(result[0].start_time).format(YYYYMMDD);
      let count = 0;
      result.map(item => {
        item.thisDay = moment(item.thisDay).format(YYYYMMDD);
        if (
          moment(item.thisDay).isSameOrAfter(moment(startDateInWeek)) &&
          moment(item.thisDay).isBefore(moment(endDateInWeek))
        ) {
          if (!item.custom_type) {
            if (
              current === moment(item.start_time).format(YYYYMMDD) &&
              count < Number(previewData.reservation_number)
            ) {
              finalResult.push(item);
              count++;
            }
            if (current !== moment(item.start_time).format(YYYYMMDD)) {
              finalResult.push(item);
              current = moment(item.start_time).format(YYYYMMDD);
              count = 1;
            }
          } else {
            finalResult.push(item);
          }
        }
      });
    } else {
      finalResult = [
        ...result.filter(item => {
          item.thisDay = moment(item.thisDay).format(YYYYMMDD);
          return (
            moment(item.thisDay).isSameOrAfter(moment(startDateInWeek)) &&
            moment(item.thisDay).isBefore(moment(endDateInWeek))
          );
        }),
      ];
    }
    return finalResult;
  };

  const changeWeek = (value, isPrev = false) => {
    if (value < (previewData.period ? previewData.period : 999999)) {
      const listPriority = genPriorityBlock(
        value,
        previewData,
        firstSetupFreeTime,
      );
      let result = [];
      const listDate = JSON.parse(JSON.stringify(previewData.event_datetimes));
      if (
        (getWeekDuration(listPreviewBlock) === 1 ||
          (getWeekDuration(listPreviewBlock) > 1 &&
            value >= getWeekDuration(listPreviewBlock))) &&
        !isPrev
      ) {
        result = genDefaultWeek(value);
      }
      if (
        getWeekDuration(listPreviewBlock) > 1 &&
        value < getWeekDuration(listPreviewBlock) &&
        isPrev
      ) {
        const prevValue = -1;
        listDate.map(free => {
          if (
            moment(free.start_time)
              .add(prevValue * 7, 'd')
              .isSameOrBefore(
                moment(startDate).add(
                  (previewData.period ? previewData.period : 99999) * 7,
                  'd',
                ),
              )
          ) {
            result.push({
              start_time: moment(free.start_time)
                .add(prevValue * 7, 'd')
                .format(YYYYMMDDTHHmm),
              end_time: moment(free.end_time)
                .add(prevValue * 7, 'd')
                .format(YYYYMMDDTHHmm),
              start: moment(free.start_time)
                .add(prevValue * 7, 'd')
                .format(YYYYMMDDTHHmm),
              end: moment(free.end_time)
                .add(prevValue * 7, 'd')
                .format(YYYYMMDDTHHmm),
              day_of_week: free.day_of_week + 7,
              status: free.status,
              custom_type: free.custom_type,
              thisDay: moment(free.start_time)
                .add(prevValue * 7, 'd')
                .format(YYYYMMDD),
            });
          }
        });
      }
      if (
        getWeekDuration(listPreviewBlock) === 1 &&
        value < getWeekDuration(listPreviewBlock) &&
        isPrev
      ) {
        result = JSON.parse(JSON.stringify(previewData.event_datetimes));
      }
      if (
        isPrev &&
        getWeekDuration(listPreviewBlock) === 1 &&
        value >= getWeekDuration(listPreviewBlock)
      ) {
        result = genDefaultWeek(value);
      }
      if (result.length > 0) {
        if (
          getWeekDuration(listPreviewBlock) > 1 &&
          !isPrev &&
          value >= getWeekDuration(listPreviewBlock)
        ) {
          setListPreviewBlock([
            ...listPreviewBlock,
            ...result,
            ...listPriority,
          ]);
        }
        if (getWeekDuration(listPreviewBlock) === 1) {
          setListPreviewBlock([...result, ...listPriority]);
        }
      }
    }
  };
  return (
    <Layout className={styles.mainLayout}>
      <HeaderPreview />
      {linkIsUsed ? (
        <Spin className="loading-page" size="large" />
      ) : (
        <div className={styles.mainContent}>
          <div className={styles.backToList}>
            <div className={`${styles.noticeText}`}>
              <p>
                こちらが、調整相手に表示するプレビュー画面です。
                <br className={styles.desktop} />
                ご確認ください。
              </p>
            </div>
            <div className={styles.btnZone}>
              <Button onClick={() => onBack()}>戻る</Button>
            </div>
          </div>
          <div className={styles.scheduleAdjustment}>
            {currentStep !== 4 && (
              <>
                {' '}
                <p className={styles.intruction}>
                  {formatMessage({
                    id: 'i18n_schedule_adjustment_intruction1',
                  })}
                  <br className={styles.mobile} />
                  {formatMessage({
                    id: 'i18n_schedule_adjustment_intruction2',
                  })}
                </p>
                <div className={styles.progressBar}>
                  <div
                    className={`${styles.firstStep} ${
                      currentStep === 1 ? styles.activeStep : ''
                    }`}
                  >
                    <span>1</span>
                    <p>{formatMessage({ id: 'i18n_step_1_in_preview' })}</p>
                  </div>
                  <div className={styles.dottedBar}></div>
                  <div
                    className={`${styles.secondStep} ${
                      currentStep === 2 ? styles.activeStep : ''
                    }`}
                  >
                    <span>2</span>
                    <p>{formatMessage({ id: 'i18n_step_2_in_preview' })}</p>
                  </div>
                  <div
                    className={`${styles.thirdStep} ${
                      currentStep === 3 ? styles.activeStep : ''
                    }`}
                  >
                    <span>3</span>
                    <p>{formatMessage({ id: 'i18n_detail_info_step' })}</p>
                  </div>
                </div>
              </>
            )}
            {(currentStep === 1 || currentStep === 2) && (
              <div className={styles.firstStepDetail}>
                <div className={styles.bigTitle}>
                  <div className={styles.bolderIcon}></div>
                  <div className={styles.titleIcon}></div>
                  <span>1 :ミーティング内容の確認</span>
                </div>
                <Row>
                  <Col sm={8} xs={24}>
                    <p className={styles.pinnedText}>
                      <img src={user} />
                      {formatMessage({ id: 'i18n_user_info_booking' })}
                    </p>
                    <div className={styles.userInfo}>
                      {profile.avatar ? (
                        <div className={styles.avatar}>
                          <img src={profile.avatar} />
                        </div>
                      ) : (
                        <div className={styles.defaultAvatar}>
                          <img src={logoImage} />
                        </div>
                      )}
                      <p>
                        <span className={styles.infoCompany}>
                          {profile.company}
                        </span>
                        {profile.company ? <br /> : null}
                        <span className={styles.infoName}>{profile.name}</span>
                      </p>
                    </div>
                  </Col>
                  <Col sm={8} xs={24}>
                    <div className={styles.meetingInfo}>
                      <p className={styles.pinnedText}>
                        <img src={pinned} />
                        {formatMessage({ id: 'i18n_meeting' })}
                      </p>
                      <p className={styles.meetingDetail}>
                        {formatMessage({ id: 'i18n_required_time' })}：
                        {previewData.block_number}
                        {formatMessage({ id: 'i18n_minute' })}
                        <br />
                        {formatMessage({ id: 'i18n_meeting_formality' })}：
                        {previewData.category_name}
                        <br />
                        {formatMessage({ id: 'i18n_meeting_method' })}：
                        <span className={styles.meetingMethod}>
                          {meetingMethod(previewData)}
                        </span>
                      </p>
                    </div>
                  </Col>
                  <Col sm={8} xs={24}>
                    <div className={styles.meetingComment}>
                      <p className={styles.pinnedText}>
                        <img src={comment} />
                        {profile.name}
                        {formatMessage({ id: 'i18n_comment_from' })}
                      </p>
                      <p>{previewData.calendar_create_comment}</p>
                    </div>
                  </Col>
                </Row>
                <div className={styles.secondStepHeader}>
                  <div className={styles.bigTitle}>
                    <div className={styles.bolderIcon}></div>
                    <div className={styles.titleIcon}></div>
                    <span>2 :ご都合のいい日時を下記より選択</span>
                  </div>
                </div>
                <Row>
                  <Col span={24}>
                    <div className={styles.calendar}>
                      <BookingCalendar
                        listTimeFrame={[...listTimeFrame, ...listBookedTime]}
                        onSelectTime={frame => {}}
                        eventInfo={previewData}
                        nextWeek={changeWeek}
                        prevWeek={value => changeWeek(value, true)}
                        currentPeriodForPreview={currentPeriod}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            )}
          </div>
        </div>
      )}
      <Footer />
      <MenuSPBottom />
    </Layout>
  );
}

export default connect(({ EVENT, MASTER }) => ({
  eventStore: EVENT,
  masterStore: MASTER,
}))(Preview);

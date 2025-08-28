import comment from '@/assets/images/i-comment.svg';
import pinned from '@/assets/images/i-pinned.svg';
import user from '@/assets/images/i-user.png';
import logoImage from '@/assets/images/logo-black.svg';
import {
  checkEventBooked,
  getCookie,
  getStep,
  isOverlap,
  meetingMethod,
  filterReceptionTime,
  canStartAt,
  groupBy,
  splitRange,
  getJPFullDate,
} from '@/commons/function';
import BookingCalendar from '@/components/BookingCalendar';
import Footer from '@/components/Footer';
import HeaderPreview from '@/components/HeaderPreview';
import MenuSPBottom from '@/components/MenuSPBottom';
import { FORMAT_DATE, YYYYMMDD, YYYYMMDDTHHmm } from '@/constant';
import { Button, Col, Layout, Row, Spin, Modal, Divider } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { history, useIntl } from 'umi';
import BookingFinalStep from './BookingFinalStep';
import styles from './styles.less';
import SuccessVote from '../Vote/SuccessVote';
import { HOUR_FORMAT } from '../../constant';
import { createTimeAsync, deepCopyData } from '../../commons/function';
import { CloseOutlined } from '@ant-design/icons';
import useWindowDimensions from '@/commons/useWindowDimensions';
import LoginFree from '../../components/LoginFree';

function ScheduleAdjustment(props) {
  const { dispatch, eventStore } = props;
  const {
    userByCode,
    listFreeDay,
    firstSetupFreeTime,
    listBookedSchedule,
    eventCustomizeDates,
    isLoading,
  } = eventStore;

  let { guestEventClients } = eventStore;
  const isLogin = getCookie('token');
  const intl = useIntl();
  const { formatMessage } = intl;
  const [eventInfo, setEventInfo] = useState({});
  const [selectedTime, setSelectedTime] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [linkIsUsed, setLinkIsUsed] = useState(true);
  const [fetchedData, setFetchedData] = useState(false);
  const [modalInforSm, setModalInforSm] = useState(false);
  const [listBookedTimeUser, setListBookedTimeUser] = useState([]);
  const bookingState = true;
  const [payload, setPayload] = useState(() => {
    let result = {
      event_code: history.location.query.event_code,
    };
    if (!history.location.query.once) {
      result.user_code = history.location.query.user_code;
    }
    return result;
  });
  const [currentIndexWeek, setCurrentIndexWeek] = useState(0);

  const [datetimes, setDateTimes] = useState([]);
  const [isFirstLoad, setIsFirstLoad] = useState(false);
  const [listDataFreeTime, setListDataFreeTime] = useState([]);
  const [reloadRealTime, setReloadRealTime] = useState(false);
  // data booked real time
  const [removeDataBookedRealTime, setRemoveDataBookedRealTime] = useState({
    isBooked: false,
    dataBooked: [],
  });
  const [reloadDataWeek, setReloadDataWeek] = useState(false);
  const { width } = useWindowDimensions();
  const [delta, setDelta] = useState(7);
  const [currentDate, setCurrentDate] = useState('');
  const [isCurrentDateNew, setCurrentDateNew] = useState(false);

  useEffect(() => {
    const syncDateNew = async () => {
      const { startTime, endTime } = createTimeAsync(currentDate);
      const data = await dispatch({
        type: 'EVENT/getGuestEventClient',
        payload: {
          ...payload,
          need_sync: true,
          start: startTime,
          end: endTime,
        },
      });

      generateCurrentWeekValidTime(startTime, data);

      setCurrentDateNew(false);
      setReloadDataWeek(true);
    };

    if (isCurrentDateNew) {
      syncDateNew();
    }
  }, [isCurrentDateNew]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, []);

  // handle data booked real time
  useEffect(() => {
    const { isBooked, dataBooked } = removeDataBookedRealTime;
    if (isBooked) {
      const { move_number } = eventInfo;
      let listDateTime = [];
      dataBooked.forEach(item => {
        // remove reserved block
        // for (const [key, value] of Object.entries(datetimes)) {
        listDateTime = datetimes.filter(dt => {
          const start = moment(item.start_time).subtract(
            item.block_number,
            'minutes',
          );
          const end = moment(item.start_time).add(item.block_number, 'minutes');
          let timeStartDt = dt.start_time;
          let timeEndDt = dt.end_time;
          if (move_number) {
            timeStartDt = moment(dt.start_time)
              .subtract(move_number, 'm')
              .format(YYYYMMDDTHHmm);
            timeEndDt = moment(dt.end_time)
              .add(move_number, 'm')
              .format(YYYYMMDDTHHmm);
          }
          if (isOverlap(start, end, timeStartDt, timeEndDt)) {
            return false;
          }

          return true;
        });
        // }
      });
      setDateTimes(listDateTime);
      setRemoveDataBookedRealTime({
        isBooked: false,
        dataBooked: [],
      });
      setReloadDataWeek(true);
    }
  }, [removeDataBookedRealTime]);

  useEffect(() => {
    if (width <= 768) {
      setDelta(3);
      setModalInforSm(true);
    }
  }, []);

  useEffect(() => {
    // handle data when data new
    if (reloadDataWeek) {
      setListDataFreeTime(getListFreeTime());
      setReloadDataWeek(false);
    }
  }, [reloadDataWeek]);

  useEffect(() => {
    if (reloadRealTime) {
      // rerender all data
      generateCurrentWeekValidTime(currentDate);
      setReloadDataWeek(true);
      setReloadRealTime(false);
    }
  }, [reloadRealTime]);

  useEffect(() => {
    if (!isFirstLoad) {
      return;
    }
    handleBookedSchedule();
  }, [listBookedSchedule]);

  // Handle data
  useEffect(() => {
    // handle data load first time
    if (fetchedData) {
      connectChannelUpdateEvent(eventInfo.id);
      connectChannelUpdateUserCalendar(eventInfo.user_id);

      handleBookedSchedule();

      let firstDate = null;
      let curDate = moment().format(FORMAT_DATE);
      let count = 5;

      do {
        firstDate = generateCurrentWeekValidTime(curDate, null, true);
        count--;

        if (firstDate) {
          generateCurrentWeekValidTime(firstDate);
          // setCurrentDate(firstDate);
        } else if (count < 0) {
          generateCurrentWeekValidTime(curDate);
        }

        curDate = moment(curDate)
          .add(7, 'days')
          .format(FORMAT_DATE);
      } while (!firstDate && count > 0);
      setCurrentDate(firstDate ? firstDate : curDate);
      setIsFirstLoad(true);
      if (firstDate) {
        setCurrentDateNew(true);
      }
      if (!firstDate) {
        setReloadDataWeek(true);
      }
    }
  }, [fetchedData]);

  useEffect(() => {
    const { start_time, end_time } = history.location.query;
    if (start_time && end_time) {
      setCurrentStep(2);
      setSelectedTime({
        start_time: moment(Number(start_time)).format('YYYY-MM-DDTHH:mm'),
        end_time: moment(Number(end_time)).format('YYYY-MM-DDTHH:mm'),
      });
    }
  }, [history.location.query.start_time, history.location.query.end_time]);

  const fetchData = async () => {
    await checkEventCode(payload);
    const bookedPayload = {
      event_code: history.location.query.event_code,
    };
    if (!history.location.query.once) {
      bookedPayload.user_code = history.location.query.user_code;
    }

    // get all B scheduled calendar
    ///api/user/user_calendars
    if (isLogin) {
      await dispatch({
        type: 'EVENT/getAllBookedSchedule',
        payload: {},
      });
    }
    const { startTime, endTime } = createTimeAsync();
    // get all A schedule calendar
    // getGuestEventClient
    await dispatch({
      type: 'EVENT/getGuestEventClient',
      payload: { ...payload, need_sync: true, start: startTime, end: endTime },
    });

    // get all freetime of A
    // /api/guest/event_datetimes
    await dispatch({ type: 'EVENT/getListFreeDay', payload: bookedPayload });

    setFetchedData(true);
    // }
  };

  const handleBookedSchedule = () => {
    if (!listBookedSchedule || listBookedSchedule.length <= 0) {
      return;
    }
    // FIXME: hide move block
    // Tam thoi remove cac block di chuyen
    // check_move_time : 1 -> lich chinh
    // check_move_time : 2 -> block move
    // let booked = listBookedSchedule.filter(item => {
    //   return true;
    // });

    let booked = listBookedSchedule.map(item => {
      const stepLength = getStep(item);
      item.start_time = moment(item.start_time).format(YYYYMMDDTHHmm);
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
      if (!item.name) {
        item.name = item.event_name;
      }
      return item;
    });

    setListBookedTimeUser(booked);
  };

  // MH bên B: SK1: Listen update _event.{eventId} (Public channel)
  const connectChannelUpdateEvent = eventId => {
    if (!eventId) {
      return;
    }

    if (window.Echo.connector.channels['update_event.' + eventId]) {
      return;
    }

    // Listen:
    window.Echo.channel('update_event.' + eventId).listen(
      '.update_event_datetime',
      e => {
        const {
          event_day_on_off,
          event_settings,
          event_datetime,
          event_members,
        } = e.payload;
        dispatch({
          type: 'EVENT/setEventCustomizeDates',
          payload: event_day_on_off,
        });
        if (event_datetime.length) {
          dispatch({
            type: 'EVENT/setListFreeDay',
            payload: event_datetime,
          });
        }
        setEventInfo(event_settings);
        setReloadRealTime(true);
      },
    );
  };

  // MH bên B:  Listen update_user _calendar.{userId} (Public channel)
  const connectChannelUpdateUserCalendar = userId => {
    if (!userId) {
      return;
    }

    if (window.Echo.connector.channels['update_user_calendar.' + userId]) {
      return;
    }

    // Listen:
    window.Echo.channel('update_user_calendar.' + userId).listen(
      '.add_user_calendar',
      e => {
        let booked = e.payload;
        setRemoveDataBookedRealTime({
          isBooked: true,
          dataBooked: e.payload,
        });
        dispatch({ type: 'EVENT/addBookedSchedule', payload: booked });
      },
    );
  };

  const generateCurrentWeekValidTime = (
    currentStartWeekDate,
    clientCalendar,
    needFirstDay = false,
  ) => {
    if (!eventInfo.id || !fetchedData) {
      return;
    }
    let results = [];

    // group by date
    let freeDayGroupByDate = [];
    if (listFreeDay.length) {
      freeDayGroupByDate = groupBy('dateStr')(listFreeDay);
    }
    if (clientCalendar) {
      guestEventClients = clientCalendar;
    }

    let members = [];
    let eventBooked = [];
    if (guestEventClients && guestEventClients.length) {
      members = guestEventClients.map(e => {
        if (e.events) {
          if (e.events.length > 0 && !e.events[0].email) {
            e.events.forEach(a => {
              a.email = e.email;
            });
          }

          eventBooked.push(...e.events);
        }

        return {
          option: e.option,
          checked: true,
          id: e.email,
        };
      });
    }

    let maxDate = null;
    if (eventInfo.period) {
      maxDate = moment(currentDate).add(eventInfo.period, 'weeks');
    }

    for (let i = 0; i < 7; i++) {
      const validDate = moment(currentStartWeekDate)
        .add(i, 'd')
        .format(FORMAT_DATE);

      // no need generate if is max date
      if (
        !needFirstDay &&
        maxDate &&
        maxDate.isSameOrBefore(moment(validDate))
      ) {
        break;
      }

      let validBlocks = freeDayGroupByDate[validDate];
      if (validBlocks) {
        // filter disable event_datetime
        validBlocks = validBlocks.filter(item => {
          return (
            item.status &&
            moment()
              .add(eventInfo.move_number || 0)
              .isBefore(moment(item.start_time), 'minutes')
          );
        });

        validBlocks.map(item => {
          item.start = moment(item.start_time).format(YYYYMMDDTHHmm);
          item.end = moment(item.end_time).format(YYYYMMDDTHHmm);
          return item;
        });

        // filter reception_start_time
        validBlocks = filterReceptionTime(
          validBlocks,
          eventInfo.reception_start_time + eventInfo.move_number || 0,
        );

        if (validBlocks && validBlocks.length && needFirstDay) {
          return validDate;
        }

        if (guestEventClients && guestEventClients.length) {
          const dateEventBook = eventBooked.filter(e => {
            return moment(e.start_time).isSame(moment(validDate), 'day');
          });
          let a = validBlocks.filter(e => {
            const { move_number } = eventInfo;
            let startTime = e.start_time;
            let endTime = e.end_time;
            if (move_number) {
              startTime = moment(startTime)
                .subtract(move_number, 'm')
                .format(YYYYMMDDTHHmm);
              endTime = moment(endTime)
                .add(move_number, 'm')
                .format(YYYYMMDDTHHmm);
            }

            return !checkEventBooked(
              startTime,
              endTime,
              dateEventBook,
              members,
            );
          });
          validBlocks = a;
        }

        results = [...results, ...validBlocks];
        continue;
      }

      // not auto generate if is manual setting
      if (eventInfo.is_manual_setting) {
        continue;
      }
      // generate by default setting
      let defaultValidBlocks = generateDefaultSettingForDate(validDate);
      // filter checked user
      if (guestEventClients && guestEventClients.length) {
        const dateEventbook = eventBooked.filter(e => {
          return moment(e.start_time).isSame(moment(validDate), 'day');
        });

        defaultValidBlocks = defaultValidBlocks.filter(e => {
          const { move_number } = eventInfo;
          let startTime = e.start_time;
          let endTime = e.end_time;
          if (move_number) {
            startTime = moment(startTime)
              .subtract(move_number, 'm')
              .format(YYYYMMDDTHHmm);
            endTime = moment(endTime)
              .add(move_number, 'm')
              .format(YYYYMMDDTHHmm);
          }

          return !checkEventBooked(startTime, endTime, dateEventbook, members);
        });
      }

      if (defaultValidBlocks && defaultValidBlocks.length && needFirstDay) {
        return validDate;
      }

      results = [...results, ...defaultValidBlocks];
    }
    // luu lai muc dich de khong can phai generate lai du lieu nua
    setDateTimes(results);
  };

  // Generate block cho 1 ngay theo setting default
  // Filter advance
  const generateDefaultSettingForDate = date => {
    const { move_number } = eventInfo;
    const dayOfWeek = moment(date).isoWeekday();
    const settingOfDayOfWeek = firstSetupFreeTime.find(item => {
      return item.day_of_week === dayOfWeek;
    });
    // handle customize day
    const haveCustomize = eventCustomizeDates.find(item => {
      return moment(item.date).isSame(moment(date), 'day');
    });
    let settings = {};
    if (haveCustomize) {
      if (!haveCustomize.status) {
        return [];
      }

      if (settingOfDayOfWeek) {
        settings = settingOfDayOfWeek;
      } else {
        settings.start_time = '09:00';
        settings.end_time = '18:00';
      }
    } else {
      if (!settingOfDayOfWeek || !settingOfDayOfWeek?.status) {
        return [];
      }
      settings = settingOfDayOfWeek;
    }
    // default_start_time
    // default_end_time
    let startTime = moment(`${date} ${settings.start_time}`);
    let endTime = moment(`${date} ${settings.end_time}`);

    if (eventInfo.default_start_time && eventInfo.default_end_time) {
      startTime = moment(`${date} ${eventInfo.default_start_time}`);
      endTime = moment(`${date} ${eventInfo.default_end_time}`);
    }

    let validBlocks = [];
    if (eventInfo.priority_times && eventInfo.priority_times.length) {
      eventInfo.priority_times.forEach(item => {
        let priority_start_time = moment(`${date}T${item.priority_start_time}`);
        let priority_end_time = moment(`${date}T${item.priority_end_time}`);

        let tempBlocks = splitRange(
          priority_start_time,
          priority_end_time,
          eventInfo.block_number,
          eventInfo.relax_time,
        );
        validBlocks = [...validBlocks, ...tempBlocks];
      });
    } else {
      validBlocks = splitRange(
        startTime,
        endTime,
        eventInfo.block_number,
        eventInfo.relax_time,
      );
    }

    // filter by advance
    validBlocks = validBlocks.filter((item, index) => {
      let start = moment(item.start);
      let end = moment(item.end);
      // is past time
      if (
        moment()
          .add(move_number || 0)
          .isAfter(start, 'minutes')
      ) {
        return false;
      }

      // reception_start_time
      if (
        !canStartAt(
          item,
          eventInfo.reception_start_time + eventInfo.move_number || 0,
        )
      ) {
        return false;
      }

      // lunch_break_start_time
      // lunch_break_end_time
      if (eventInfo.lunch_break_start_time && eventInfo.lunch_break_end_time) {
        let breakStartTime = moment(
          `${date} ${eventInfo.lunch_break_start_time}`,
        );
        let breakEndTime = moment(`${date} ${eventInfo.lunch_break_end_time}`);

        // check is duplicate with break lunch time
        const duplicate = isOverlap(breakStartTime, breakEndTime, start, end);

        return duplicate ? false : true;
      }

      return true;
    });
    return validBlocks;
  };

  const checkEventCode = () => {
    const callback = {
      func: handleAfterCheckEventCode,
    };
    return dispatch({ type: 'EVENT/checkEventCode', payload, callback });
  };

  const handleAfterCheckEventCode = res => {
    if (res.body.data && res.body.status && res.body.data.status) {
      setEventInfo(res.body.data);
      // get setting customize date
      getEventCustomizeDate({ event_code: res.body.data.event_code });
      getUserByCode(payload);
      getEventDateTime({ event_code: res.body.data.event_code });
      setLinkIsUsed(false);
    } else {
      history.push('/invalid-url');
    }
  };

  const getUserByCode = async payload => {
    await dispatch({ type: 'EVENT/getUserByCode', payload });
  };

  const getEventCustomizeDate = async payload => {
    await dispatch({ type: 'EVENT/getEventCustomizeDates', payload });
  };

  const getEventDateTime = async payload => {
    await dispatch({
      type: 'EVENT/getFreeTimeByGuest',
      payload,
    });
  };

  const selectTimeFrame = value => {
    checkEventCode();
    setSelectedTime(value);
    setTimeout(() => {
      setCurrentStep(2);
    }, 300);
  };

  const onCreateSchedule = () => {
    return checkEventCode();
  };

  const backToFirstStep = async isFilter => {
    setCurrentStep(1);
    if (currentIndexWeek) {
      const { startTime, endTime } = createTimeAsync(currentDate);
      const data = await dispatch({
        type: 'EVENT/getGuestEventClient',
        payload: {
          ...payload,
          need_sync: true,
          start: startTime,
          end: endTime,
        },
      });

      generateCurrentWeekValidTime(startTime, data);
      setCurrentIndexWeek(0);
      setSelectedTime({});
      setReloadDataWeek(true);
      return;
    }
    // filter event booked
    if (isFilter) {
      // time selected
      const { start_time, end_time } = selectedTime;
      let selectTimeStartDt = start_time;
      let selectTimeEndDt = end_time;
      // time move
      const { move_number } = eventInfo;

      if (move_number) {
        selectTimeStartDt = moment(start_time)
          .subtract(move_number, 'm')
          .format(YYYYMMDDTHHmm);
        selectTimeEndDt = moment(end_time)
          .add(move_number, 'm')
          .format(YYYYMMDDTHHmm);
      }
      // filter list time free
      const listDayFreeTimeFilter = listDataFreeTime.filter(item => {
        let timeStartDayFreeDt = item.start_time;
        let timeEndDayFreeDt = item.end_time;

        if (move_number) {
          timeStartDayFreeDt = moment(item.start_time)
            .subtract(move_number, 'm')
            .format(YYYYMMDDTHHmm);
          timeEndDayFreeDt = moment(item.end_time)
            .add(move_number, 'm')
            .format(YYYYMMDDTHHmm);
        }
        // return time free, check case have time move if time-free + time-move and time-select + time-move overlap
        return !isOverlap(
          timeStartDayFreeDt,
          timeEndDayFreeDt,
          selectTimeStartDt,
          selectTimeEndDt,
        );
      });
      setListDataFreeTime(listDayFreeTimeFilter);
    }
    setSelectedTime({});
  };

  const changeWeek = async value => {
    setCurrentIndexWeek(value);
    const startDateOfWeek = moment(currentDate).add(value * delta, 'days');
    let result = datetimes[moment(startDateOfWeek).format(YYYYMMDD)];
    const { startTime, endTime } = createTimeAsync(
      startDateOfWeek.format(YYYYMMDD),
    );

    // chi generate lai data khi chu co du lieu
    const data = await dispatch({
      type: 'EVENT/getGuestEventClient',
      payload: {
        ...payload,
        need_sync: true,
        start: startTime,
        end: endTime,
      },
    });

    if (!result || !result.length) {
      generateCurrentWeekValidTime(startTime, data);
    }

    setReloadDataWeek(true);
  };

  // generate final block
  const getListFreeTime = () => {
    let result = [];
    let count = 0;

    if (eventInfo.reservation_number) {
      for (let i = 0; i <= currentIndexWeek; i++) {
        if (datetimes && datetimes.length) {
          let needGenerateBlock = eventInfo.reservation_number - count;
          if (needGenerateBlock > datetimes.length) {
            needGenerateBlock = datetimes.length;
          }

          count += needGenerateBlock;

          if (i == currentIndexWeek) {
            result = datetimes.slice(0, needGenerateBlock);
          }
        }
      }
    } else {
      const startDateOfWeek = moment(currentDate).add(
        currentIndexWeek * delta,
        'days',
      );
      // result = datetimes[moment(startDateOfWeek).format(YYYYMMDD)];
      result = datetimes;
    }

    if (!result) {
      result = [];
    }

    // only get booked date fron current Date
    const booked = listBookedTimeUser.filter(e => {
      return moment(e.start_time).isAfter(currentDate);
    });
    // result = result.filter(event => {
    //   let start = event.start_time;
    //   let end = event.end_time;
    //   if (eventInfo.is_manual_setting) {
    //     start = event.start;
    //     end = event.end;
    //   }
    //   for (let item of booked) {
    //     if (item.start_time < end && start < item.end_time) {
    //       return false;
    //     }
    //   }
    //   return true;
    // });
    return [...result, ...booked];
  };

  const showInforBooking = value => {
    setModalInforSm(value);
  };

  const onSetStep = step => {
    setCurrentStep(step);
  };

  return (
    <Layout className={styles.mainLayout}>
      <HeaderPreview
        userByCode={userByCode}
        bookingState={bookingState}
        togetherModalInfor={() => showInforBooking(true)}
        isScheduleAdjust
        currentStep={currentStep}
      />

      <div className={styles.bookingBottom}>
        <div className={`${styles.scheduleAdjustment} ${styles.bookingStep1}`}>
          {currentStep !== 4 && (
            <div className={styles.mainContent}>
              <div className={styles.numberAccountContent}>
                <div className={styles.numberAccountBorder} />
                <p className={styles.numberAccountTitle}>
                  {currentStep === 1
                    ? '日程調整可能な日時を下記より選択してください。'
                    : `お名前・メールアドレスをご入力の上「完了する」をクリックください。`}
                </p>
              </div>

              <div className={styles.progressBar}>
                <div>
                  <div
                    className={`${styles.currentStep} ${
                      currentStep === 1 ? styles.activeStep : ''
                    }`}
                  >
                    <span>1</span>
                    <p>
                      {formatMessage({
                        id:
                          width > 767
                            ? 'i18n_step_1_adjust'
                            : 'i18n_step_1_adjust_mobile',
                      })}
                    </p>
                  </div>
                  <div
                    className={`${styles.currentStep} ${
                      currentStep === 2 ? styles.activeStep : ''
                    }`}
                  >
                    <span>2</span>
                    <p>
                      {formatMessage({
                        id:
                          width > 767
                            ? 'i18n_step_2_adjust'
                            : 'i18n_step_2_adjust_mobile',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep !== 4 && (
            <div className={styles.mainContent}>
              <div className={styles.eventTitle}>
                <div className={styles.titleIcon}>
                  <div className={styles.bolderColIcon} />
                  <div className={styles.normalColIcon} />
                </div>
                {currentStep !== 2 ? (
                  <p>
                    1.{' '}
                    {formatMessage({ id: 'i18n_step_1_adjust_title_mobile' })}
                  </p>
                ) : (
                  <p>
                    2. お名前・メールアドレスをご入力
                    <br />
                    の上「完了する」をクリックください。
                  </p>
                )}
              </div>

              <div
                className={`${styles.firstStepDetail} ${
                  currentStep === 2 ? styles.secondStepDetail : ''
                }`}
              >
                <Row>
                  <Col
                    xs={0}
                    sm={0}
                    md={7}
                    xl={6}
                    xxl={5}
                    className={styles.boxInforUser}
                  >
                    <p className={styles.pinnedText}>
                      <img src={user} />
                      {formatMessage({ id: 'i18n_user_info_booking_b' })}
                    </p>
                    {userByCode?.company && (
                      <div className={styles.userInfo}>
                        <p>
                          <span className={styles.infoCompany}>
                            {userByCode?.company}
                          </span>
                        </p>
                      </div>
                    )}

                    <div className={styles.userInfo}>
                      {userByCode.avatar ? (
                        <div className={styles.avatar}>
                          <img src={userByCode.avatar} />
                        </div>
                      ) : (
                        <div className={styles.avatar}>
                          <img src={logoImage} />
                        </div>
                      )}
                      <p>
                        <span className={styles.infoName}>
                          {userByCode.name}
                        </span>
                      </p>
                    </div>
                    <div className={styles.meetingInfo}>
                      <p
                        className={`${styles.pinnedText} ${styles.pinnedTextSecond}`}
                      >
                        <img src={pinned} />
                        {formatMessage({ id: 'i18n_meeting' })}
                      </p>

                      <div className={styles.meetingDetail}>
                        {currentStep === 2 && (
                          <div className={styles.timeBooking}>
                            <span className={styles.dateTime}>
                              {getJPFullDate(selectedTime.start_time)}
                              {moment(selectedTime.start_time).format('(dd)')}
                            </span>{' '}
                            {moment(selectedTime.start_time).format(
                              HOUR_FORMAT,
                            )}{' '}
                            -{' '}
                            {moment(selectedTime.end_time).format(HOUR_FORMAT)}
                          </div>
                        )}
                        {formatMessage({ id: 'i18n_required_time' })}：
                        {getStep(eventInfo)}
                        {formatMessage({ id: 'i18n_minute' })}
                        <br />
                        <div className={styles.mt7} />
                        {formatMessage({ id: 'i18n_meeting_formality' })}：
                        {eventInfo.real_category}
                        <br />
                        <div className={styles.mt7} />
                        {formatMessage({ id: 'i18n_meeting_method' })}：
                        <span className={styles.meetingMethod}>
                          {meetingMethod(eventInfo)}
                        </span>
                      </div>
                    </div>
                    <div className={styles.meetingComment}>
                      <p className={styles.pinnedText}>
                        <img src={comment} />
                        {userByCode.name}
                        {'様'}
                        {formatMessage({ id: 'i18n_comment_from' })}
                      </p>
                    </div>
                    <div className={styles.secondStepHeader}>
                      <div className={styles.searchKeyword}>
                        <textarea
                          value={eventInfo.calendar_create_comment || undefined}
                          disabled
                        />
                      </div>
                      {!isLogin && <LoginFree />}
                    </div>
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={17}
                    xl={18}
                    xxl={19}
                    className={styles.boxBooking}
                  >
                    <Spin size="large" spinning={linkIsUsed || isLoading}>
                      <div className={styles.calendar}>
                        {currentStep === 1 && (
                          <BookingCalendar
                            listTimeFrame={listDataFreeTime}
                            onSelectTime={frame => selectTimeFrame(frame)}
                            nextWeek={changeWeek}
                            prevWeek={changeWeek}
                            eventInfo={eventInfo}
                            firstWeekDate={currentDate}
                            isScheduleAdjust
                          />
                        )}

                        {currentStep === 2 &&
                          (!history.location.query.start_time ||
                            !history.location.query.end_time) && (
                            <BookingFinalStep
                              onCancel={backToFirstStep}
                              event_code={history.location.query.event_code}
                              user_code={history.location.query.user_code}
                              start_time={selectedTime.start_time}
                              end_time={selectedTime.end_time}
                              custom_type={selectedTime.custom_type}
                              eventInfo={eventInfo}
                              onCreateSchedule={() => onCreateSchedule()}
                              nextStep={() => onSetStep(4)}
                            />
                          )}

                        {currentStep === 2 &&
                          history.location.query.start_time &&
                          history.location.query.end_time && (
                            <BookingFinalStep
                              onCancel={backToFirstStep}
                              event_code={history.location.query.event_code}
                              user_code={history.location.query.user_code}
                              start_time={moment(
                                Number(history.location.query.start_time),
                              ).format(YYYYMMDDTHHmm)}
                              custom_type={Number(
                                history.location.query.custom_type,
                              )}
                              eventInfo={eventInfo}
                              onCreateSchedule={onCreateSchedule}
                              nextStep={() => onSetStep(4)}
                              once={history.location.query.once}
                            />
                          )}
                      </div>
                    </Spin>
                  </Col>
                </Row>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <SuccessVote
              userInfo={userByCode}
              eventInfo={eventInfo}
              selectedTime={
                history.location.query.start_time &&
                history.location.query.end_time
                  ? moment(Number(history.location.query.start_time)).format(
                      YYYYMMDDTHHmm,
                    )
                  : selectedTime.start_time
              }
              start_time={selectedTime.start_time}
              end_time={selectedTime.end_time}
              type={1}
            />
          )}
        </div>

        <Modal
          maxWidth={350}
          style={{ top: 40 }}
          visible={modalInforSm}
          footer={null}
          onCancel={() => showInforBooking(false)}
          bodyStyle={{ padding: 0 }}
          closeIcon={
            <Button
              shape="circle"
              className={styles.closeBtn}
              icon={<CloseOutlined style={{ color: '#9c9c9c' }} />}
            />
          }
        >
          <div>
            <div className={styles.modalTitle}>
              <span>{userByCode.name}様</span>から日程調整依頼です
            </div>
            <div className={styles.modalBody}>
              <p className={styles.pinnedText}>
                <img src={user} />
                {formatMessage({ id: 'i18n_user_info_booking_b' })}
              </p>
              <div className={styles.userInfo}>
                {userByCode.avatar ? (
                  <div className={styles.avatar}>
                    <img src={userByCode.avatar} />
                  </div>
                ) : (
                  <div className={styles.avatar}>
                    <img src={logoImage} />
                  </div>
                )}
                <p>
                  <span className={styles.infoCompany}>
                    {userByCode.company}
                  </span>
                  {userByCode.company ? <br /> : null}
                  <span className={styles.infoName}>{userByCode.name}</span>
                </p>
              </div>
              <Divider />
              <div className={styles.meetingInfo}>
                <p className={styles.pinnedText}>
                  <img src={pinned} />
                  {formatMessage({ id: 'i18n_meeting_content' })}
                </p>
                <div className={styles.meetingDetail}>
                  <p>
                    ・
                    {formatMessage({
                      id: 'i18n_required_time_list_event_type',
                    })}
                    ：
                    <span>
                      {getStep(eventInfo)}
                      {formatMessage({ id: 'i18n_minute' })}
                    </span>
                  </p>
                  <p>
                    ・{formatMessage({ id: 'i18n_meeting_formality' })}：
                    <span>{eventInfo.real_category}</span>
                  </p>
                  <p>
                    ・{formatMessage({ id: 'i18n_meeting_method' })}：
                    <span className={styles.meetingMethod}>
                      {meetingMethod(eventInfo)}
                    </span>
                  </p>
                </div>
              </div>
              <Divider />
              <div className={styles.meetingComment}>
                <p className={styles.pinnedText}>
                  <img src={comment} />
                  {userByCode.name}
                  {'様'}
                  {formatMessage({ id: 'i18n_comment_from' })}
                </p>
                <p className={styles.comment}>
                  {eventInfo.calendar_create_comment}
                </p>
              </div>
              <Button
                className={`${styles.modalBtn} ${styles.btnColor}`}
                onClick={() => showInforBooking(false)}
                block
                size="large"
              >
                {formatMessage({ id: 'i18n_proceed_date_time_selection' })}
              </Button>
            </div>
          </div>
        </Modal>
      </div>

      <Footer footerSuccessVote={currentStep === 4} />
      {isLogin ? (
        <MenuSPBottom />
      ) : (
        currentStep == 1 && (
          <div>
            <div className={styles.footerNotLoginMobile}>
              <p>
                {formatMessage({
                  id: 'i18n_suggest_and_footer_not_login_mobile',
                })}
              </p>
              <div>
                <Button
                  className={styles.btnColor}
                  onClick={() => history.push('/login')}
                >
                  {formatMessage({ id: 'i18n_suggest_and_footer_button' })}
                </Button>
              </div>
            </div>
          </div>
        )
      )}
    </Layout>
  );
}

export default connect(({ EVENT, MASTER }) => ({
  eventStore: EVENT,
  masterStore: MASTER,
}))(ScheduleAdjustment);

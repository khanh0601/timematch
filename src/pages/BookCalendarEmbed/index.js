import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { useDispatch, useHistory, useLocation, useSelector } from 'umi';
import {
  canStartAt,
  checkEventBooked,
  createTimeAsync,
  deepCopyData,
  filterReceptionTime,
  getJPFullDate,
  groupBy,
  isOverlap,
  notify,
  splitRange,
  tz,
} from '../../commons/function';
import moment from 'moment';
import {
  ADMIN_FULL_DATE_HOUR,
  FORMAT_DATE,
  HOUR_FORMAT,
  YYYYMMDD,
  YYYYMMDDTHHmm,
} from '../../constant';
import NameCalendar from '../SettingTemplate/components/CalendarTemplate/NameCalendar';
import BackgroundImage from '../SettingTemplate/components/CalendarTemplate/BackgroundImage';
import Commit from '../SettingTemplate/components/CalendarTemplate/Commit';
import TimeSetting from '../SettingTemplate/components/CalendarTemplate/TimeSetting';
import BookingEmbed from '../SettingTemplate/components/CalendarTemplate/BookingEmbed';
import InfoTemplate from '../SettingTemplate/components/InfoTemplate';
import { Spin } from 'antd';
import { connect } from 'dva';
import update from 'immutability-helper';

const BookCalendarEmbed = ({ settingTemplateStore }) => {
  const { query } = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const [eventInfo, setEventInfo] = useState({});
  const [fetchedData, setFetchedData] = useState(false);
  const [currentDate, setCurrentDate] = useState(moment().format(YYYYMMDD));
  const [currentStep, setCurrentStep] = useState(1);
  const [isUserExpirted, setIsUserExpirted] = useState(false);
  const [reloadRealTime, setReloadRealTime] = useState(false);
  const [formAnswer, setDataAnswer] = useState({
    calendar_id: '',
    status: false,
    answers: [],
    policies: [],
  });
  // store event
  const {
    listFreeDay,
    guestEventClients,
    firstSetupFreeTime,
    eventCustomizeDates,
  } = useSelector(store => store.EVENT);
  // store setting template
  const { idEdit, isLoadingTemplate, isSuccess } = useSelector(
    store => store.SETTING_TEMPLATE,
  );

  const [dateBooking, setDateBooking] = useState({
    list: [],
    countDate: 0,
  });
  const [dateBookedRealTime, setDateBookedRealTime] = useState([]);

  const [timeBooked, setTimeBooked] = useState('');

  const scrollBottomRef = useRef();

  const { event_code, user_code } = query;

  useEffect(() => {
    if (!query?.user_code || !query?.event_code) {
      history.push('/invalid-url');
      return;
    }
    loadTemplateGuest();

    // clear data store setting template
    return () => {
      dispatch({
        type: 'SETTING_TEMPLATE/reset',
      });
    };
  }, []);

  // set event default selected
  useEffect(() => {
    if (!fetchedData) {
      return;
    }
    connectChannelUpdateEvent(eventInfo.id);
    connectChannelUpdateUserCalendar(eventInfo.user_id);

    generateCurrentWeekValidTime(currentDate);
    setFetchedData(false);
  }, [fetchedData]);

  useEffect(() => {
    if (reloadRealTime) {
      // rerender all data
      generateCurrentWeekValidTime(currentDate);
      setReloadRealTime(false);
    }
  }, [reloadRealTime]);

  useEffect(() => {
    // date booked real time is valid
    if (dateBookedRealTime.length) {
      filterDateBooked(dateBookedRealTime);
      setDateBookedRealTime([]);
    }
  }, [dateBookedRealTime]);

  useEffect(() => {
    if (currentStep === 2) {
      if (window.innerWidth <= 425) {
        scrollBottomRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [currentStep]);

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
        const listBooked = e.payload;
        if (listBooked && listBooked.length > 0) {
          const dataBookedFormat = listBooked.map(items => {
            const { start_time, block_number } = items;
            items.start_time = moment(start_time, YYYYMMDDTHHmm).format(
              ADMIN_FULL_DATE_HOUR,
            );
            items.end_time = moment(start_time, YYYYMMDDTHHmm)
              .add(block_number, 'minutes')
              .format(ADMIN_FULL_DATE_HOUR);
            return items;
          });
          setDateBookedRealTime(dataBookedFormat);
        }
      },
    );
  };

  // check event invalid
  const checkEventCode = async () => {
    const payload = {
      user_code: query?.user_code,
      event_code: query?.event_code,
    };
    const { startTime, endTime } = createTimeAsync(currentDate);
    const { event_code, user_code } = query;
    // get all A schedule eventInfo
    // getGuestEventClient
    await dispatch({
      type: 'EVENT/getGuestEventClient',
      payload: {
        ...payload,
        need_sync: true,
        start: startTime,
        end: endTime,
      },
    });

    await dispatch({
      type: 'EVENT/getListFreeDay',
      payload: {
        user_code,
        event_code,
      },
    });

    await dispatch({
      type: 'EVENT/getEventCustomizeDates',
      payload: {
        event_code,
      },
    });

    await dispatch({
      type: 'EVENT/getFreeTimeByGuest',
      payload: {
        event_code,
      },
    });

    const callback = {
      func: handleAfterCheckEventCode,
    };
    await dispatch({ type: 'EVENT/checkEventCode', payload, callback });
    setFetchedData(true);
  };

  // filter date booked real time
  const filterDateBooked = listDateBooked => {
    const { list } = dateBooking;
    // copy deep list data date
    const listCopy = deepCopyData(list);
    let countDate = 0;

    const listNew = listCopy.map(items => {
      const { listBlockTime } = items;
      if (!listBlockTime.length) {
        return items;
      }
      countDate++;
      // filter data booked
      items.listBlockTime = listBlockTime.filter(itemDate => {
        const { start_time, end_time } = itemDate;

        const filterDateBooked = listDateBooked.filter(item => {
          if (
            moment(item.start_time).isSame(start_time) &&
            moment(item.end_time).isSame(end_time)
          ) {
            return item;
          }
        });
        if (!filterDateBooked.length) {
          return itemDate;
        }
      });
      return items;
    });
    setDateBooking({
      list: listNew,
      countDate: !!countDate,
    });
  };

  // handle data event
  const generateCurrentWeekValidTime = currentStartWeekDate => {
    moment.locale('ja');
    let results = [];
    let countDate = 0;
    // group by date
    let freeDayGroupByDate = [];
    if (listFreeDay.length) {
      freeDayGroupByDate = groupBy('dateStr')(listFreeDay);
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
      if (maxDate && maxDate.isSameOrBefore(moment(validDate))) {
        break;
      }

      let validBlocks = freeDayGroupByDate[validDate];
      if (validBlocks) {
        // filter disable event_datetime
        validBlocks = validBlocks.filter(item => {
          return (
            item.status &&
            moment()
              .add(0)
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
        countDate++;
        results = [
          ...results,
          {
            date: moment(validDate, FORMAT_DATE).format('YYYY年M月D日 (ddd)'),
            listBlockTime: validBlocks,
          },
        ];
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
        const dateEventBook = eventBooked.filter(e => {
          return moment(e.start_time).isSame(moment(validDate), 'day');
        });
        // block_number
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
          return !checkEventBooked(startTime, endTime, dateEventBook, members);
        });
      }
      countDate++;
      results = [
        ...results,
        {
          date: moment(validDate, FORMAT_DATE).format('YYYY年M月D日 (ddd)'),
          listBlockTime: defaultValidBlocks,
        },
      ];
    }
    setDateBooking({
      list: results,
      countDate: !!countDate,
    });
  };

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

        return !duplicate;
      }

      return true;
    });
    return validBlocks;
  };

  const loadTemplateGuest = async () => {
    const { user_code, event_code, form_id } = query;
    const res = await dispatch({
      type: 'SETTING_TEMPLATE/loadTemplateGuest',
      payload: {
        user_code,
        event_code,
        form_id,
      },
    });

    if (res?.isValid) {
      // handle data form info answer
      const { calendar, confirm } = res;
      const { listInput, policies } = confirm;
      const listParam = listInput.reduce((preVal, nextVal) => {
        const { id, type, contents, question_name } = nextVal;
        let data = {
          form_question_id: id,
          form_question_name: question_name,
          type,
          form_question_content_id: null,
          content: '',
        };
        if (contents.length > 0) {
          const listQuestion = contents.map(item => ({
            ...data,
            form_question_content_id: item.id,
            content: false,
          }));
          return [...preVal, ...listQuestion];
        }
        return preVal.concat(data);
      }, []);

      const formAnswer = {
        calendar_id: calendar.calendar.id,
        status: false,
        answers: listParam,
        policies: policies.map(p => ({
          form_policy_id: p.form_id,
          id: p.id,
          status: p.checkbox,
        })),
      };
      setDataAnswer(formAnswer);
      checkEventCode();
      return;
    }
    if (!res?.isValid) {
      if (res.status === 402) {
        setIsUserExpirted(true);
        return;
      }
    }
    history.push('/invalid-url');
  };

  const handleAfterCheckEventCode = async res => {
    const { body, status } = res;
    if (status === 200) {
      setEventInfo(body.data);
    } else {
      history.push('/invalid-url');
    }
  };

  const isValidFill = (listQuestion, data) => {
    let isValid = true;
    for (let question of listQuestion) {
      if (question.status === 1) {
        // required
        if (question.type === 1) {
          // text input
          let answer = data.answers.find(
            item => item.form_question_id === question.id,
          );
          if (answer.content.length === 0) {
            isValid = false;
          }
        }
        if (question.type === 2) {
          // select option
          isValid = false;
          let answers = data.answers.filter(
            item => item.form_question_id === question.id,
          );
          for (let answer of answers) {
            if (answer.content === true) {
              isValid = true;
              break;
            }
          }
        }
      }
      if (isValid === false) {
        return false;
      }
    }
    return true;
  };

  // re-render data booking
  const onChangeWeek = async (value, index) => {
    const { startTime, endTime } = createTimeAsync(value);
    const { period } = eventInfo;

    if (period) {
      if (period === 1) {
        return;
      }

      if (index > period) {
        return;
      }
    }
    const payload = {
      event_code,
      user_code,
      need_sync: true,
      start: startTime,
      end: endTime,
    };
    // chi generate lai data khi chua co du lieu
    await dispatch({
      type: 'EVENT/getGuestEventClient',
      payload,
    });
    setCurrentDate(value);
    setFetchedData(true);
  };

  const onSubmitBooking = () => {
    const { start_time, end_time } = timeBooked;
    const data = {
      ...formAnswer,
      time_zone: tz(),
      event_code,
      user_code,
      start_time,
      end_time,
      custom_type: 1,
      guest_code: '',
      guest_invites: [],
      status: 1,
    };

    if (!isValidFill(settingTemplateStore.listQuestion, data)) {
      notify('未入力の入力必須項目がございます。');
      return;
    }

    dispatch({
      type: 'SETTING_TEMPLATE/onSubmitDataEmbed',
      payload: {
        data: {
          id: idEdit,
          data,
        },
        func: () => setCurrentStep(1),
      },
    });
  };

  const onBookingTime = useCallback(dateBooked => {
    setTimeBooked(dateBooked);
    setCurrentStep(2);
  });

  const onPreStep = useCallback(() => {
    setCurrentStep(1);
    setTimeBooked('');
  });

  const renderStepBooking = () => {
    if (isSuccess) {
      return (
        <div
          className={`${styles.stepCalendarTitle} ${styles.stepCalendarTitlePC}`}
        >
          <div className={styles.titleIcon}>
            <div className={styles.bolderColIcon} />
            <div className={styles.normalColIcon} />

            <div className={styles.titleSuccess}>
              <span>お問い合わせいただきありがとうございました！</span>
              <div className={styles.childText}>
                この度はお問い合わせいただきありがとうございました。
                <br />
                メールにて日時等の詳細をご案内しておりますのでご確認ください。
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (currentStep === 1) {
      return (
        <div className={styles.calendar}>
          <BookingEmbed
            onBooking={onBookingTime}
            onNextWeek={onChangeWeek}
            onPreWeek={onChangeWeek}
            listDateBooking={dateBooking.list}
            dataUndefined={!dateBooking.countDate}
          />
        </div>
      );
    }

    if (currentStep === 2) {
      return (
        <InfoTemplate
          timeBooked={timeBooked}
          onSubmit={onSubmitBooking}
          onBackStep={onPreStep}
          listAnswer={formAnswer.answers}
          policies={formAnswer.policies}
          updateListAnswer={(key, data) => {
            setDataAnswer({
              ...formAnswer,
              [key]: data,
            });
          }}
          updatePolicy={(id, value) => {
            const indexPolicy = formAnswer.policies.findIndex(f => f.id === id);

            if (indexPolicy > -1) {
              setDataAnswer(
                update(formAnswer, {
                  policies: {
                    [indexPolicy]: {
                      status: { $set: value },
                    },
                  },
                }),
              );
            }
          }}
        />
      );
    }
  };

  const renderView = () => {
    if (isUserExpirted) {
      return (
        <div className={styles.bookingCalendarEmbedExpirted}>
          <p>
            このオンライン予約ページは有効期限が切れているためご利用いただけません。
          </p>
        </div>
      );
    }

    // add hide content booking when booked success screen mobile
    const listCssTitle = () => {
      let css = styles.titleHeader;
      if (isSuccess) {
        css += ' ' + styles.hideContentSuccessMb;
      }
      return css;
    };

    // add hide content booking when booked success screen mobile
    const listCssContentBooking = () => {
      let css = styles.contentBooking;
      if (isSuccess) {
        css += ' ' + styles.hideContentSuccessMb;
      }
      return css;
    };
    return (
      <div className={styles.bookingCalendarEmbed}>
        {isSuccess && (
          <div
            className={`${styles.stepCalendarTitle} ${styles.stepCalendarTitleMB}`}
          >
            <div className={styles.titleIcon}>
              <div className={styles.bolderColIcon} />
              <div className={styles.normalColIcon} />

              <div className={styles.titleSuccess}>
                <span>お問い合わせいただきありがとうございました！</span>
                <div className={styles.childText}>
                  この度はお問い合わせいただきありがとうございました。
                  <br />
                  メールにて日時等の詳細をご案内しておりますのでご確認ください。
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={listCssTitle()}>
          <div className={styles.nameBooked}>
            <NameCalendar />
          </div>

          <div className={styles.empty} />
        </div>

        <div className={listCssContentBooking()}>
          <div className={styles.settingCalendar}>
            <div className={styles.infoSettingItem}>
              <BackgroundImage listCss={styles.imageCustomer} />
            </div>

            <div className={styles.infoSettingItem}>
              <Commit isViewB={true} />
            </div>

            <div className={styles.infoSettingItem}>
              <TimeSetting />
              <div ref={scrollBottomRef} />
            </div>
            <div className={styles.bookingTime}>{showTimeBooked()}</div>
          </div>
          {renderStepBooking()}
        </div>
      </div>
    );
  };

  const showTimeBooked = () => {
    if (!timeBooked) {
      return;
    }
    return (
      <div className={`${styles.infoSettingItem} ${styles.dividerPage}`}>
        <div className={styles.subStepTitle}>
          <div className={`${styles.title} ${styles.blackTitleLine}`}>
            <div className={`${styles.bolderColIcon} ${styles.mgr12}`} />
            <b>選択日時</b>
          </div>
        </div>
        <div className={styles.pdf1dot4Rem}>
          <span>
            {getJPFullDate(timeBooked.start_time)}
            {moment(timeBooked.start_time).format('(dd)')}
          </span>{' '}
          {moment(timeBooked.start_time).format(HOUR_FORMAT)} -{' '}
          {moment(timeBooked.end_time).format(HOUR_FORMAT)}
        </div>
      </div>
    );
  };

  return <Spin spinning={isLoadingTemplate}>{renderView()}</Spin>;
};

export default connect(({ SETTING_TEMPLATE }) => ({
  settingTemplateStore: SETTING_TEMPLATE,
}))(BookCalendarEmbed);

import React, { useEffect, useState } from 'react';
import styles from './style.less';
import { Input, Spin, message } from 'antd';
import { connect } from 'dva';
import useWindowDimensions from '@/commons/useWindowDimensions';
import { history, useDispatch } from 'umi';
import { copyText } from '@/commons/function';
import {
  canStartAt,
  checkEventBooked,
  createTimeAsync,
  filterReceptionTime,
  formatTime,
  getJPMonthAndDay,
  groupBy,
  isOverlap,
  sortDate,
  splitRange,
} from '../../commons/function';
import moment from 'moment';
import { FORMAT_DATE, YYYYMMDD, YYYYMMDDTHHmm } from '../../constant';
import config from '../../config';

const { TextArea } = Input;
const CalendarCreationCopy = ({
  // action
  onGetNotifyAskCalendar,
  onUpdateNotifyAskCalendar,
  onUpdateNameCalendar,
  onReloadBlockTime,
  onGetGuestEventClient,
  onGetDetailEvent,
  onGenerateCodeCopyUrlOnce,
  //state
  eventStore,
  availableTime,
}) => {
  const {
    isLoading,
    listTextAskCalendar,
    copyEvent,
    listFreeDay,
    firstSetupFreeTime,
    eventCustomizeDates,
    guestEventClients,
  } = eventStore;
  const { calendarHeaders, bookedEvents, customizeDayOnOff } = availableTime;

  const [formAskCalendar, setTextAskCalendar] = useState(undefined);
  const [updateAskCalendar, setUpdateAskCalendar] = useState({
    checked: false,
    count: 0,
  });
  const { width } = useWindowDimensions();
  const { event_id } = history.location.query;
  const dispatch = useDispatch();
  const [listBlockTime, setListTime] = useState([]);
  const [nameEventNew, setNameEventNew] = useState('');
  const [urlLinkEvent, setUrlLinkEvent] = useState('');
  const [eventForm, setEventForm] = useState({
    blockName: '',
    locationName: '',
  });
  const [isLoadTextAskCalendar, setReloadTextAsk] = useState(true);
  useEffect(() => {
    if (Object.keys(listTextAskCalendar).length && isLoadTextAskCalendar) {
      reloadFormAskCalendar();
      setReloadTextAsk(false);
    }
  }, [eventStore]);

  useEffect(() => {
    if (urlLinkEvent) {
      reloadFormAskCalendar();
    }
  }, [urlLinkEvent]);

  useEffect(() => {
    const { checked, count } = updateAskCalendar;
    if (count) {
      if (!checked) {
        onUpdateNotifyAskCalendar(listTextAskCalendar);
        reloadFormAskCalendar();
      }
      if (checked) {
        const listValueText = formAskCalendar.split('\n');
        const indexSplit = [];
        let textTop;
        let textBottom;
        listValueText.filter((item, index) => {
          if (item.includes('----')) {
            indexSplit.push(index);
          }
        });
        listValueText.filter((item, index) => {
          const indexLast = indexSplit[1];
          if (index < indexSplit[0]) {
            if (!index) {
              textTop = item;
            }
            if (index) {
              textTop += '\n' + item;
            }
          }
          if (index > indexLast) {
            if (index - indexLast === 1) {
              textBottom = item;
            } else {
              textBottom += '\n' + item;
            }
          }
        });
        if (textTop && textBottom) {
          onUpdateNotifyAskCalendar({
            text_ask_calendar_top: textTop,
            text_ask_calendar_bottom: textBottom,
          });
        }
      }
    }
  }, [updateAskCalendar]);

  useEffect(() => {
    if (!event_id) {
      history.push('/');
    }
    dispatch({
      type: 'EVENT/getFreeTime',
      payload: { event_id: event_id },
    });
    fetchData();
    onGetNotifyAskCalendar();
    return () => {
      onReloadBlockTime();
    };
  }, []);

  useEffect(() => {
    if (!copyEvent || !copyEvent?.id) {
      return;
    }
    const {
      name,
      block_name,
      location_name,
      relationship_type,
      is_manual_setting,
    } = copyEvent;

    if (!name.includes('お打合せ')) {
      setNameEventNew(name);
    }
    setEventForm({
      blockName: block_name,
      locationName: location_name,
    });
    generateUrlCopy();

    if (relationship_type === 1) {
      generateCopyEventBlockTime();
    }
    if (relationship_type === 3) {
      generateCopyVoteBlockTime();
    }
    setReloadTextAsk(true);
  }, [copyEvent]);

  const listTime = () => {
    let listTime;
    if (listBlockTime.length) {
      listBlockTime.map((item, index) => {
        const { timeFormat } = item;
        if (!index) {
          listTime = timeFormat;
        }
        if (index) {
          listTime += `\n${timeFormat}`;
        }
      });
    }
    return listTime;
  };

  const reloadFormAskCalendar = () => {
    const {
      text_ask_calendar_bottom,
      text_ask_calendar_top,
    } = listTextAskCalendar;
    const listTimeBlock = listTime();
    let e = `
--------------------------
■候補日時`;

    if (listTimeBlock) {
      e += `\n` + listTimeBlock;
    }
    e += `\n■ご予約方法
下記URLからご予約いただくか、ご都合の良い日時をご連絡ください。
${urlLinkEvent}\n
※最新もしくはその他の日時も上記URLからご確認いただくことができ、ご予約も可能です。\n
 ■お打ち合わせ内容
 ミーティング時間：${eventForm.blockName}
 ミーティング方法：${eventForm.locationName}
 --------------------------`;

    const listTextAsk =
      text_ask_calendar_top + e + '\n' + text_ask_calendar_bottom;

    setTextAskCalendar(listTextAsk);
  };

  const updateNameCalendar = () => {
    if (event_id) {
      onUpdateNameCalendar({
        event_id: event_id,
        event_name: nameEventNew,
      });
    }
  };

  const copyUrl = () => {
    if (urlLinkEvent) {
      copyText(urlLinkEvent);

      message.success('URLをコピーしました。');
    }
  };
  const copyTextAskCalendar = () => {
    if (formAskCalendar) {
      copyText(formAskCalendar);

      message.success('定型文をコピーしました。');
    }
  };
  const checkBoxAskCalendar = () => {
    return (
      <div className={styles.checkboxAskCalendar}>
        <input
          type="checkbox"
          id="vehicle1"
          name="vehicle1"
          checked={updateAskCalendar.checked}
          onChange={e => {
            setUpdateAskCalendar({
              checked: e.target.checked,
              count: updateAskCalendar.count + 1,
            });
          }}
        />
        <label htmlFor="vehicle1">
          <div>
            <p>次回からこの文章を定型文として利用する</p>
            {/*<p>*/}
            {/*  ※定型文内の<span>青文字箇所</span>は定型文として保存できません。*/}
            {/*</p>*/}
            {/*<p>またコピーの際の色は青文字ではありません。</p>*/}
            <p>
              ※上記内の「—（点線）と―（点線）の間のテキスト」(つまり、候補日時・ご予約方法・お打ち合わせ内容)は保存できません。
            </p>
          </div>
        </label>
      </div>
    );
  };

  const fetchData = async () => {
    await onGetDetailEvent(event_id);
  };

  // ==================START AUTO GENERATE TOOLS==================
  const generateValidTimeForCopy = (eventInfo, maxBlock = 5, maxPerDay = 2) => {
    let results = [];

    // group by date
    let freeDayGroupByDate = [];
    if (listFreeDay.length) {
      freeDayGroupByDate = groupBy('dateStr')(listFreeDay);
    }
    let members = [];
    let eventBooked = [];
    if (guestEventClients && guestEventClients.length) {
      members = guestEventClients.map(e => {
        eventBooked.push(...e.events);
        return {
          option: e.option,
          checked: true,
          id: e.email,
        };
      });
    }

    const currentStartWeekDate = moment();
    let i = 0;

    if (
      eventInfo.reservation_number &&
      eventInfo.reservation_number < maxBlock
    ) {
      maxBlock = eventInfo.reservation_number;
    }

    // only generate 4 week, and break if can not generate continue
    let generatedDate = 0;
    // max block is max day
    while (generatedDate < maxBlock && i < 28) {
      const validDate = moment(currentStartWeekDate)
        .add(i++, 'd')
        .format(FORMAT_DATE);
      let validBlocks = freeDayGroupByDate[validDate];
      if (validBlocks && validBlocks.length) {
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
          item.timeFormat = formatTime(item);
          item.start = moment(item.start_time).format(YYYYMMDDTHHmm);
          item.end = moment(item.end_time).format(YYYYMMDDTHHmm);
          return item;
        });

        // filter reception_start_time
        validBlocks = filterReceptionTime(
          validBlocks,
          eventInfo.reception_start_time + eventInfo.move_number || 0,
        );

        // slice max block per day
        validBlocks = validBlocks.slice(0, maxPerDay);

        if (validBlocks.length > 0) {
          generatedDate++;
        }
        results = [...results, ...validBlocks];
        continue;
      }

      // not auto generate if is manual setting
      if (eventInfo.is_manual_setting) {
        continue;
      }

      // generate by default setting
      let defaultValidBlocks = generateDefaultSettingForDate(
        validDate,
        eventInfo,
      );

      // filter checked user
      if (guestEventClients && guestEventClients.length) {
        const currentWeekEventbook = eventBooked.filter(e => {
          return moment(e.start_time).isSame(moment(validDate), 'day');
        });

        defaultValidBlocks = defaultValidBlocks.filter(e => {
          return !checkEventBooked(
            e.start_time,
            e.end_time,
            currentWeekEventbook,
            members,
          );
        });
      }
      // only gget max block per day
      defaultValidBlocks = defaultValidBlocks.slice(0, maxPerDay);

      if (defaultValidBlocks.length > 0) {
        generatedDate++;
      }
      results = [...results, ...defaultValidBlocks];
    }
    return results;
  };

  // Generate block cho 1 ngay theo setting default
  // Filter advance
  // use firstSetupFreeTime
  // use eventCustomizeDates
  const generateDefaultSettingForDate = (date, eventInfo, maxBlock) => {
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
          .add(eventInfo.move_number || 0)
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

    // split max block
    if (maxBlock) {
      validBlocks = validBlocks.slice(0, maxBlock);
    }

    return validBlocks;
  };

  // ==================END AUTO GENERATE TOOLS==================

  const generateDateManual = () => {
    const { listFreeDay } = eventStore;
    const { listDate } = listFreeDay.reduce(
      (preItem, nextItem) => {
        const { day_of_week } = nextItem;
        const { listDayOfWeek, listDate } = preItem;
        if (!listDate.length) {
          preItem.listDayOfWeek = listDayOfWeek.concat(day_of_week);
          preItem.listDate = listDate.concat({
            ...nextItem,
            timeFormat: formatTime(nextItem),
          });
        }
        if (listDate.length) {
          const count = listDayOfWeek.filter(item => item === day_of_week)
            .length;
          if (count < 2) {
            preItem.listDayOfWeek = listDayOfWeek.concat(day_of_week);
            preItem.listDate = listDate.concat({
              ...nextItem,
              timeFormat: formatTime(nextItem),
            });
          }
        }
        return preItem;
      },
      {
        listDayOfWeek: [],
        listDate: [],
      },
    );

    return listDate.length ? listDate.slice(0, 10) : [];
  };

  const generateCopyEventBlockTime = async () => {
    const { is_manual_setting } = copyEvent;
    let result;

    if (!is_manual_setting) {
      result = generateValidTimeForCopy(copyEvent);
    }
    if (is_manual_setting) {
      result = generateDateManual();
    }
    if (result.length) {
      const listTime = sortDate(result, true);
      setListTime(listTime);
    }
  };

  const generateUrlCopy = async () => {
    let urlCopy;
    const { relationship_type, vote } = copyEvent;
    if (relationship_type === 3) {
      const { full_url } = vote;
      urlCopy = full_url;
    }
    if (relationship_type === 1) {
      let onceCode = await onGenerateCodeCopyUrlOnce({ event_id: event_id });
      urlCopy = `${config.WEB_DOMAIN}/schedule-adjustment/once?event_code=${onceCode}&once=true`;
    }

    setUrlLinkEvent(urlCopy);
  };

  const generateCopyVoteBlockTime = async () => {
    let result = listFreeDay.filter(e => {
      e.dayStr = moment(e.start_time).format(YYYYMMDD);
      e.timeFormat = formatTime(e);
      return moment(e.start_time).isAfter(moment(), 'minutes');
    });
    // generate 5 days , 2 block per day
    let breakResult = [];
    result = groupBy('dayStr')(result);
    let countDay = 0;
    let maxPerday = 2;
    let maxDay = 5;
    for (const [key, value] of Object.entries(result)) {
      if (countDay >= maxDay) {
        break;
      }

      if (value.length) {
        countDay++;

        breakResult = [...breakResult, ...value.slice(0, maxPerday)];
      }
    }
    const listTime = sortDate(breakResult);
    setListTime(listTime);
  };

  return (
    <Spin spinning={isLoading}>
      <div className={styles.calendarCreation}>
        <div className={styles.calendarInfoContent}>
          <div className={styles.stepCalendarTitle}>
            <div className={styles.titleIcon}>
              <div className={styles.bolderColIcon} />
              <div className={styles.normalColIcon} />
            </div>
            <h2>作成が完了しました！</h2>
          </div>
        </div>

        <div className={styles.optionCalendar}>
          <div className={styles.title}>
            <p>日程調整ページ名を設定することができます</p>
            <span>{width <= 768 && '※'}任意</span>
          </div>
          <div className={`${styles.content} ${styles.borderBottom}`}>
            <div className={styles.groupLeft}>
              <input
                type="text"
                placeholder="例）〇〇様とのミーティング"
                value={nameEventNew}
                onChange={e => setNameEventNew(e.target.value)}
              />
            </div>
            <div className={styles.btnRight}>
              <button onClick={updateNameCalendar}>
                <p>設定する</p>
              </button>
            </div>
          </div>
        </div>

        <div className={styles.calendarInfoContent}>
          <div className={styles.stepCalendarTitle}>
            <div className={styles.titleIcon}>
              <div className={styles.bolderColIcon} />
              <div className={styles.normalColIcon} />
            </div>
            <h2>
              あとは<span>URL</span>をコピーするだけで候補日程を
              <br />
              共有できます！
            </h2>
          </div>
        </div>

        <div className={`${styles.optionCalendar} ${styles.mb0}`}>
          <div className={styles.title}>
            <div>
              <span>URL</span>の送付方法 <span>1</span>
            </div>
          </div>

          <div className={`${styles.content}`}>
            <div className={styles.groupLeft}>
              <p>
                URLをコピーして
                <br />
                そのまま送付することができます
              </p>
            </div>
            <div className={styles.btnRight}>
              <button onClick={copyUrl}>
                <span>URL</span>をコピー
              </button>
            </div>
          </div>
        </div>

        <div className={styles.optionCalendar}>
          <div className={styles.title}>
            <div>
              <span>URL</span>の送付方法 <span>2</span>
            </div>
          </div>

          <div className={`${styles.content} ${styles.pd1}`}>
            <div className={styles.groupLeft}>
              <p>
                URLを含んだ定型文を
                <br />
                コピーすることができます
              </p>

              <div className={styles.formAskCalendar}>
                <TextArea
                  value={formAskCalendar}
                  rows={6}
                  onChange={e => setTextAskCalendar(e.target.value)}
                />
                {checkBoxAskCalendar()}
              </div>
            </div>

            <div className={`${styles.btnRight} ${styles.mt5}`}>
              <button onClick={copyTextAskCalendar}>
                <p>定型文をコピー</p>
              </button>
            </div>
          </div>
          <div className={styles.formAskCalendar}>
            <TextArea
              value={formAskCalendar}
              rows={6}
              onChange={e => setTextAskCalendar(e.target.value)}
            />
            {checkBoxAskCalendar()}
          </div>
        </div>
      </div>
    </Spin>
  );
};
const mapStateToProps = ({ EVENT, AVAILABLE_TIME }) => ({
  availableTime: AVAILABLE_TIME,
  eventStore: EVENT,
});

function mapDispatchToProps(dispatch) {
  return {
    onGetNotifyAskCalendar: () =>
      dispatch({ type: 'EVENT/getNotifyAskCalendar' }),
    onUpdateNotifyAskCalendar: payload =>
      dispatch({ type: 'EVENT/updateAskNotifyCalendar', payload }),
    onUpdateNameCalendar: payload =>
      dispatch({ type: 'EVENT/updateNameCalendar', payload }),
    onReloadBlockTime: () => dispatch({ type: 'EVENT/reloadListBlockTime' }),
    onGetDetailEvent: eventId =>
      dispatch({
        type: 'EVENT/fetchEventForCopy',
        payload: { eventTypeId: eventId },
      }),
    onGetGuestEventClient: payload =>
      dispatch({ type: 'EVENT/getGuestEventClient', payload }),
    onGenerateCodeCopyUrlOnce: payload =>
      dispatch({ type: 'EVENT/generateOnceEventCode', payload }),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CalendarCreationCopy);

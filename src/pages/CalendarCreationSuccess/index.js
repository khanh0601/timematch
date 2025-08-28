import React, { useEffect, useState } from 'react';
import styles from '../CalendarCreationCopy/style.less';
import { Input, Spin } from 'antd';
import { connect } from 'dva';
import useWindowDimensions from '@/commons/useWindowDimensions';
import { history } from 'umi';
import moment from 'moment';
import {
  groupBy,
  isOverlap,
  splitRange,
  createTimeAsync,
  canStartAt,
  checkEventBooked,
  filterReceptionTime,
} from './../../commons/function';
import { FORMAT_DATE } from './../../constant';

const { TextArea } = Input;
const CalendarCreationSuccess = ({
  onGetNotifyAskCalendar,
  onUpdateNotifyAskCalendar,
  onUpdateNameCalendar,
  eventStore,
  onGetDetailEvent,
  onGetGuestEventClient,
}) => {
  const { isLoading } = eventStore;
  const [formAskCalendar, setTextAskCalendar] = useState(undefined);
  const [updateAskCalendar, setUpdateAskCalendar] = useState(false);
  const [event_name, setEventName] = useState('');
  const { width } = useWindowDimensions();
  const {
    listTextAskCalendar,
    copyEvent,
    listFreeDay,
    firstSetupFreeTime,
    eventCustomizeDates,
    guestEventClients,
  } = eventStore;

  const eventId = history.location.query.event_id;

  useEffect(() => {
    if (!eventId) {
      history.push('/');
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!copyEvent || !copyEvent.id) {
      return;
    }

    generateCopyEventBlockTime();
  }, [copyEvent]);

  useEffect(() => {
    if (Object.keys(listTextAskCalendar).length) {
      const {
        text_ask_calendar_bottom,
        text_ask_calendar_top,
      } = listTextAskCalendar;
      const list = text_ask_calendar_top + '\n' + text_ask_calendar_bottom;
      setTextAskCalendar(list);
    }
  }, [eventStore]);
  useEffect(() => {
    onUpdateNotifyAskCalendar(listTextAskCalendar);
  }, [updateAskCalendar]);

  useEffect(() => {
    onGetNotifyAskCalendar();
  }, []);

  const fetchData = async () => {
    await onGetDetailEvent(eventId);
  };

  const onSubmitAskCalendar = () => {};
  const updateNameCalendar = () => {
    onUpdateNameCalendar({
      event_id: '',
      event_name,
    });
  };

  const checkBoxAskCalendar = () => {
    return (
      <div className={styles.checkboxAskCalendar}>
        <input
          type="checkbox"
          id="vehicle1"
          name="vehicle1"
          checked={updateAskCalendar}
          onChange={e => setUpdateAskCalendar(e.target.checked)}
        />
        <label htmlFor="vehicle1">
          <div>
            <p>次回からこの文章を定型文として利用する</p>
            <p>※定型文内の青文字箇所は定型文として保存できません。</p>
            <p>またコピーの際の色は青文字ではありません。</p>
          </div>
        </label>
      </div>
    );
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
      return item.day_of_week == dayOfWeek;
    });

    // handle customize day
    const haveCustomize = eventCustomizeDates.find(item => {
      return moment(item.date).isSame(moment(date), 'day');
    });

    let settings = {};

    if (haveCustomize) {
      if (haveCustomize.status == 0) {
        return [];
      }

      if (settingOfDayOfWeek) {
        settings = settingOfDayOfWeek;
      } else {
        settings.start_time = '09:00';
        settings.end_time = '18:00';
      }
    } else {
      if (!settingOfDayOfWeek) {
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

  const generateCopyEventBlockTime = async () => {
    if (!copyEvent.is_manual_setting) {
      const { startTime, endTime } = createTimeAsync();

      // TODO: get data
      // await onGetGuestEventClient({
      //   event_code: onceCode,
      //   need_sync: false,
      //   start: startTime,
      //   end: endTime,
      // });
    }

    const result = generateValidTimeForCopy(copyEvent);
  };

  const generateCopyVoteBlockTime = async () => {};

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
                value={event_name}
                onChange={e => setEventName(e.target.value)}
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
              あとはURLをコピーするだけで候補日程を
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
              <button>
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
                  rows={4}
                  onChange={e => setTextAskCalendar(e.target.value)}
                />
                {checkBoxAskCalendar()}
              </div>
            </div>

            <div className={`${styles.btnRight} ${styles.mt5}`}>
              <button onClick={onSubmitAskCalendar}>
                <p>定型文をコピー</p>
              </button>
            </div>
          </div>
          <div className={styles.formAskCalendar}>
            <TextArea
              value={formAskCalendar}
              rows={4}
              onChange={e => setTextAskCalendar(e.target.value)}
            />
            {checkBoxAskCalendar()}
          </div>
        </div>
      </div>
    </Spin>
  );
};

const mapStateToProps = ({ EVENT }) => ({
  eventStore: EVENT,
});

function mapDispatchToProps(dispatch) {
  return {
    onGetNotifyAskCalendar: () =>
      dispatch({ type: 'EVENT/getNotifyAskCalendar' }),
    onUpdateNotifyAskCalendar: payload =>
      dispatch({ type: 'EVENT/updateNotifyAskCalendar', payload }),
    onUpdateNameCalendar: payload =>
      dispatch({ type: 'EVENT/updateNameCalendar', payload }),
    onGetDetailEvent: eventId =>
      dispatch({
        type: 'EVENT/fetchEventForCopy',
        payload: { eventTypeId: eventId },
      }),
    onGetGuestEventClient: payload =>
      dispatch({ type: 'EVENT/getGuestEventClient', payload }),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CalendarCreationSuccess);

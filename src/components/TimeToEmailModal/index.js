import { copyFormatted, copyText, getWeekDuration } from '@/commons/function';
import config from '@/config';
import {
  DEFAULT_CUSTOM_TYPE,
  DEFAULT_DATE_TIMES,
  DOW_NAME,
  FORMAT_DATE,
  FORMAT_DATE_TEXT_2,
  FORMAT_HOUR,
  FULL_DATE_TIME,
} from '@/constant';
import { message, Modal, Spin } from 'antd';
import dayjs from 'dayjs';
import { connect } from 'dva';
import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'umi';
import CalendarTimeToEmail from '../CalendarTimeToEmail';
import styles from './styles.less';
import {
  canStartAt,
  checkEventBooked,
  copyRichText,
  filterReceptionTime,
  formatTime,
  groupBy,
  isOverlap,
  splitRange,
} from '../../commons/function';
import moment from 'moment';
import { YYYYMMDDTHHmm } from '../../constant';

const DATE_FORMAT = 'YYYY-MM-DD';

const formatDate = date => {
  return date ? dayjs(date).format(FORMAT_DATE) : dayjs().format(FORMAT_DATE);
};

const getDefaultBlockTimes = (dateObj, event) => {
  const { start_time, end_time, status } = dateObj;
  const { relax_time = 0, block_number = 0 } = event;
  const result = [];
  const sHour = start_time.split(':')[0];
  const sMinute = start_time.split(':')[1];
  const eHour = end_time.split(':')[0];
  const eMinute = end_time.split(':')[1];
  const countBlockTimes = ((eHour - sHour) * 60) / (block_number + relax_time);

  for (let i = 0; i < countBlockTimes; i++) {
    let start_time = dayjs()
      .hour(sHour)
      .minute(sMinute)
      .add(relax_time * i + block_number * i, 'minute')
      .format(FULL_DATE_TIME);
    let end_time = dayjs()
      .hour(sHour)
      .minute(sMinute)
      .add(relax_time * i + block_number * i + block_number, 'minute')
      .format(FULL_DATE_TIME);
    result.push({
      start_time,
      end_time,
      status,
    });
  }
  return result;
};

const getDefaultDateTimes = (listDefaultTime = [], event) => {
  const result = {};
  const list = listDefaultTime.length
    ? listDefaultTime.filter(item => item.status)
    : DEFAULT_DATE_TIMES.filter(item => item.status);

  for (const item of list) {
    result[item.day_of_week] = getDefaultBlockTimes(item, event);
  }

  return result;
};

function TimeToEmailModal(props) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const { visible, closeModal, eventStore, profile, dispatch } = props;
  const {
    currentEvent,
    listFreeDay,
    firstSetupFreeTime,
    isSelectEvent,
    isLoading,
    eventCustomizeDates,
  } = eventStore;
  const [selectedDate, setSelectedDate] = useState({});
  const [dayObj, setDayObj] = useState(dayjs().startOf('week'));
  const [weekDays, setWeekDays] = useState({});
  const [countWeek, setCountWeek] = useState(0);
  const [lastDay, setLastDay] = useState(undefined);
  const [firstDay, setFirstDay] = useState(undefined);

  const listTimeBooked = async () => {
    const { event_code, user } = currentEvent;
    const listDateSelect = Object.keys(selectedDate);
    const payload = {
      event_code: event_code,
      user_code: user.code,
      need_sync: true,
      start: listDateSelect[0],
      end: listDateSelect[listDateSelect.length - 1],
    };
    // get all A schedule calendar
    // getGuestEventClient
    return await dispatch({
      type: 'EVENT/getGuestEventClient',
      payload,
    });
  };

  const findLastDay = (list = []) => {
    let max = dayjs().valueOf();

    list.forEach(item => {
      if (dayjs(item).valueOf() > max) {
        max = dayjs(item).valueOf();
      }
    });

    return max;
  };

  const findFirstDay = (list = []) => {
    let min = list.length ? dayjs(list[0]).valueOf() : 0;

    list.forEach(item => {
      if (dayjs(item).valueOf() < min) {
        min = dayjs(item).valueOf();
      }
    });

    return min;
  };

  const checkSameWeek = (start, end) => {
    const startOfWeek = dayjs(start)
      .startOf('week')
      .valueOf();
    const limit = 24 * 6 * 3600 * 1000;
    if (start - startOfWeek < limit && end - startOfWeek < limit) {
      return true;
    }
    return false;
  };

  const renderMoreDate = useCallback(() => {
    const { period } = currentEvent;
    const infinite = !period;
    const diff = dayjs(formatDate(lastDay)).diff(formatDate(dayObj), 'day');
    const totalWeek = dayjs(formatDate(lastDay)).diff(formatDate(), 'week');
    if (infinite && diff < countWeek * 7) {
      const list = getDefaultDateTimes(firstSetupFreeTime, currentEvent);
      const listConvert = {};
      const newDayObj = dayjs(lastDay).add(1, 'week');
      for (const key in list) {
        const newKey = newDayObj.day(key).format(FORMAT_DATE);
        listConvert[newKey] = list[key];
        const newKey2 = newDayObj
          .day(key)
          .add(1, 'week')
          .format(FORMAT_DATE);
        listConvert[newKey2] = list[key];
      }

      const newLastDay = findLastDay(Object.keys(listConvert));
      setWeekDays({ ...listConvert, ...weekDays });
      setLastDay(newLastDay);
    }

    if (!infinite && totalWeek < period) {
      const list = getDefaultDateTimes(firstSetupFreeTime, currentEvent);
      const listConvert = {};
      for (const key in list) {
        for (let i = 1; i < period - totalWeek; i++) {
          const newKey = dayjs()
            .add(totalWeek + i, 'week')
            .day(key)
            .format(FORMAT_DATE);
          listConvert[newKey] = list[key];
        }
      }

      setWeekDays({ ...listConvert, ...weekDays });
    }
  }, [dayObj, countWeek, currentEvent, firstSetupFreeTime, firstDay, lastDay]);

  useEffect(() => {
    renderMoreDate();
  }, [renderMoreDate]);

  const breakBlockTimes = list => {
    const result = [];
    const { relax_time = 0, block_number } = currentEvent;

    for (const item of list) {
      const start = item.start_time;
      const end = item.end_time;
      if (dayjs(end).diff(start, 'minute') > block_number) {
        const countSubBlockTime =
          ((dayjs(end).hour() - dayjs(start).hour()) * 60) /
          (block_number + relax_time);
        for (let i = 0; i < countSubBlockTime; i++) {
          const start_time = dayjs(start)
            .add(relax_time * i + block_number * i, 'minute')
            .format(FULL_DATE_TIME);
          const end_time = dayjs(start)
            .add(relax_time * i + block_number * i + block_number, 'minute')
            .format(FULL_DATE_TIME);
          result.push({
            start_time,
            end_time,
          });
        }
      } else {
        result.push(item);
      }
    }

    return result;
  };

  const convertListWeekDay = useCallback(() => {
    const result = {};
    const { period } = currentEvent;
    const infinite = period ? false : true;
    const convertListFreeDay = listFreeDay.filter(day => day.status);
    const convertListStartTime = convertListFreeDay.map(
      item => item.start_time.split(' ')[0],
    );

    const countDuration = isSelectEvent
      ? convertListFreeDay.length
        ? getWeekDuration(convertListFreeDay) || 1
        : 1
      : 0;
    const lastDay = findLastDay(convertListStartTime);
    const firstDay = findFirstDay(convertListStartTime);

    for (const item of convertListFreeDay) {
      const dateFormat = formatDate(item.start_time);

      if (result[dateFormat]) {
        result[dateFormat] = [...result[dateFormat], item];
      } else {
        result[dateFormat] = [item];
      }
    }

    const splitBlockTimes = {};
    for (const key in result) {
      splitBlockTimes[key] = breakBlockTimes(result[key]);
    }

    const listConvert = {};
    if (isSelectEvent && infinite && !checkSameWeek(firstDay, lastDay)) {
      const list = getDefaultDateTimes(firstSetupFreeTime, currentEvent);
      const newDayObj = dayjs(lastDay);
      for (const key in list) {
        const newKey = newDayObj.day(key).format(FORMAT_DATE);
        listConvert[newKey] = list[key];
        const newKey2 = newDayObj
          .day(key)
          .add(1, 'week')
          .format(FORMAT_DATE);
        listConvert[newKey2] = list[key];
      }
    }

    setLastDay(lastDay);
    setFirstDay(firstDay);
    setCountWeek(countDuration);
    setWeekDays({ ...listConvert, ...splitBlockTimes });
  }, [listFreeDay, firstSetupFreeTime]);

  useEffect(() => {
    convertListWeekDay();
  }, [convertListWeekDay]);

  // ==================START AUTO GENERATE TOOLS==================
  const generateValidTimeForCopy = (eventInfo, guestEventClients) => {
    let results = {};
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

    const listDateSelect = Object.keys(selectedDate);
    let i = 0;
    // max block is max day
    while (i < listDateSelect.length) {
      const validDate = listDateSelect[i];
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
        validBlocks = validBlocks.slice(0, 3);

        results = {
          ...results,
          [listDateSelect[i]]: validBlocks,
        };
        i++;
        continue;
      }

      // not auto generate if is manual setting
      if (eventInfo.is_manual_setting) {
        i++;
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
      defaultValidBlocks = defaultValidBlocks.slice(0, 3);

      results = {
        ...results,
        [listDateSelect[i]]: defaultValidBlocks,
      };
      i++;
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

        return !duplicate;
      }

      return true;
    });

    // split max block
    if (maxBlock) {
      validBlocks = validBlocks.slice(0, maxBlock);
    }

    return validBlocks;
  };

  const renderColumnData = rowDate => {
    const date = rowDate[0];
    let dateToRender = [...rowDate[1]];

    const availableBefore = currentEvent.reception_start_time
      ? currentEvent.reception_start_time / 60
      : 0;

    if (dayjs(date).format(DATE_FORMAT) === dayjs().format(DATE_FORMAT)) {
      dateToRender = dateToRender.filter(
        item =>
          dayjs(item.start_time).hour() +
            dayjs(item.start_time).minute() / 60 -
            availableBefore >
          dayjs().hour() + dayjs().minute() / 60,
      );
    }

    dateToRender = dateToRender
      .sort(
        (a, b) =>
          dayjs(a.start_time).hour() - dayjs(b.start_time).hour() ||
          dayjs(a.start_time).minute() - dayjs(b.start_time).minute(),
      )
      .slice(0, 3);

    return dateToRender;
  };

  const generateOnceCode = () => {
    return dispatch({
      type: 'EVENT/generateOnceEventCode',
      payload: { event_id: currentEvent.id },
    });
  };

  const renderTimeColumn = (rowDate, onceCode) => {
    const date = rowDate[0];
    let result = '';

    const dateToRender = renderColumnData(rowDate);
    for (let i = 0; i < dateToRender.length; i++) {
      const sHour = dayjs(dateToRender[i].start_time).hour();
      const sMinute = dayjs(dateToRender[i].start_time).minute();
      const eHour = dayjs(dateToRender[i].end_time).hour();
      const eMinute = dayjs(dateToRender[i].end_time).minute();
      const startTime = dayjs(date)
        .hour(sHour)
        .minute(sMinute)
        .valueOf();
      const endTime = dayjs(date)
        .hour(eHour)
        .minute(eMinute)
        .valueOf();
      const customType = dateToRender[i].custom_type
        ? dateToRender[i].custom_type
        : DEFAULT_CUSTOM_TYPE;

      result += `<div style="padding:4px 15px 4px 10px; width: 156px;">
          <p style="box-sizing: inherit; margin: 0px; padding: 0px;">
            <a
              href=${
                config.WEB_DOMAIN
              }/schedule-adjustment/once?once=true&event_code=${onceCode}&user_code=${
        profile.code
      }&start_time=${startTime}&end_time=${endTime}&custom_type=${customType}
              style="box-sizing: inherit; color: #33c3c7; text-decoration-line: none; text-align: center; cursor: pointer; display: block; padding-top: 10px; padding-bottom: 10px; border: 2px solid #33c3c7; border-radius: 20px;"
            >
              ${dayjs(dateToRender[i].start_time).format(
                FORMAT_HOUR,
              )} ~ ${dayjs(dateToRender[i].end_time).format(FORMAT_HOUR)}
            </a>
          </p>
        </div>`;
    }

    return result;
  };

  const renderTableData = listDate => {
    let sortable = [];
    for (const key in listDate) {
      sortable.push([dayjs(key).valueOf(), breakBlockTimes(listDate[key])]);
    }
    sortable.sort((a, b) => a[0] - b[0]);
    return sortable;
  };

  const renderTableContent = (onceCode, listTime) => {
    let result = '';
    const arrayDayName = DOW_NAME.map(item => item.name_jp);
    const sortable = renderTableData(listTime);
    // const data =
    for (const item of sortable) {
      result += `<br><div>
        <div style="text-align: center; width: 156px; padding:0 15px 0 10px;">
          ${dayjs(item[0]).format(FORMAT_DATE_TEXT_2)} (${
        arrayDayName[dayjs(item[0]).day()]
      })
        </div>
        <div style="border-bottom: 1px solid #707070; margin: 20px 0; width: 182px;"></div>
        ${renderTimeColumn(item, onceCode)}
      </div>`;
    }
    return result;
  };

  const renderColumnSafari = rowDate => {
    const dateToRender = renderColumnData(rowDate);
    let result = '';
    for (let i = 0; i < dateToRender.length; i++) {
      result += `
              ${dayjs(dateToRender[i].start_time).format(FORMAT_HOUR)} \n`;
    }
    return result;
  };

  const renderTableSafari = listTime => {
    let result = '';
    const arrayDayName = DOW_NAME.map(item => item.name_jp);
    const sortable = renderTableData(listTime);
    for (const item of sortable) {
      result += `
          ${dayjs(item[0]).format(FORMAT_DATE_TEXT_2)} (${
        arrayDayName[dayjs(item[0]).day()]
      })\n
        ${renderColumnSafari(item)}`;
    }
    return result;
  };

  const copyModalOptions = async () => {
    const onceCode = await generateOnceCode();
    const data = await listTimeBooked();
    const listTime = generateValidTimeForCopy(currentEvent, data);

    const ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('safari') !== -1) {
      if (ua.indexOf('chrome') > -1) {
        const result = `<div style="box-sizing: inherit; border-bottom: 1px solid rgb(208, 208, 208); border-top: 1px solid rgb(208, 208, 208); padding-bottom: 3px; font-size: 13px; background-color: white; line-height: 1.4; width: 590px; color: black;">
      <div style="box-sizing: inherit; margin-top: 20px;">ご都合のいい日程を下記よりご選択ください。</div><br>
      <div style="display: flex; margin: 10px 0 10px; align-items: center;">
        <div style="width: 8px; height: 18px; background-color: black; margin-right: 8px;"></div>
        <div>日程</div>
      </div>
      <div style="display: flex;">
        ${renderTableContent(onceCode, listTime)}
      </div><br>
      <div style="margin-top: 10px;">※上記以外の日程は下記よりご確認ください。</div>
      <div><a style="cursor: pointer;" href=${
        config.WEB_DOMAIN
      }/schedule-adjustment/once?event_code=${onceCode}&once=true>${
          config.WEB_DOMAIN
        }/schedule-adjustment/once?event_code=${onceCode}&once=true</a></div>
      <div style="margin-top: 30px;">日程調整便利ツールの<a href=${
        config.WEB_DOMAIN
      } style="text-decoration: none; color: #33c3c7; cursor: pointer;">Smoothly</a>を利用しています</div>
    </div>`;
        // copyRichText(result);
        copyFormatted(result);
      } else {
        setTimeout(() => {
          copyText(
            'ご都合のいい日程を下記よりご選択ください。\n\n日程\n\n' +
              renderTableSafari(listTime) +
              '\n\n※上記以外の日程は下記よりご確認ください。\n日程調整便利ツールのSmoothlyを利用しています',
          );
        }, 0);
      }
    }
    if (ua.indexOf('firefox') !== -1) {
      const result = `<div style="box-sizing: inherit; border-bottom: 1px solid rgb(208, 208, 208); border-top: 1px solid rgb(208, 208, 208); padding-bottom: 3px; font-size: 13px; background-color: white; line-height: 1.4; width: 590px; color: black;">
      <div style="box-sizing: inherit; margin-top: 20px;">ご都合のいい日程を下記よりご選択ください。</div><br>
      <div style="display: flex; margin: 10px 0 10px; align-items: center;">
        <div style="width: 8px; height: 18px; background-color: black; margin-right: 8px;"></div>
        <div>日程</div>
      </div>
      <div style="display: flex;">
        ${renderTableContent(onceCode, listTime)}
      </div><br>
      <div style="margin-top: 10px;">※上記以外の日程は下記よりご確認ください。</div>
      <div><a style="cursor: pointer;" href=${
        config.WEB_DOMAIN
      }/schedule-adjustment/once?event_code=${onceCode}&once=true>${
        config.WEB_DOMAIN
      }/schedule-adjustment/once?event_code=${onceCode}&once=true</a></div>
      <div style="margin-top: 30px;">日程調整便利ツールの<a href=${
        config.WEB_DOMAIN
      } style="text-decoration: none; color: #33c3c7; cursor: pointer;">Smoothly</a>を利用しています</div>
    </div>`;
      // copyRichText(result, 'email');
      copyFormatted(result);
    }

    setSelectedDate({});
    closeModal();
    message.success(formatMessage({ id: 'i18n_copy_time_success' }));
  };

  const handleIsSelectEvent = () => {
    dispatch({ type: 'EVENT/updateIsSelectEvent', payload: false });
  };

  return (
    <Modal
      visible={visible}
      onCancel={() => {
        setDayObj(dayjs().startOf('week'));
        handleIsSelectEvent();
        closeModal();
      }}
      maskClosable={false}
      wrapClassName={styles.ModalContainer}
      cancelButtonProps={{
        className: 'btn btn-grey btn-small',
      }}
      okButtonProps={{
        className: 'btn btnGreen btn-small',
        disabled: Object.keys(selectedDate).length === 0,
      }}
      closable={false}
      cancelText={formatMessage({ id: 'i18n_cancel' })}
      okText={formatMessage({ id: 'i18n_update' })}
      onOk={copyModalOptions}
      centered
    >
      <Spin spinning={isLoading}>
        <div className={styles.textLine1}>
          {formatMessage({ id: 'i18n_calendar_text_note_1' })}
        </div>
        <div className={styles.textLine2}>
          {formatMessage({ id: 'i18n_calendar_text_note_2' })}
        </div>
        <CalendarTimeToEmail
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          setDayObj={setDayObj}
          dayObj={dayObj}
          weekDays={weekDays}
          formatDate={formatDate}
        />
      </Spin>
    </Modal>
  );
}

export default connect(({ EVENT }) => ({ eventStore: EVENT }))(
  TimeToEmailModal,
);
